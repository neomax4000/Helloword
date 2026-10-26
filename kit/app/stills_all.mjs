import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'fs';
const ids = ['Bienvenida','Replica','Narrador','Interes','Banca','Sp500','Actigob','Fondos','Actimed','Vac','Compara','Vac2','Acticob','Protege','Actdual'];
const covers = new Set(['Narrador','Interes','Banca','Sp500','Actigob','Fondos','Actimed','Vac','Compara','Vac2','Acticob','Protege','Actdual']);
const fr = [0.04,0.15,0.28,0.4,0.52,0.65,0.8,0.97];
const out='/home/claude/biblio/frames';
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
for (const id of ids) {
  fs.mkdirSync(`${out}/${id}`, {recursive: true});
  if (covers.has(id)) {
    const c = await selectComposition({serveUrl, id: id + 'C', puppeteerInstance: browser});
    await renderStill({composition: c, serveUrl, frame: 30, output: `${out}/${id}/00_portada.png`, puppeteerInstance: browser, scale: 0.25});
  }
  const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
  for (let i = 0; i < fr.length; i++) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round(fr[i] * comp.durationInFrames));
    await renderStill({composition: comp, serveUrl, frame, output: `${out}/${id}/${String(i + 1).padStart(2, '0')}_${(frame / 30).toFixed(1)}s.png`, puppeteerInstance: browser, scale: 0.25});
  }
  console.log('ok', id, comp.durationInFrames);
}
await browser.close({silent: true});
