import { _decorator, Component, EditBox, find, instantiate, loader, assetManager, director } from 'cc';
import NetworkMgr from './NetworkMgr';
const { ccclass, property } = _decorator;


@ccclass('WsCtrl2')
export class WsCtrl2 extends Component {
    @property(EditBox)
    UrlInput: EditBox

    @property(EditBox)
    MsgInput: EditBox
    
    start() {
        console.log("wsctrl2 start...")
        NetworkMgr.instance().register("ws", this.message, this)
    }

    onDestroy() {
        // NetworkMgr.instance().unregister();
    }

    connect() {
        console.log("wsctrl2 connect", this.UrlInput.string)
        let wsurl = this.UrlInput.string
        NetworkMgr.instance().connect(wsurl)
        
    }

    send() {
        console.log("wsctrl2 send")
        NetworkMgr.instance().send(1, this.MsgInput.string)
    }

    message(msg) {
        console.log("wsctrl2 msg", msg)
    }

    scene2() {
        director.loadScene("scene2")
    }
}

