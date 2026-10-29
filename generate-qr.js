import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mobileUrl = 'https://phi-tomato-vault-phone.trycloudflare.com';
const outputPath = path.join(__dirname, 'assets', 'images', 'mobile-qr.png');

async function run() {
  await QRCode.toFile(outputPath, mobileUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#0b1523',
      light: '#ffffff'
    }
  });
  console.log(`QR code generated successfully at: ${outputPath}`);

  // Also print small ascii QR in console
  const ascii = await QRCode.toString(mobileUrl, { type: 'terminal', small: true });
  console.log('\n--- SCAN WITH PHONE CAMERA ---');
  console.log(ascii);
}

run().catch(console.error);
