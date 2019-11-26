/**
 * 主心跳管理器，单位秒。
 */
class Ticker {
    constructor() {
        this._callbacks = [];
        this._lastTime = Date.now();
    }

    register(thisObj, callback) {
        this._callbacks.push([thisObj, callback]);
    }

    unregister(callback) {
        let index = this._callbacks.indexOf(callback);

        if (index !== -1) {
            this._callbacks.splice(index, 1);
        }
    }

    start(fps) {
        setInterval(this._tick.bind(this), 1000 / fps);
    }

    _tick() {
        let currTime = Date.now();
        let deltaTime = (currTime - this._lastTime);
        this._lastTime = currTime;

        for (let i = 0; i < this._callbacks.length; i++) {
            let kv = this._callbacks[i];
            kv[1].call(kv[0], deltaTime / 1000);
        }
    }
}

let ticker = new Ticker();

export {ticker as Ticker}