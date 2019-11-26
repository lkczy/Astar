const math = {
    clamp: function (v, min, max) {
        return Math.min(max, Math.max(v, min));
    },

    cycle: function (v, min, max) {
        let delta = max - min;

        if (v < min) {
            let remainder = (v - max) % delta;
            return remainder === 0 ? min : max + remainder;
        }
        else if (v >= max) {
            return min + (v - min) % delta;
        }
        else {
            return v;
        }
    },

    getSqrDistance(v1, v2) {
        let x = v2[0] - v1[0];
        let y = v2[1] - v1[1];
        return x ** 2 + y ** 2;
    },

    getVec2SqrLength(v) {
        return v[0] ** 2 + v[1] ** 2;
    },

    // 返回 min 到 max 范围内的随机整数（都包含）
    randomRange(min, max) {
        let c = max - min + 1;
        return Math.floor(Math.random() * c + min);
    },

};

export {math}