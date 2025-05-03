import WebSocket from 'ws'
import robot from "robotjs"

const ws = new WebSocket("ws://localhost:3000", {
  perMessageDeflate: false
})

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  // console.log('received: %s', data);
  // robot.typeString(data.toString().slice(1,-1))
  console.log("this is the data", data.toString().slice(1,-1), typeof(data));
});