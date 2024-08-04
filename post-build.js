const fs = require('fs');
const src = "docs/browser";
const dest = "docs";
fs.cpSync(src, dest, {recursive: true});
fs.rmSync(src, { recursive: true, force: true });
console.log("Docs Updated");