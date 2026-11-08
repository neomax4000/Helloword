import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: 'Glosario', puppeteerInstance: browser});
const ts = [0.1, 1.2, 2.6, 4.0, 6.0, 8.5, 10.0, 11.5, 13.0, 14.8];
for (const t of ts) await renderStill({composition: comp, serveUrl, output: `/home/claude/video/build/glo_${t}.png`, frame: Math.round(t*30), puppeteerInstance: browser, scale: 0.5});
await browser.close({silent: true});
console.log('stills ok', comp.durationInFrames);
