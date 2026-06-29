const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const PHONE_NUMBER = "+923486732597";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({ auth: state, printQRInTerminal: false, logger: pino({ level: 'silent' }) });
    if (!sock.authState.creds.registered) {
        const code = await sock.requestPairingCode(PHONE_NUMBER);
        console.log(`TERA PAIRING CODE: ${code}`);
    }
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => { if(u.connection === 'open') console.log('✅ Bot On'); if(u.connection === 'close') startBot(); });
}
startBot();
