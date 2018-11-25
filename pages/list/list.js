// pages/list/list.js
const app=getApp()
Page({


  /*点击切换事件 */
  switch(event){
    var i = event.currentTarget.dataset.i
    this.setData({i})
  },
  detail(event) {
    console.log(event.currentTarget.dataset.game_id)
    wx.request({
      url: 'http://192.168.43.77:1997/search/app_isexist?game_id=' + event.currentTarget.dataset.game_id,
      success: (res) => {
        /*如果当前搜索历史记录正在显示 将执行隐藏并结束函数 */
        if (this.data.ishistory) return
        if (res.data.res == 0) {
          wx.showToast({
            title: '我还没有信息哦！',
            icon: "none"
          })
          return
        }
        wx.navigateTo({ url: "/pages/detail/detail?game_id=" + event.currentTarget.dataset.game_id })
      }
    })

  },
  comment(e){//评论
    wx.navigateTo({
      url: '/pages/comment/comment?game_id='+e.target.dataset.game_id,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    ify:["进行中","正常","预约","投诉","记录","撤单"],
    i:0,//顶部点击下标
    account:null,//账号详细信息
    duration:null,//账号下单信息
    name:null,//账号名称
    imgs:null,//账号图片
    accountover:null,//已完成账号详细信息
    nameover:null,//已完成账号名称
    imgsover:null,//已完成账号图片
  },



  /*查询当前用户的订单情况 */
  lists() {
    var uname = app.globalData.uname
    wx.request({
      url: "http://192.168.43.77:1997/user/lease",
      data: { uname },
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        var name=res.data.name
        var account = res.data.account
        var duration = res.data.duration
        var imgs = res.data.account.game_overall_img
        var box = [] //图片容器
        for (var img of res.data.account){//更改图片域名
          box.push("http://192.168.43.77:1997" + img.game_overall_img.slice(21))
        }
        imgs = box
        this.setData({name,account,duration,imgs})
        console.log(res.data)
      }
    })
    //已完成订单
    wx.request({
      url: "http://192.168.43.77:1997/user/often",
      data: { uname },
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        var nameover=res.data.name
        var accountover = res.data.account
        var imgsover = res.data.account.game_overall_img
        var box = [] //图片容器
        for (var img of res.data.account){//更改图片域名
          box.push("http://192.168.43.77:1997" + img.game_overall_img.slice(21))
        }
        imgsover = box
        this.setData({nameover,accountover,imgsover})
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lists()
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