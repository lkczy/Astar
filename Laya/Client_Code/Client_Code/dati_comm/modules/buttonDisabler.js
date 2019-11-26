let disabled = false;

const buttonDisabler = {
    canClick: function (delay = 600) {
        if (!disabled) {
            disabled = true;
            setTimeout(() => {
                disabled = false;
            }, delay);
            return true;
        }

        return false;
    }
};

export {buttonDisabler};