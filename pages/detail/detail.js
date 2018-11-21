// pages/detail/detail.js
Page({
  // 点击展开
  unfold(){
    this.setData({isunfold:true})
  },
  //前往order下单页面
  order(){
    wx.navigateTo({url:"/pages/order/order?game_id="+this.data.game_id})
  },
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    img:"",
    ify: ["时租", "日租", "包夜", "10小时", "周租"],
    ify_hire:null,
    isunfold:false,//展开
    game_id:""
  },
  detail(game_id){
    //图片
    wx.request({
      url:"http://192.168.43.77:1997/detail/gamegallery?game_id="+game_id,
      success:(res)=>{
        var img=""
        img="http://192.168.43.77:1997"+res.data[0].game_sm.slice(21)
        this.setData({img})
      },
      fail(res) {
        console.log(res)
      }
    })
    //详情
    wx.request({
      url: "http://192.168.43.77:1997/detail/details?game_id=" + game_id,
      success: (res) => {
        var list=res.data[0]
        var ify_hire=[]
        this.setData({ list })
        ify_hire.push(list.hour,list.day,list.night,list.hours,list.week)
        this.setData({ify_hire})
        console.log(this.data.ify_hire)
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
    this.detail(options.game_id)
    this.setData({ game_id: options.game_id})
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