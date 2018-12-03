// pages/user/user.js
const app = getApp()
Page({
  uptop(){//充值
    wx.navigateTo({url:"/pages/TopUp/TopUp"})
  },
  lito(e){//跳转
    if(e.currentTarget.dataset.text==this.data.lis.text[0])
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
    else
    wx.showToast({
      title: '什么也没有，不要点啦！',
      icon:"none"
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    src:"",//视频
    /*用户头像 */
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    /*用户信息ul */
    lis:{
      img:
      [
      "http://192.168.43.77:1997/app/icon_collection.png",
      "http://192.168.43.77:1997/app/icon_redbags.png",
      "http://192.168.43.77:1997/app/icon_free.png",
      ],
      text:
      [
        "我收藏的账号",
        "我的红包",
        "免费体验"
      ]
      
    },
    user:null,//用户信息
  },
  /* */
  selectVideo(){
    wx.chooseVideo({
      sourceType:["album","camera"],
      maxDuration:60,
      camera:["front","back"],
      success:(res)=>{
        var src=res.tempFilePath
        this.setData({src})
      }
    })
  },
  
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /*获取用余额与冻结资金 */
  getfund() {
    var uname = app.globalData.uname
    wx.request({
      url: "http://192.168.43.77:1997/user/data",
      data: { uname },
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        this.setData({user:res.data})
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getfund()
    setInterval(()=>{
      this.getfund()//调用用户信息函数
    },1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },//微信用户方法
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})