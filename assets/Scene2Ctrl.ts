import { _decorator, Component, Node, director, instantiate } from 'cc';
import NetworkMgr from './NetworkMgr';
const { ccclass, property } = _decorator;

@ccclass('Scene2Mgr')
export class Scene2Mgr extends Component {

    start() {
        NetworkMgr.instance().register(this.message, this);
    }

    onDestroy() {
        // NetworkMgr.instance().unregister();
        
    }

    back() {
        console.debug("back")
        director.loadScene("scene")
    }

    send() {
        console.log(NetworkMgr.instance());
        // NetworkMgr.instance().register(this.message, this)
        NetworkMgr.instance().send(2, `{"helo":"world"}`)
    }

    message(msg) {
        console.log("scene2 msg", msg)
    }


}

