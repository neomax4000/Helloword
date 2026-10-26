import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
const [id, frame, out] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: '/home/claude/video/app/src/index.ts', onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
await renderStill({composition: comp, serveUrl, frame: Number(frame), output: out, puppeteerInstance: browser, scale: 2/3});
await browser.close({silent: true});
