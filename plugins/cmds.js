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

    const texto = `╔════════════════════════════╗
║      💖 *${botConfig.botName}*      ║
╚════════════════════════════╝
      ✨ *CONSULTAS BELLA* ✨

📂 SECCIÓN: *DOCUMENTOS*
📊 CANTIDAD: *7 COMANDOS*

📍 *CONSULTA DNI*
*Uso* → \`${botConfig.prefix}dni 12345678\`
*Desc* → Consulta datos completos por DNI.
────────────────────

📍 *FICHA RENIEC*
*Uso* → \`${botConfig.prefix}dnit 12345678\`
*Desc* → Genera la ficha completa con fotos.
────────────────────

📍 *DNI VIRTUAL*
*Uso* → \`${botConfig.prefix}dnivel 12345678\`
*Desc* → Genera el DNI virtual electrónico.
────────────────────

📍 *DNI PNG*
*Uso* → \`${botConfig.prefix}dniv 12345678\`
*Desc* → Genera el DNI virtual en formato PNG.
────────────────────

📍 *ÁRBOL GENEALÓGICO*
*Uso* → \`${botConfig.prefix}ag 12345678\`
*Desc* → Consulta familiares y parentescos.
────────────────────

📍 *DIRECCIONES*
*Uso* → \`${botConfig.prefix}dir 12345678\`
*Desc* → Historial de direcciones registradas.
────────────────────

📍 *BÚSQUEDA POR NOMBRES*
*Uso* → \`${botConfig.prefix}nm Juan Perez\`
*Desc* → Busca personas por nombres y apellidos.

━━━━━━━━━━━━━━━━━━━━

📂 SECCIÓN: *VEHÍCULOS*
📊 CANTIDAD: *3 COMANDOS*

📍 *CONSULTA PLACA*
*Uso* → \`${botConfig.prefix}placa ABC123\`
*Desc* → Información general del vehículo.
────────────────────

📍 *FICHA TÉCNICA*
*Uso* → \`${botConfig.prefix}plat ABC123\`
*Desc* → Consulta la ficha técnica del vehículo.
────────────────────

📍 *SOAT*
*Uso* → \`${botConfig.prefix}soat ABC123\`
*Desc* → Verifica el estado y vigencia del SOAT.

━━━━━━━━━━━━━━━━━━━━

📂 SECCIÓN: *CONTACTO*
📊 CANTIDAD: *4 COMANDOS*

📍 *TELÉFONO*
*Uso* → \`${botConfig.prefix}telp 987654321\`
*Desc* → Consulta información telefónica.
────────────────────

📍 *TELÉFONO PLUS*
*Uso* → \`${botConfig.prefix}telpx 987654321\`
*Desc* → Consulta telefónica extendida.
────────────────────

📍 *SUELDOS*
*Uso* → \`${botConfig.prefix}sueldo 12345678\`
*Desc* → Historial laboral y remuneraciones.
────────────────────

📍 *RFM*
*Uso* → \`${botConfig.prefix}rfm 12345678\`
*Desc* → Consulta información RFM.

━━━━━━━━━━━━━━━━━━━━

📂 SECCIÓN: *LEGAL*
📊 CANTIDAD: *4 COMANDOS*

📍 *DENUNCIAS*
*Uso* → \`${botConfig.prefix}den 12345678\`
*Desc* → Resumen de denuncias por DNI.
────────────────────

📍 *DENUNCIAS POLICIALES*
*Uso* → \`${botConfig.prefix}denuncias 12345678\`
*Desc* → Consulta documentos policiales.
────────────────────

📍 *DENUNCIAS POR PLACA*
*Uso* → \`${botConfig.prefix}denpla ABC123\`
*Desc* → Consulta denuncias del vehículo.
────────────────────

📍 *REQUISITORIAS*
*Uso* → \`${botConfig.prefix}rqh 12345678\`
*Desc* → Consulta requisitorias y procesos judiciales.

━━━━━━━━━━━━━━━━━━━━

📂 SECCIÓN: *EXTRAS*
📊 CANTIDAD: *1 COMANDO*

📍 *VER UNA VEZ*
*Uso* → \`${botConfig.prefix}vv\`
*Desc* → Visualiza fotos y videos de una sola vez.

━━━━━━━━━━━━━━━━━━━━
💖 *${botConfig.botName}*
✨ *Consultas Bella*
━━━━━━━━━━━━━━━━━━━━`

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