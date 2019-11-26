import {UIEvent} from "../network/UIEvent";

/**
 * 音频播放组件。
 * 参数：
 * parms = {
 *     src: 'http://website.com/sound.mp3', // 资源路径
 *     volume: 1,                           // 音量
 *     loop: false,                         // 是否循环播放
 *     playOnMute: true,                    // 在 iOS 系统上静音时是否播放声音
 * };
 *
 * 注意，AudioSource 使用完毕之后必须使用 release 方法手动释放资源。
 */
  export default class AudioSource {
    constructor(parms) {
        this._isPlaying = false;
        this._ctx = wx.createInnerAudioContext();
        this._ctx.autoplay = false;

        // 应用参数
        this._ctx.src = parms ? parms.src : null;
        this._ctx.volume = parms ? parms.volume : 1;
        this._ctx.loop = parms ? !!parms.loop : false;
        this._ctx.obeyMuteSwitch = parms ? !parms.playOnMute : false;

        // 转发 wx 事件
        this.waitingEvent = new UIEvent();   // 音频数据不足需要等待加载的事件，每次循环过渡时也会广播
        this.canPlayEvent = new UIEvent();   // 音频进入可以播放状态的事件，，每次循环过渡时也会广播
        this.playEndedEvent = new UIEvent(); // 音频自然播放结束的事件
        this.errorEvent = new UIEvent();     // 音频播放错误的事件
        // 10001: 系统错误
        // 10002: 网络错误
        // 10003: 文件错误
        // 10004: 格式错误
        //    -1: 未知错误
        this._ctx.onCanplay(() => {
            console.log('can play');
            this.canPlayEvent.Emit();
        });

        this._ctx.onEnded(() => {
            console.log('play ended')
            this.playEndedEvent.Emit();
        });

        this._ctx.onWaiting(() => {
            console.log('waiting');
            this.waitingEvent.Emit();
        });

        this._ctx.onError((code) => {
            console.log(`error code: ${code}`);
            this.errorEvent.Emit(code);
        });

        if (this._resumeOnShow) {
            wx.onShow(this._resume.bind(this));
            this._onShow = true;
        }
    }

    release() {
        this.pause();

        if (this._onShow) {
            wx.offShow(this._resume);
        }

        this.ctx.destroy();
        this._isReleased = true;
        console.log('released');
    }

    get ctx() {
        this._checkRelease();
        return this._ctx;
    }

    // 音频资源的地址，可以设置 http(s) 的路径，本地文件路径或者代码包文件路径。
    get src() {
        return this.ctx.src;
    }

    set src(value) {
        this.ctx.scr = value;
    }

    // 是否循环播放。注意动态修改会导致播放停止。
    get loop() {
        return this.ctx.loop;
    }

    set loop(value) {
        this.ctx.loop = value;
    }

    // 是否处于播放状态。这里的播放状态仅受手动指令影响，切出自动暂停的情况不会修改其值。
    get isPlaying() {
        return this._isPlaying;
    }

    // 当前已缓冲时间点（ms），仅保证当前播放时间点到此时间点内容已缓冲。
    get buffered() {
        return this.ctx.buffered;
    }

    // 当前音频的播放位置（s）。只有在当前有合法的 src 时返回，保留小数点后 6 位。
    get currentTime() {
        return this.ctx.currentTime;
    }

    // 当前音频的长度（s）。只有在当前有合法的 src 时返回。
    get duration() {
        return this.ctx.duration;
    }

    // 音量。注意动态修改会导致播放停止。
    get volume() {
        return this.ctx.volume;
    }

    set volume(value) {
        this.ctx.volume = value;
    }

    // 播放音频。
    play() {
        //console.log(`play ${this.src}`);
        this.ctx.play();
        this._isPlaying = true;
    }

    // 从头播放音频。
    replay() {
        this.stop();
        this.play();
    }

    // 停止。停止后的音频再播放会从头开始播放。
    stop() {
        this.ctx.stop();
        this._isPlaying = false;
    }

    // 暂停。暂停后的音频再播放会从暂停处开始播放。
    pause() {
        this.ctx.pause();
        this._isPlaying = false;
    }

    // 跳转到指定位置（s）
    seek(time) {
        this.ctx.seek(time);
    }

    _resume() {
        console.log('resume');

        if (this._isPlaying) {
            this.play();
        }
    }

    _checkRelease() {
        if (this._isReleased) {
            throw new Error('this Audio has been released already and will not be available again.');
        }
    }
} 