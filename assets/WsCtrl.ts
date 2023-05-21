import { _decorator, Component, EditBox, find, instantiate, loader, assetManager, director } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('WsCtrl')
export class WsCtrl extends Component {
    @property(EditBox)
    UrlInput: EditBox

    @property(EditBox)
    MsgInput: EditBox

    socket: WebSocket
    isConnected: boolean
    
    start() {
        console.log("wsctrl start...")
    }

    pack(id: number, str: string): ArrayBuffer {
        if (!str) {
            console.log("error str", str)
            return new ArrayBuffer(0)
        }
        let arr =  new TextEncoder().encode(str)
        let len = arr.length
        let buffer = new ArrayBuffer(8 + len)
        let view = new DataView(buffer)
        view.setUint32(0, len)
        view.setUint32(4, id)
        for (let i = 0; i < len; i++) {
            view.setUint8(8 + i, arr[i])
        }
        return buffer
    }

    unpack(buffer: ArrayBuffer): object {
        if (!buffer || !(buffer instanceof ArrayBuffer)) {
            console.log("buffer type err", buffer)
            return
        }
        let view = new DataView(buffer)
        let msg = {
            len: view.getUint32(0),
            id: view.getUint32(4),
            buffer: buffer.slice(8),
            data: {}
        }
    
        let dec = new TextDecoder("utf-8")
        try {
            msg.data = JSON.parse(dec.decode(new Uint8Array(msg.buffer)))
        } catch (error) {
            console.log(error, dec.decode(msg.buffer))
        }
        return msg
    }

    connect() {
        console.log("connect", this.UrlInput.string)
        if (this.isConnected) {
            this.socket.close()
            this.socket = null
            this.isConnected = false
        }
        let wsurl = this.UrlInput.string
        this.socket = new WebSocket(wsurl)
        this.socket.binaryType = "arraybuffer"
        this.socket.onopen = (event) => {
            console.log("open")
            this.isConnected = true
        }
        this.socket.onclose = (event) => {
            console.log("close", event)
            this.isConnected = false
        }
        this.socket.onerror = (event) => {
            console.log("error", event)
            this.isConnected = false
        }
        this.socket.onmessage = (event) => {
            console.log("receive", event.data)
            let msg = this.unpack(event.data)
            console.log("msg", msg)
        }
        
    }

    close() {
        console.log("close")
        if (!this.isConnected) {
            return
        }
        this.socket.close()
    }

    send() {
        console.log("send")
        if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
            console.log("not connected")
            return
        }
        let cmd = '1'
        let content = this.MsgInput.string
        this.socket.send(this.pack(Number(`0x${cmd}`), content))
    }

    scene2() {
        director.loadScene("scene2")
    }
}

