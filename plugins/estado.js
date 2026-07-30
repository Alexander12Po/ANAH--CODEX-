import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { botConfig } from '../config.js';

export default {
  command: ['estado'],
  exec: async ({ sock, msg, from, args }) => {
    const numero = args[0]?.replace(/\D/g, '');
    if (!numero) {
      return sock.sendMessage(from, {
        text: '📌 Uso: *.estado 51924894999*\n\nUsa *.estados* para ver la lista de contactos con estado disponible.'
      }, { quoted: msg });
    }

    let cached = global.statusCache?.[numero];

    // Si no está por número directo, resolvemos el JID/LID real de ese número
    if (!cached) {
      try {
        const [result] = await sock.onWhatsApp(numero);
        if (result?.lid) {
          const lidNumero = result.lid.split('@')[0];
          cached = global.statusCache?.[lidNumero];
        }
        if (!cached && result?.jid) {
          cached = global.statusCache?.[result.jid];
        }
      } catch (e) {
        console.log('Error resolviendo número:', e.message);
      }
    }

    if (!cached) {
      return sock.sendMessage(from, {
        text: '❌ No tengo ningún estado reciente guardado de ese contacto.\n(El bot solo ve estados mientras está conectado)'
      }, { quoted: msg });
    }

    const ownerJid = `${botConfig.ownerNumber}@s.whatsapp.net`;
    const statusMsg = cached.message;

    try {
      const tipo = statusMsg.message.imageMessage ? 'image'
                 : statusMsg.message.videoMessage ? 'video'
                 : null;

      if (!tipo) {
        const texto = statusMsg.message.extendedTextMessage?.text
                    || statusMsg.message.conversation
                    || '(sin texto)';
        await sock.sendMessage(ownerJid, {
          text: `📝 *Estado de:* wa.me/${numero}\n\n${texto}`
        });
        return sock.sendMessage(from, { text: '✅ Estado (texto) enviado.' }, { quoted: msg });
      }

      const buffer = await downloadMediaMessage(statusMsg, 'buffer', {});

      await sock.sendMessage(ownerJid, {
        [tipo]: buffer,
        caption: `📥 *Estado descargado de:* wa.me/${numero}`
      });

      return sock.sendMessage(from, { text: '✅ Estado enviado a tu número.' }, { quoted: msg });

    } catch (err) {
      console.error('Error descargando estado:', err);
      return sock.sendMessage(from, { text: '⚠️ Error al descargar el estado.' }, { quoted: msg });
    }
  }
};