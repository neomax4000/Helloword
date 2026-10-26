import {pipeline, env} from '@huggingface/transformers';
import fs from 'fs';
env.allowRemoteModels = false;
env.localModelPath = '/home/claude/asr/node_modules/sts-whisper-small/models/';
const buf = fs.readFileSync('/home/claude/asr/audio16k.f32');
const audio = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
const mode = process.argv[2] || 'seg';
const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small', {dtype: 'q8', device: 'cpu'});
const t0 = Date.now();
const out = await asr(audio, {language: 'spanish', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5,
  return_timestamps: mode === 'word' ? 'word' : true});
fs.writeFileSync(`/home/claude/asr/out_${mode}.json`, JSON.stringify(out, null, 1));
console.log('secs', (Date.now() - t0) / 1000);
console.log(out.text);
