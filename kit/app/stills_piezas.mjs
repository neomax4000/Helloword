// Stills de verificación de las piezas: node stills_piezas.mjs  (salida en /tmp/piezas-*.png)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const serveUrl = await bundle({entryPoint: path.join(here, 'src/index.ts'), onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: process.env.CHROMIUM || '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
for (const [id, frame, out] of [['DemoPiezas', 90, 'a'], ['DemoPiezas', 200, 'b'], ['DemoPiezas', 320, 'c'], ['DemoPortada', 5, 'd']]) {
  const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
  await renderStill({composition: comp, serveUrl, frame, output: `/tmp/piezas-${out}.png`, puppeteerInstance: browser, scale: 0.5});
}
await browser.close({silent: true});
console.log('ok');
