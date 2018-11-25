//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          /*获取用户openid  与key */
          wx.request({
            url: 'http://192.168.43.77:1997/wx/onlogin',
            data: { code },
            success:res => {
              this.globalData.uname = res.data.uname
              console.log(this.globalData.uname)
              var uname=this.globalData.uname
              wx.request({
                url:"http://192.168.43.77:1997/user/verify",
                data:{uname},
                method:"post",
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success:res=>{
                  if(!res.data)
                    // console.log(res.data)
                  wx.request({
                    url: 'http://192.168.43.77:1997/user/app_register',
                    data:{uname},
                    method:"post",
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    success:res=>{
                      console.log(res.data)
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      
      success: res => {
        
         
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(this.globalData.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
       
      }
      
    })
  },
  globalData: {
    userInfo: null,
    uname: "ojdNN5ZvOmeibFMXW9krwtamrRtc",
  },
})