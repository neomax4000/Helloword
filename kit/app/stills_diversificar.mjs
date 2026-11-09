import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: "Diversificar", puppeteerInstance: browser});
const ts = [0.5, 2.3, 3.8, 5.6, 7.5, 10.2, 13.0, 15.5];
for (const t of ts) await renderStill({composition: comp, serveUrl, output: `/home/claude/video/build/div_${t}.png`, frame: Math.round(t*30), puppeteerInstance: browser, scale: 0.5});
await browser.close({silent: true});
console.log('stills ok', comp.durationInFrames);
