import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { botConfig } from './config.js';
import { connectDB } from './database.js';
import { preguntarIA, chatActivo } from './groq.js';
import { transcribirAudio, generarAudioRespuesta } from './audio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginsPath = path.join(__dirname, 'plugins');

function normalizarJid(jid) {
  const numero = jid.split('@')[0].split(':')[0];
  return numero + '@s.whatsapp.net';
}

await connectDB();

export const plugins = new Map();

// 👇 Caché global de estados vistos
global.statusCache = global.statusCache || {};

async function loadPlugins() {
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const module = await import(`./plugins/${file}`);
      const plugin = module.default;
      if (!plugin || typeof plugin.exec !== 'function') continue;

      let comandos = plugin.command;
      if (typeof comandos === 'string') comandos = [comandos];
      if (!Array.isArray(comandos)) continue;

      for (const cmd of comandos) {
        plugins.set(String(cmd).toLowerCase(), plugin);
      }
    } catch (err) {
      console.log(`⚠️ Error cargando "${file}":`, err.message);
    }
  }
}

export function getUniquePlugins() {
  const seen = new Set();
  const result = [];
  for (const plugin of plugins.values()) {
    if (!seen.has(plugin)) {
      seen.add(plugin);
      result.push(plugin);
    }
  }
  return result;
}

await loadPlugins();

export async function handler(sock, m) {
  // 👇 Captura y guarda cualquier estado que pase, aunque no se use comando
  for (const message of m.messages) {
    if (message.key.remoteJid === 'status@broadcast' && message.message) {
      const lid = message.key.participant || message.participant;
      const real = message.key.participantAlt; // número real, si WhatsApp lo manda

      if (lid) {
        const data = { message, timestamp: Date.now() };
        global.statusCache[lid] = data;

        if (real) {
          const numeroReal = real.split('@')[0].split(':')[0];
          global.statusCache[numeroReal] = data;
        }
      }
    }
  }

  const msg = m.messages[0];
  if (!msg?.message) return;

  const from = msg.key.remoteJid;
  const type = Object.keys(msg.message)[0];

  // --- Manejo de mensajes de audio ---
  if (type === 'audioMessage') {
    const iaEstaActiva = await chatActivo(from);
    if (!iaEstaActiva) return;

    const texto = await transcribirAudio(msg);
    if (!texto) return;

    const respuesta = await preguntarIA(from, texto);
    if (!respuesta) return;

    const audioPath = await generarAudioRespuesta(respuesta);
    if (!audioPath) {
      await sock.sendMessage(from, { text: respuesta }, { quoted: msg });
      return;
    }

    await sock.sendMessage(from, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: msg });

    fs.unlinkSync(audioPath);
    return;
  }

  const body =
    type === 'conversation' ? msg.message.conversation :
    type === 'extendedTextMessage' ? msg.message.extendedTextMessage.text :
    type === 'imageMessage' ? (msg.message.imageMessage.caption || '') :
    '';

  if (!body) return;

  if (!body.startsWith(botConfig.prefix)) {
    const iaEstaActiva = await chatActivo(from);
    if (iaEstaActiva) {
      const respuestaIA = await preguntarIA(from, body);
      if (respuestaIA) {
        await sock.sendMessage(from, { text: respuestaIA }, { quoted: msg });
      }
    }
    return;
  }

  const args = body.slice(botConfig.prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const plugin = plugins.get(cmdName);
  if (!plugin) return;

  const senderRaw = msg.key.participantAlt || msg.key.participant || msg.key.remoteJidAlt || msg.key.remoteJid;
  const sender = normalizarJid(senderRaw);

  sock.sendMessage(from, { react: { text: '📩', key: msg.key } }).catch(() => {});

  try {
    await plugin.exec({ sock, msg, from, args, sender, body });
  } catch (err) {
    console.error(`Error ejecutando "${cmdName}":`, err);
    await sock.sendMessage(from, { text: '❌ Ocurrió un error al ejecutar el comando.' }, { quoted: msg });
  }
}