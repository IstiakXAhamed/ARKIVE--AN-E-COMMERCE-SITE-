/**
 * Generate placeholder PWA icons as valid PNG files.
 * Creates emerald-colored square PNGs at all required sizes.
 * 
 * These are minimal valid PNGs — replace with proper branded icons before production.
 * 
 * Usage: node scripts/generate-icons.js
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, "..", "public", "icons");

// Emerald green (#10b981) in RGB
const R = 16, G = 185, B = 129;

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([length, typeBytes, data, crc]);
}

function createPNG(size) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr.writeUInt8(8, 8);        // bit depth
  ihdr.writeUInt8(2, 9);        // color type (RGB)
  ihdr.writeUInt8(0, 10);       // compression
  ihdr.writeUInt8(0, 11);       // filter
  ihdr.writeUInt8(0, 12);       // interlace

  // IDAT chunk - raw pixel data
  // Each row: filter byte (0) + RGB pixels
  const rowSize = 1 + size * 3;
  const rawData = Buffer.alloc(rowSize * size);
  
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // no filter
    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = R;
      rawData[pixelOffset + 1] = G;
      rawData[pixelOffset + 2] = B;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // IEND chunk
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    createChunk("IHDR", ihdr),
    createChunk("IDAT", compressed),
    createChunk("IEND", iend),
  ]);
}

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

for (const size of SIZES) {
  const png = createPNG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, png);
  console.log(`✓ ${filename} (${png.length} bytes)`);
}

console.log(`\nDone! ${SIZES.length} icons generated in public/icons/`);
console.log("⚠ These are solid emerald placeholders — replace with branded icons before production.");
