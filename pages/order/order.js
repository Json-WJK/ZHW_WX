// pages/order/order.js
Page({
  /*同意协议 */
  agree(){
    this.setData({isagree:!this.data.isagree})
  },
  switch(e){
    this.setData({ifyon:e.target.dataset.index})
  },
  /*加减时长 并且调用计算函数*/
  count(e){
    if(e.target.dataset.count==1){
      if (this.data.time>=168) {
        wx.showToast({
          title: "不能超过最高时长",
          icon: "none"
        })
        return
      }
      this.setData({time:this.data.time+1})
    }
    else if (e.target.dataset.count==-1){
      if (this.data.time <= this.data.lowest){
        wx.showToast({
          title:"不能低于最低时长",
          icon:"none"
        })
        return
      }
      this.setData({ time: this.data.time-1})
    }
    this.countnum()
  },
  /*计算函数 */
  countnum(){
    var price = (this.data.ify_hire[0] * this.data.time).toFixed(2);
    var num = (parseFloat(price) + parseFloat(this.data.list.hire)).toFixed(2);
    this.setData({ price,num})
  },
  /*确认下单 */
  affirm(){
    if(!this.data.isagree){
      wx.showToast({
        title:"请同意租号玩协议",
        icon:"none"
      })
    }
  },
  /**
   * 页面的初始数据
   */ 
  data: {
    ify: [{ time: "", title: "时租" }, { time: "24", title: "日租" }, { time: "9", title: "包夜" }, { time: "10", title: "10小时" }, { time:"168", title: "周租" }],
    isagree:false,//是否同意协议
    ifyon:0,//当前选择的租号方式
    time:0,
    lowest:0,//最低租用时间
    list: [],
    img: "",
    ify_hire: null,//各套餐价格
    game_id: "",
    price:0,//租金
    num:0,//总价
  },
  order(game_id) {
    //详情
    wx.request({
      url: "http://192.168.43.77:1997/order/affirm",
      data:{game_id},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method:"post",
      success: (res) => {
        console.log(res)
        var list = res.data[0]
        var img ="http://192.168.43.77:1997"+res.data[0].game_overall_img.slice(21)
        this.setData({img})//商品图片
        var ify_hire = []
        this.setData({ list })//商品信息
        ify_hire.push(list.hour, list.day, list.night, list.hours, list.week)
        this.setData({ ify_hire })//商品各套餐价格
        this.setData({ time: list.game_starting, lowest: list.game_starting})//默认租用时间   最低租用时间
        this.countnum()//页面加载时调用一次 防止为0
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
    this.order(options.game_id)
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