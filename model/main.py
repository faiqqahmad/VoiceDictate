from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

# def handleTransportFull(x):
#     return x

# def handleTransportPartial(x):
#     print(x)


@app.get("/")
async def get():
    return HTMLResponse("<p>hi</p>")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # await websocket.send_text(f"Message text was: {data}")
        await websocket.send_text(f"Message text was: {data}")