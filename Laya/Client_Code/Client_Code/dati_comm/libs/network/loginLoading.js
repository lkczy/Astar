let showCounter = 0;

const loginLoading = {
    show(text, mask = true) {
        //if (showCounter === 0) {
            wx.showLoading({
                title: text,
                mask: mask,
            });
        //}
        //showCounter += 1;
    },
    hide() {
        //if (showCounter === 0) {
        //    return;
        //}

        //showCounter -= 1;

        //if (showCounter === 0) {
            wx.hideLoading();
        //}
    },
};

export {loginLoading}