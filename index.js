const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

const PHONE_NUMBER = "+923486732597"; // Tera number

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, 
        logger: pino({ level: 'silent' })
    });

    if (!sock.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const code = await sock.requestPairingCode(PHONE_NUMBER);
        console.log("===================================");
        console.log(` TERA PAIRING CODE: ${code} `);
        console.log("===================================");
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'open') console.log('✅ Bot Connected Ho Gaya Jani');
        if(connection === 'close') startBot();
    });
}
startBot();
