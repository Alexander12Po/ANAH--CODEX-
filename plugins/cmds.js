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

    const texto = `╔════════════════════╗
║ 💕 ${botConfig.botName}
║ 🇵🇪 CONSULTAS PERÚ
╚════════════════════╝

╭──── 🌸 CONSULTAS ────╮
│ 🌳 ${botConfig.prefix}ag
│ ➜ Consulta el árbol genealógico y relaciones familiares por DNI
│
│ 🏠 ${botConfig.prefix}dir
│ ➜ Consulta el historial de direcciones de una persona por su DNI
│
│ 🪪 ${botConfig.prefix}dni
│ ➜ Consulta datos detallados de una persona por su DNI (Perú)
│
│ 🖼️ ${botConfig.prefix}dnit
│ ➜ Ficha completa de DNI con fotos, domicilio y ubigeos
│
│ 📸 ${botConfig.prefix}dnivel
│ ➜ Consulta DNI con imágenes (formato rápido)
│
│ 📷 ${botConfig.prefix}dniv
│ ➜ Consulta DNI con imágenes (formato PNG)
│
│ 👤 ${botConfig.prefix}nm
│ ➜ Busca personas por Nombres y Apellidos
│
│ 🚗 ${botConfig.prefix}placa
│ ➜ Consulta información de un vehículo por su número de placa
│
│ 📋 ${botConfig.prefix}plat
│ ➜ Ficha técnica completa del vehículo (series, propietarios)
│
│ 📂 ${botConfig.prefix}rfm
│ ➜ Consulta RFM
│
│ 🛡️ ${botConfig.prefix}soat
│ ➜ Consulta el estado y vigencia del SOAT de un vehículo por su placa
│
│ 💼 ${botConfig.prefix}sueldo
│ ➜ Consulta el historial de sueldos y empleos de una persona por su DNI
│
│ 📱 ${botConfig.prefix}telp
│ ➜ Consulta Teléfono
│
│ 📲 ${botConfig.prefix}telpx
│ ➜ Consulta Teléfono (variante extendida)
│
│ 🚨 ${botConfig.prefix}den
│ ➜ Resumen de denuncias (condición e intervención) por DNI
│
│ 📄 ${botConfig.prefix}denuncias
│ ➜ Consulta denuncias policiales con documentos por DNI
│
│ 🚔 ${botConfig.prefix}denpla
│ ➜ Consulta denuncias policiales por placa
│
│ ⚖️ ${botConfig.prefix}rqh
│ ➜ Consulta requisitorias y procesos judiciales por DNI
│
│ 👁️ ${botConfig.prefix}vv
│ ➜ Descarga fotos y videos enviados para ver una sola vez
│
╰──────────────────────╯

╭───────────────────╮
│ 💖 ${botConfig.botName}
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
