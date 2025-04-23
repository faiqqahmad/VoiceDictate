
#!/usr/bin/env python3
import asyncio
import json
import threading
from websockets.asyncio.server import serve
import queue
from vosk import Model, KaldiRecognizer
import pyaudio

q = queue.Queue()

def runModel():

    model = Model("/Users/faiqahmad/Desktop/Coding/VoiceToText/model/vosk-model-small-en-us-0.15")
    recognizer = KaldiRecognizer(model, 16000)

    mic = pyaudio.PyAudio()
    stream = mic.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
    stream.start_stream()

    while True:
        data = stream.read(4096)
        if recognizer.AcceptWaveform(data):
            text = recognizer.Result()
            q.put(text[14:-3])




async def handler(websocket):

    # async def emitData(data):
    #     await websocket.send(json.dumps(data))
    modelThread = threading.Thread(target=runModel, daemon=True)
    modelThread.start()

    while True:
        data = q.get()
        print(data)
        if len(data) != 0:
            await websocket.send(json.dumps(data))
        
        


async def main():
    async with serve(handler, "", 3000) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())