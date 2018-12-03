// pages/collect/collect.js
const app=getApp()
Page({
  /*删除收藏 */
  delete(e){
    var uname=app.globalData.uname
    var game_id=e.target.dataset.game_id
    wx.request({
      url: 'http://192.168.43.77:1997/user/d_enshrines',
      data:{uname,game_id},
      method:"post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:res=>{
        if(res.data)
        wx.showModal({
          title: '提示',
          content: '已取消收藏',
          showCancel: false,
          success: res => {
            if (res.confirm)
            this.collect()
          }
        })
      }
    })
  },
  detail(event) {
    console.log(event.currentTarget.dataset.game_id)
    wx.request({
      url: 'http://192.168.43.77:1997/search/app_isexist?game_id=' +    event.currentTarget.dataset.game_id,
      success: (res) => {
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
  /**
   * 页面的初始数据
   */
  data: {
    select: [],
    imgs: [],
  },

  collect() {//全部
    //if(id!=undefined) 
    var uname = app.globalData.uname
    wx.request({
      url: "http://192.168.43.77:1997/user/enshrine",
      data:{uname},
      method:"post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data)
        res.data.account = res.data.account.reverse()
        this.setData({ select: res.data.account })
        var box = []//图片容器
        var imgs = [] //最终收集图片
        for (var i = 0; i < res.data.account.length; i++) {
          box = res.data.account[i].game_overall_img.slice(21)
          imgs.push("http://192.168.43.77:1997" + box)
        }
        this.setData({ imgs })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.collect()
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