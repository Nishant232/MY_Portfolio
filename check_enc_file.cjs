/**
 * check_enc_file.cjs
 * Checks if character.enc can be decrypted with the Web Crypto API method
 * used by decrypt.ts (SHA-256 key + AES-CBC).
 * Also shows the first 32 bytes to diagnose corruption.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const encFile = path.join(__dirname, "public", "models", "character.enc");

if (!fs.existsSync(encFile)) {
  console.log("ERROR: character.enc not found!");
  process.exit(1);
}

const data = fs.readFileSync(encFile);
console.log(`character.enc size: ${data.length} bytes`);
console.log(`First 32 bytes (hex): ${data.slice(0, 32).toString("hex")}`);
console.log(`First 32 bytes (decimal): ${Array.from(data.slice(0, 32)).join(", ")}`);

// Check for CR bytes (corruption indicator)
let crCount = 0;
for (let i = 0; i < data.length; i++) {
  if (data[i] === 0x0d) crCount++;
}
console.log(`CR bytes (0x0D): ${crCount} ${crCount > 0 ? "⚠️  CORRUPTED!" : "✅ None"}`);

// Check backup file
const bakFile = encFile + ".bak";
if (fs.existsSync(bakFile)) {
  const bak = fs.readFileSync(bakFile);
  let bakCr = 0;
  for (let i = 0; i < bak.length; i++) {
    if (bak[i] === 0x0d) bakCr++;
  }
  console.log(`\nBackup file (.enc.bak): ${bak.length} bytes, CR bytes: ${bakCr}`);
  console.log(`Backup first 32 bytes (hex): ${bak.slice(0, 32).toString("hex")}`);
}

// Try to decrypt using Node.js crypto (same algorithm as Web Crypto AES-CBC)
const password = "Character3D#@";
const key = crypto.createHash("sha256").update(password).digest();
const iv = data.slice(0, 16);
const ciphertext = data.slice(16);

console.log(`\nIV (first 16 bytes): ${iv.toString("hex")}`);
console.log(`Ciphertext length: ${ciphertext.length} bytes`);
console.log(`Ciphertext length % 16 = ${ciphertext.length % 16} (must be 0 for AES-CBC)`);

try {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  console.log(`\n✅ DECRYPTION SUCCESS! Decrypted ${decrypted.length} bytes`);
  console.log(`First 4 bytes (should be 'glTF' = 0x676C5446): ${decrypted.slice(0, 4).toString("hex")}`);
  if (decrypted.slice(0, 4).toString() === "glTF") {
    console.log("✅ Valid GLB file detected!");
  }
} catch (err) {
  console.log(`\n❌ DECRYPTION FAILED: ${err.message}`);
  console.log("The character.enc file needs to be regenerated from character.glb");
  console.log(`\nTo fix: Run this in the public/models/ directory:`);
  console.log(`  node encrypt.cjs`);
  console.log(`(Make sure character.glb is present first)`);
}
