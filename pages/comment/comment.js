// pages/comment/comment.js
const app=getApp()
Page({
  wjx(e){//评星
    this.setData({grade:e.target.dataset.wjx})
  },
  button(){//提交评价
    var uname = app.globalData.uname
    var game_id = this.data.game_id
    var content=this.data.val
    var grade=this.data.grade
    console.log(uname,game_id,content,grade)
    if(content=="")
    wx.showToast({
      title: '请输入评价内容',
      icon:"none"
    })
    else if (grade == 0)
      wx.showToast({
        title: '评分系统异常',
        icon: "none"
      })
    else
    wx.request({
      url: 'http://192.168.43.77:1997/user/comment',
      data:{uname,game_id,content,grade},
      method:"post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:res=>{
        wx.showLoading({
          title: '发表中...',
        })
        setTimeout(()=>{
          wx.showModal({
            title: '提示',
            content: res.data,
            showCancel: false,
            success:res=>{
              if(res.confirm)
              wx.switchTab({
                url:"/pages/user/user"
              })
            }
          })
          wx.hideLoading()
        },1500)
        
        
      }
    })
  },
  vals(e){
    this.setData({val:e.detail.value})
  },
  /**
   * 页面的初始数据
   */
  data: {
    grade:0,//默认0星
    for:[1,2,3,4,5],//操纵循环变量
    game_id:null,
    val:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({game_id:options.game_id})
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