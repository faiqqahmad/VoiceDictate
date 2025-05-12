import {spawn} from 'child_process'
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonPath = path.join(__dirname, '../../model/venv/bin/python');
const modelPath = path.join(__dirname, '../../model/app.py')

const test = spawn(pythonPath, [modelPath])

test.on('spawn', () => {
    console.log('processed spawned')
})


test.stdout.on("data", (data) => {
    console.log(data.toString().slice(1,-1), 'this is from the process')
})

//testing