import {wxAccount} from "./wxAccount";

(function () {
    // 侦听用户登录微信成功事件，获取 code
    wxAccount.loginToWxSucceededEvent.On(this, (code) => {
        console.log(`user code (arg): ${code}`);
        console.log(`user code (prop): ${wxAccount.code}`);

        wxAccount.checkSession();
    });

    // 侦听从登录服务器获取用户信息成功事件，获取 userInfo（包含敏感信息）
    wxAccount.getUserInfoSucceededEvent.On(this, (info) => {
        console.log('user info:');
        console.log(info);
        console.log(wxAccount.userInfo);
    });

    // 侦听检查微信登录态未过期事件
    wxAccount.checkSessionSucceededEvent.On(this, (res) => {
        console.log('you are still logined.');
    });

    wxAccount.login();
})();
