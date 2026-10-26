import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'fs';
const times = process.argv.slice(2).map(Number);
const out = '/home/claude/video/build/activar/stills';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: 'Activar', puppeteerInstance: browser});
for (const t of times) {
  const frame = Math.round(t * 30);
  await renderStill({composition: comp, serveUrl, frame, output: `${out}/f_${String(t).replace('.', '_')}.png`, puppeteerInstance: browser, scale: 0.5});
  console.log('ok', t);
}
await browser.close({silent: true});
