import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: "Growth", puppeteerInstance: browser});
const ts = [0.6,2.5,4.0,5.6,7.4,8.6,10.8,13.2,15.0,16.6,18.0,19.5];
for (const t of ts) await renderStill({composition: comp, serveUrl, output: `/home/claude/video/build/gr_${t}.png`, frame: Math.round(t*30), puppeteerInstance: browser, scale: 0.5});
await browser.close({silent: true});
console.log('stills ok', comp.durationInFrames);
