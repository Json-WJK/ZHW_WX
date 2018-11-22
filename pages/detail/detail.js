// pages/detail/detail.js
Page({
  // 点击展开
  unfold(){
    this.setData({isunfold:true})
  },
  //前往order下单页面
  order(){
    if(this.data.ismay)
    wx.navigateTo({url:"/pages/order/order?game_id="+this.data.game_id})
    else
    wx.showModal({
      title: '提示',
      content: '还要再等等哦，我还没好呢！',
      showCancel: false,
      confirmColor:"#ffca00"
    })
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
    game_id:"",
    ismay:true,//是否可租  默认不可租
  },
  /*  查询当前账号信息，，，，，是否可租 */
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
      },
      fail(res) {
        console.log(res)
      }
    })
    //是否可租
    wx.request({
      url: "http://192.168.43.77:1997/detail/lease?game_id=" + game_id,
      success: (res) => {
        if(res.data.length==0) return
        var time = res.data[0].starting_date.replace(/T/, ' ').replace('.000Z', '');
        var duration = res.data[0].duration//持续时间
        var dateBegin = new Date(time);//起始时间
        var dateEnd = new Date();//现在的时间
        var dateDiff = (dateBegin.getTime() + (8 + duration) * 60 * 60 * 1000) - dateEnd.getTime();//时间差的毫秒数
        console.log(dateDiff)
        if(dateDiff>0) this.setData({ismay:false})//更改状态为不可租
        else if (dateDiff <= 0) {
          this.setData({ ismay: true })//更改状态为可租
          wx.request({//更改该账号状态，使其重新上架
            url: 'http://192.168.43.77:1997/detail/remove?game_id='+game_id,
            success:(res)=>{
            }
          })
        }
        console.log(this.data.ismay)
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