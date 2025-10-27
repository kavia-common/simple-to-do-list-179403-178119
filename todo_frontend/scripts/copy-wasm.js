const fs = require('fs');
const path = require('path');

try {
  const src = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
  const dstDir = path.join(__dirname, '..', 'public');
  const dst = path.join(dstDir, 'sql-wasm.wasm');

  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log('sql-wasm.wasm copied to public/');
  } else {
    console.warn('sql.js wasm not found at', src);
  }
} catch (e) {
  console.warn('copy-wasm.js encountered an error:', e.message);
}
