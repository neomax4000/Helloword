// Render del Estándar Pro: node render_pro.mjs <Comp> <salida.mp4> <CompCover> <portada.png>
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [id, out, coverId, png] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.join(here, 'src/index.ts'), onProgress: () => {}});
const browser = await openBrowser('chrome', {browserExecutable: process.env.CHROMIUM || '/tmp/chromium', chromeMode: 'headless-shell', chromiumOptions: {gl: 'swangle'}});
if (coverId) { const c = await selectComposition({serveUrl, id: coverId, puppeteerInstance: browser}); await renderStill({composition: c, serveUrl, output: png, frame: 12, puppeteerInstance: browser, scale: 2 / 3}); }
const comp = await selectComposition({serveUrl, id, puppeteerInstance: browser});
await renderMedia({composition: comp, serveUrl, codec: 'h264', outputLocation: out, puppeteerInstance: browser, crf: 18, scale: 2 / 3, audioCodec: 'aac', audioBitrate: '192k', concurrency: 2, onProgress: ({renderedFrames}) => { if (renderedFrames % 150 === 0) console.log('f', renderedFrames); }});
await browser.close({silent: true});
console.log('done', id);
