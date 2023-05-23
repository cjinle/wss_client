import { EventTarget } from "cc";

export default class NetworkMgr {

    static _instance: NetworkMgr;

    _eventTarget: EventTarget;

    socket: WebSocket;
    isConnected: boolean;

    static instance(): NetworkMgr {
        if (!this._instance) {
            this._instance = new NetworkMgr();
            console.debug("network mgr instance");
        }
        return this._instance;
    }

    register(callback: any, obj: object) {
        console.log("register");
        if (!this._eventTarget) {
            this._eventTarget = new EventTarget();
        }
        try {
            this._eventTarget.on('NetworkMgr', callback, obj);
        } catch (error) {
            console.log("register", error);
        }
    }

    unregister() {
        console.log("unregister");
        this._eventTarget.off('NetworkMgr');
    }

    pack(id: number, str: string): ArrayBuffer {
        if (!str) {
            console.log("error str", str);
            return new ArrayBuffer(0);
        }
        let arr =  new TextEncoder().encode(str);
        let len = arr.length;
        let buffer = new ArrayBuffer(8 + len);
        let view = new DataView(buffer);
        view.setUint32(0, len);
        view.setUint32(4, id);
        for (let i = 0; i < len; i++) {
            view.setUint8(8 + i, arr[i]);
        }
        return buffer;
    }

    unpack(buffer: ArrayBuffer): object {
        if (!buffer || !(buffer instanceof ArrayBuffer)) {
            console.log("buffer type err", buffer);
            return
        }
        let view = new DataView(buffer);
        let msg = {
            len: view.getUint32(0),
            id: view.getUint32(4),
            buffer: buffer.slice(8),
            data: {}
        };
    
        let dec = new TextDecoder("utf-8");
        try {
            msg.data = JSON.parse(dec.decode(new Uint8Array(msg.buffer)));
        } catch (error) {
            console.log(error, dec.decode(msg.buffer));
        }
        return msg;
    }

    connect(wsurl: string) {
        console.log("connect", wsurl);
        if (this.isConnected) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
        this.socket = new WebSocket(wsurl);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = (event) => {
            console.log("open");
            this.isConnected = true;
        }
        this.socket.onclose = (event) => {
            console.log("close", event);
            this.isConnected = false;
        }
        this.socket.onerror = (event) => {
            console.log("error", event);
            this.isConnected = false;
        }
        this.socket.onmessage = (event) => {
            console.log("receive", event.data);
            let msg = this.unpack(event.data);
            console.log("msg", msg);
            if (this._eventTarget) {
                this._eventTarget.emit("ws", msg);
            }
        }
    }

    close() {
        console.log("close");
        if (!this.isConnected) {
            return;
        }
        this.socket.close();
    }

    send(cmd: number, str: string) {
        console.log("send");
        if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
            console.log("not connected");
            return;
        }
        this.socket.send(this.pack(Number(`0x${cmd}`), str));
    }
}


