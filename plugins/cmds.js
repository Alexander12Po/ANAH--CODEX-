import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { botConfig } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['cmds', 'consultas'],
  description: 'Muestra las consultas disponibles (DNI, SOAT, placa, árbol genealógico y más)',
  exec: async ({ sock, from, msg }) => {

    const texto = `╔══════════════════════╗
║ 💕 *${botConfig.botName}*
║ 🍀 CONSULTAS BELLA
╚══════════════════════╝

┏━━━「 🪪 *DOCUMENTOS* 」━━━┓
┃
┃ 🪪 *${botConfig.prefix}dni*
┃    ➜ Datos detallados por DNI
┃
┃ 🖼️ *${botConfig.prefix}dnit*
┃    ➜ Ficha completa con fotos y ubigeos
┃
┃ 📸 *${botConfig.prefix}dnivel*
┃    ➜ DNI con imágenes (rápido)
┃
┃ 📷 *${botConfig.prefix}dniv*
┃    ➜ DNI con imágenes (PNG)
┃
┃ 🌳 *${botConfig.prefix}ag*
┃    ➜ Árbol genealógico y familiares
┃
┃ 🏠 *${botConfig.prefix}dir*
┃    ➜ Historial de direcciones
┃
┃ 👤 *${botConfig.prefix}nm*
┃    ➜ Buscar por nombres y apellidos
┃
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━「 🚗 *VEHÍCULOS* 」━━━┓
┃
┃ 🚗 *${botConfig.prefix}placa*
┃    ➜ Información por número de placa
┃
┃ 📋 *${botConfig.prefix}plat*
┃    ➜ Ficha técnica completa
┃
┃ 🛡️ *${botConfig.prefix}soat*
┃    ➜ Estado y vigencia del SOAT
┃
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━「 📱 *CONTACTO* 」━━━┓
┃
┃ 📱 *${botConfig.prefix}telp*
┃    ➜ Consulta de teléfono
┃
┃ 📲 *${botConfig.prefix}telpx*
┃    ➜ Teléfono (variante extendida)
┃
┃ 💼 *${botConfig.prefix}sueldo*
┃    ➜ Historial de sueldos y empleos
┃
┃ 📂 *${botConfig.prefix}rfm*
┃    ➜ Consulta RFM
┃
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━「 ⚖️ *LEGAL* 」━━━┓
┃
┃ 🚨 *${botConfig.prefix}den*
┃    ➜ Resumen de denuncias por DNI
┃
┃ 📄 *${botConfig.prefix}denuncias*
┃    ➜ Denuncias policiales con documentos
┃
┃ 🚔 *${botConfig.prefix}denpla*
┃    ➜ Denuncias policiales por placa
┃
┃ ⚖️ *${botConfig.prefix}rqh*
┃    ➜ Requisitorias y procesos judiciales
┃
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━「 ✨ *EXTRAS* 」━━━┓
┃
┃ 👁️ *${botConfig.prefix}vv*
┃    ➜ Ver fotos/videos de una sola vez
┃
┗━━━━━━━━━━━━━━━━━━━━━┛

╭───────────────────╮
│ 💖 *${botConfig.botName}*
│ ✨ Siempre para ti
╰───────────────────╯`

    const esURL = /^https?:\/\//i.test(botConfig.cmdsImage)

    if (esURL) {
      await sock.sendMessage(
        from,
        { image: { url: botConfig.cmdsImage }, caption: texto },
        { quoted: msg }
      )
    } else {
      const imagePath = path.join(__dirname, '..', botConfig.cmdsImage)
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(
          from,
          { image: fs.readFileSync(imagePath), caption: texto },
          { quoted: msg }
        )
      } else {
        await sock.sendMessage(from, { text: texto }, { quoted: msg })
      }
    }
  }
}