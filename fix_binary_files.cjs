/**
 * fix_binary_files.cjs
 * Strips CRLF corruption (\r bytes) from binary files that were corrupted
 * by Git's CRLF conversion on Windows (missing .gitattributes).
 *
 * Run with: node fix_binary_files.cjs
 */
const fs = require("fs");
const path = require("path");

const files = [
  path.join(__dirname, "public", "models", "char_enviorment.hdr"),
  path.join(__dirname, "public", "models", "character.enc"),
];

files.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return;
  }

  const original = fs.readFileSync(filePath);
  const originalSize = original.length;

  // Count how many \r bytes exist
  let crCount = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] === 0x0d) crCount++;
  }

  if (crCount === 0) {
    console.log(`OK (no CR bytes found): ${path.basename(filePath)}`);
    return;
  }

  console.log(`FIXING: ${path.basename(filePath)} — found ${crCount} CR bytes (file size: ${originalSize} bytes)`);

  // Remove all \r (0x0D) bytes
  const fixed = Buffer.alloc(originalSize - crCount);
  let j = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== 0x0d) {
      fixed[j++] = original[i];
    }
  }

  // Backup original
  fs.writeFileSync(filePath + ".bak", original);
  fs.writeFileSync(filePath, fixed);
  console.log(`  Fixed! New size: ${fixed.length} bytes (removed ${crCount} bytes). Backup saved as .bak`);
});

console.log("\nDone! Now run: git add public/models/ && git commit -m \"fix: restore binary files\" && git push origin main");
