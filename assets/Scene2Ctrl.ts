import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Scene2Mgr')
export class Scene2Mgr extends Component {

    back() {
        console.debug("back")
        director.loadScene("scene")
    }
}

