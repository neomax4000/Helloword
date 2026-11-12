import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: '/home/claude/helloword/kit/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: process.env.CHROME_BIN || '/usr/bin/google-chrome', chromeMode: 'chrome-for-testing', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id: 'Outlook', puppeteerInstance: browser});
const frames = process.argv.slice(2).map(Number);
for (const fr of frames) await renderStill({composition: comp, serveUrl, output: `/tmp/st_${fr}.png`, frame: fr, puppeteerInstance: browser, scale: 0.5});
await browser.close({silent: true});
console.log('ok', comp.durationInFrames);
