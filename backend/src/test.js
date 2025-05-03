import {spawn} from 'child_process'

const test = spawn('node', ['index.js'])


test.stdout.on("data", (data) => {
    console.log(data.toString().slice(1,-1), 'this is from the process')
})