import {Ticker} from "../../libs/core/Ticker";
import {math} from "../../libs/core/math";

Component({
    properties: {
        direction: {
            type: String,
            value: 'h'
        },
        inverse: {
            type: Boolean,
            value: false
        },
        showBack: {
            type: Boolean,
            value: false
        },
        backRadius: {
            type: Number,
            value: 25
        },
        backColor: {
            type: String,
            value: 'yellow'
        },
        showMid: {
            type: Boolean,
            value: false
        },
        midColor: {
            type: String,
            value: 'red'
        },
        midSpace: {
            type: Number,
            value: 0
        },
        midSpeed: {
            type: Number,
            value: 0.8
        },
        showFore: {
            type: Boolean,
            value: false
        },
        foreColor: {
            type: String,
            value: 'green'
        },
        foreSpace: {
            type: Number,
            value: 12
        },
        foreSpeed: {
            type: Number,
            value: -1
        },
        foreRadius: {
            type: Number,
            value: 25
        },
        borderWidth: {
            type: Number,
            value: 0
        },
        borderColor: {
            type: String,
            value: 'red'
        },
        progress: {
            type: Number,
            value: 0
        },
    },
    data: {
        midWidth: 70,
        midHeight: 100,
        foreWidth: 30,
        foreHeight: 100,
        rot: 0
    },
    methods: {
        setStartProgress(value) {
            value = math.clamp(value, 0, 1);
            this.properties.progress = value;
            this._foreProgress = value;
            this._midProgress = value;
            this._setVision();
        },

        setProgress(value) {
            value = math.clamp(value, 0, 1);
            this.properties.progress = value;
        },

        getProgress() {
            return this.properties.progress;
        },

        _setVision() {
            if (this.properties.showMid) {
                if (this._isHorizontal()) {
                    this.setData({midHeight: 100});
                    this.setData({midWidth: this._midProgress * 100});
                }
                else {
                    this.setData({midWidth: 100});
                    this.setData({midHeight: this._midProgress * 100});
                }
            }

            if (this.properties.showFore) {
                if (this._isHorizontal()) {
                    this.setData({foreHeight: 100});
                    this.setData({foreWidth: this._foreProgress * 100});
                }
                else {
                    this.setData({foreWidth: 100});
                    this.setData({foreHeight: this._foreProgress * 100});
                }
            }
        },

        _isHorizontal() {
            return this.properties.direction === 'h' || this.properties.direction === 'horizontal';
        },

        _isInverse() {
            return this.properties.inverse;
        },

        update(deltaTime) {
            let needRefresh = false;
            // 更新前景条
            if (this._foreProgress !== this.properties.progress && this.properties.showFore) {
                if (this.properties.foreSpeed < 0) {
                    this._foreProgress = this.properties.progress;
                }
                else if (this.properties.progress > this._foreProgress) {
                    this._foreProgress += deltaTime * this.properties.foreSpeed;
                    this._foreProgress = Math.min(this._foreProgress, this.properties.progress);
                }
                else {
                    this._foreProgress -= deltaTime * this.properties.foreSpeed;
                    this._foreProgress = Math.max(this._foreProgress, this.properties.progress);
                }

                needRefresh = true;
            }

            // 更新中间条
            if (this._midProgress !== this.properties.progress && this.properties.showMid) {
                if (this.properties.midSpeed < 0) {
                    this._midProgress = this.properties.progress;
                }
                else if (this.properties.progress > this._midProgress) {
                    this._midProgress += deltaTime * this.properties.midSpeed;
                    this._midProgress = Math.min(this._midProgress, this.properties.progress);
                }
                else {
                    this._midProgress -= deltaTime * this.properties.midSpeed;
                    this._midProgress = Math.max(this._midProgress, this.properties.progress);
                }

                needRefresh = true;
            }

            if (needRefresh) {
                this._setVision();
            }
        }
    },
    ready: function () {
        if (this.properties.inverse) {
            this.setData({rot: 180});
        }
        this.setStartProgress(this.properties.progress);
        Ticker.register(this, this.update);
    }
});