import {UIEvent} from 'UIEvent';
import {loginLoading} from "./loginLoading";
let retryCount = 0

const wxAccount = {
    /**
     * wx.getUserInfo 的返回数据，包括：
     * - userInfo 不敏感的用户基本信息
     *     - string language
     *     - string nickName
     *     - string avatarUrl
     *     - number gender = 0 未知, 1 男, 2 女
     *     - string country
     *     - string province
     *     - string city
     * - rawData:       不包括敏感信息的原始数据字符串，用于计算签名。
     * - signature:     使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息。
     * - encryptedData: 包括敏感数据在内的完整用户信息的加密数据。
     * - iv:            加密算法的初始向量
     *
     * 参见：
     * https://mp.weixin.qq.com/debug/wxagame/dev/document/open-api/user-info/wx.getUserInfo.html?t=2018110
     */
    userInfo: {},

    /**
     * 微信客户端得到的用户登录凭证
     * 获得该凭证后 wxAccount 会一直持有直到重新登录更新，但该凭证的实际有效期是 5 分钟。
     */
    code: '',
    // openid:'',

    // 事件
    loginToWxSucceededEvent: new UIEvent(),      // 登录微信成功事件
    loginToWxFailedEvent: new UIEvent(),         // 登录微信失败事件
    autoLoginToWxSucceededEvent: new UIEvent(),  // 自动重新登录微信成功事件
    autoLoginToWxFailedEvent: new UIEvent(),     // 自动重新登录微信失败事件

    getUserInfoSucceededEvent: new UIEvent(),    // 用户信息更新成功事件
    getUserInfoFailedEvent: new UIEvent(),       // 用户信息更新失败事件

    checkSessionSucceededEvent: new UIEvent(),   //  用户登录态未过期事件
    checkSessionFailedEvent: new UIEvent(),      //  用户登录态已过期事件
    authorizeEvent: new UIEvent(),//弹出了授权提示框
    // 启动登录过程
    login: function () {
        console.log('start to login to weixin...');
        // retryCount = 0
        // this._login()
        //this._DoAuthorize()
        this._login()
    },

   

    _login: function()
    {
      var than = this
        // 1. 登陆到微信
        wx.login({
            success: _wxloginCallbacks.success,
            fail: _wxloginCallbacks.fail,
        });
    },

    // 断线自动重连专用的 login
    autoLogin: function () {
        console.log('start to auto relogin to weixin...');

        // 重新登陆到微信
        wx.login({
            success: _wxAutoReloginCallbacks.success,
            fail: _wxAutoReloginCallbacks.fail,
        })
    },

    // 检查登录态
    checkSession: function () {
        console.log('start to check weixin session...');

        wx.checkSession({
            success: _wxCheckSessionCallback.success,
            fail: _wxCheckSessionCallback.fail,
        });
    }
};

function _GetUserInfo()
{
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo'])
            { 
              console.log("开始获取用户信息")
              wx.getUserInfo({
                withCredentials: true,
                success: _wxGetUserInfoCallbacks.success,
                fail: _wxGetUserInfoCallbacks.fail,
              });
            }else
            {
              console.log("未授权获取用户信息")
              _wxGetUserInfoCallbacks.fail()
            }
          },
          fail: () => {
            console.log("获取授权失败")
            _wxGetUserInfoCallbacks.fail()
          }
        })
}

// 登录到微信回调函数
let _wxloginCallbacks = {
 
    success: (res) => {
        // report.init(res.code, options);

        console.log('login to weixin successfully.', res);
        wxAccount.code = res.code;
        wxAccount.loginToWxSucceededEvent.Emit(res.code);
        console.log("=========================================", res.code)

        retryCount = 0
        _GetUserInfo()
          console.log(res.code)
          // wx.request({
          //   url: 'http://www.quwengame.com:441/code.php',
          //   data: {
          //     code: res.code
          //   },
          //   header: {
          //     'content-type': 'application.json'
          //   },
          //   success: function (res) {
          //     console.log("res:" , res)
          //     var data = res.data;
          //     var openid = data.openid;
          //     this.openid = openid;
          //     console.log("openid:" + openid)
          //   }
          // })
    },
    fail: () => {
        console.log('failed to login to weixin.');
        if(retryCount++<3)
        {
            wxAccount._login()
        }else
            wxAccount.loginToWxFailedEvent.Emit();
    },
};

// 自动重新登录到微信回调函数
let _wxAutoReloginCallbacks = {
    success: (res) => {
        console.log('auto relogin to weixin successfully.', res.code);
        wxAccount.autoLoginToWxSucceededEvent.Emit(res.code);
    },
    fail: () => {
        console.log('failed to auto relogin to weixin.');
        wxAccount.autoLoginToWxFailedEvent.Emit();
    }
};

// 获取用户信息回调函数
let _wxGetUserInfoCallbacks = {
    success: (res) => {
        console.log('get user info from weixin successfully.'); 
        wxAccount.userInfo = res;
        wxAccount.getUserInfoSucceededEvent.Emit(wxAccount.userInfo);
    },
    fail: () => {
        /*
        console.log('failed to get user info from weixin.');
        // if(retryCount++<3)
        // {
        //      _GetUserInfo()
        // }else
        //     wxAccount.getUserInfoFailedEvent.Emit();
        wx.showModal({  
            title: '警告',  
            content: '只有授权才能正常使用程序',
            showCancel: false,
            confirmText: '去授权',
            confirmColor: '#ff0000',
            success: function(res){
                wx.openSetting({
                    success: function(res){
                        wxAccount.login()
                    }
                })
            }  
        })
        */
        wxAccount.getUserInfoFailedEvent.Emit();
    },
};

// 检查用户登录态回调函数
let _wxCheckSessionCallback = {
    success: () => {
        console.log('check weixin session successfully.');
        wxAccount.checkSessionSucceededEvent.Emit();
    },
    fail: () => {
        console.log('failed to check weixin session.');
        wxAccount.checkSessionFailedEvent.Emit();
    },
};

export {wxAccount}