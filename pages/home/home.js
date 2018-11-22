// pages/home/home.js

Page({
  /*跳转至商品详情页 并且传参 */
  toselect(event){
    var family=event.target.dataset.family
    wx.reLaunch({
      url: "/pages/select/select?game_family_id=" + family,
    })
    //({ url: "/pages/select/select?game_family_id="+family}) 
  },
  /**
   * 页面的初始数据
   */
  data: {
    swiper:[
      "http://192.168.43.77:1997/app/lol-m.png",
      "http://192.168.43.77:1997/app/sina.jpg",
      "http://192.168.43.77:1997/app/pifu.jpg"
    ],
    hot_img:[],
    hot_name:[],
    hots:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  hot(){
    wx.request({
      url: "http://192.168.43.77:1997/search/gameclassify",
      success: (res) => {
        this.setData({hots:res.data})
        var imgs=[]  //图片
        var names=[]    //游戏名称
        var box=""   //图片容器
        for(var i=0;i<res.data.length;i++){
          names.push(res.data[i].game_names)
          box=res.data[i].classify_app.slice(21)
          imgs.push("http://192.168.43.77:1997"+box)
          if(i==11) break
        }
        this.setData({ hot_name: names})
        this.setData({ hot_img: imgs })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    this.hot()
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