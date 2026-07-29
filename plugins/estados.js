export default {
  command: ['estados'],
  exec: async ({ sock, msg, from }) => {
    const cache = global.statusCache || {};
    const entradas = Object.entries(cache);

    if (entradas.length === 0) {
      return sock.sendMessage(from, {
        text: '📭 Todavía no he visto ningún estado. Espera a que un contacto suba uno mientras el bot esté conectado.'
      }, { quoted: msg });
    }

    let texto = '📋 *Estados disponibles ahora:*\n\n';
    for (const [jid, data] of entradas) {
      const numero = jid.split('@')[0];
      const minutos = Math.floor((Date.now() - data.timestamp) / 60000);
      texto += `• wa.me/${numero} — hace ${minutos} min\n`;
    }
    texto += '\nUsa *.estado <numero>* para descargarlo.';

    return sock.sendMessage(from, { text: texto }, { quoted: msg });
  }
};