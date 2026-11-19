// Antes de las pruebas: monta la plantilla y cada juego de juegos/ (python3 scripts/build.py).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
module.exports = async () => {
  const raiz = path.resolve(__dirname, '..');
  const dirs = ['plantilla', ...fs.readdirSync(path.join(raiz, 'juegos')).map(d => `juegos/${d}`)].filter(d => fs.existsSync(path.join(raiz, d, 'shell.html')));
  for (const d of dirs) execSync(`python3 scripts/build.py ${d}`, { cwd: raiz, stdio: 'pipe' });
};
