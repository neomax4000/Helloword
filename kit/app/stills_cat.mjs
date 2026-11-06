import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: 'Cat', puppeteerInstance: browser});
const ts = [1.0, 2.6, 4.6, 8.3, 10.0, 13.0, 14.5, 17.0, 18.3, 20.5];
for (const t of ts) await renderStill({composition: comp, serveUrl, output: `/home/claude/video/build/cat_${t}.png`, frame: Math.round(t*30), puppeteerInstance: browser, scale: 0.5});
await browser.close({silent: true});
console.log('stills ok', comp.durationInFrames);
