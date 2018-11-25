// pages/TopUp/TopUp.js
const app=getApp()
Page({
  switch_to(e){//切换到
    var index= e.target.dataset.ify
     //交互切换样式  并 更改val值
    this.setData({ switch: index, val:index})
    
   
  },
  vals(e){  //键盘敲击事件
    this.setData({val:e.detail.value})
    //全部清除
    this.setData({ switch: null })
    for(var index of this.data.ify){
      //交互    匹配用户当前输入的值
      if(index==this.data.val)
      this.setData({switch:index})
    }
  },
  up(){//立即充值
    var uname = app.globalData.uname
    if(this.data.val){
      var up = this.data.val
      wx.request({
        url: 'http://192.168.43.77:1997/user/recharge',
        data:{uname,up},
        method:"post",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          wx.showLoading({
            title: '充值中...',
            mask: true,
          })
          if (res.data.affectedRows>=1)
          setTimeout(() => {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '充值成功',
            showCancel:false,
            success:res=>{
              if (res.confirm)
              
                wx.switchTab({ url: "/pages/user/user" })
              
            }
          })
          }, 1000)
        }
      })
    }
    else
      wx.showModal({
        title: '提示',
        content: '请选择充值金额',
        showCancel: false,
      })
      
      
  },
  /**
   * 页面的初始数据
   */
  data: {
    ify:[5,10,20,50,100,200],
    switch:null,//判断切换样式
    val:null,//输入时val的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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