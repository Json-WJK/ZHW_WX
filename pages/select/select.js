// pages/select/select.js
Page({
  /*搜索 */
  sseek(){
    var kwords=this.data.value.replace(/^\s+|s+$/g,"")
    if (kwords=="") return
    wx.request({
      url: "http://192.168.43.77:1997/search/app_seek?kwords=" + kwords,
      success:(res)=>{
        if(res.data.result==0){
          wx.request({
            url: "http://192.168.43.77:1997/search/app_seeks?kwords=" + kwords,
            success: (res) => {
              console.log(2)
              if(res.data.result == 0){
                wx.showToast({
                  title:"玩命查找中....",
                  icon:"loading",
                })
                setTimeout(()=>{
                  wx.showToast({
                    title: "没有找到哎!",
                    icon:'none',
                    duration:1000
                  })
                },1500)
                return
              }
              this.setData({ select: res.data })
              var box = []//图片容器
              var imgs = [] //最终收集图片
              for (var i = 0; i < res.data.length; i++) {
                box = res.data[i].game_overall_img.slice(21)
                imgs.push("http://192.168.43.77:1997" + box)
              }
              wx.showToast({
                title: "玩命查找中....",
                icon: "loading",
                duration: 1000
              })
              setTimeout(()=>{
                this.setData({ imgs })
              },1000)
              
            },
            fail(res) {
              console.log(res)
            }
          })
        }else{
          console.log(res)
          this.setData({ select: res.data })
          var box = []//图片容器
          var imgs = [] //最终收集图片
          for (var i = 0; i < res.data.length; i++) {
            box = res.data[i].game_overall_img.slice(21)
            imgs.push("http://192.168.43.77:1997" + box)
          }
          wx.showToast({
            title: "玩命查找中....",
            icon: "loading",
            duration: 1000
          })
          setTimeout(() => {
            this.setData({ imgs })
          }, 1000)
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /*input */

  val(event){
    this.setData({value:event.detail.value})
  },
  /**
   * 页面的初始数据
   */
  data: {
    select:[],
    imgs:[],
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  selects(id){
    // if(id!=undefined) return
    wx.request({
      url:"http://192.168.43.77:1997/search/app_gamelist",
      success:(res)=>{
        this.setData({select:res.data})
        var box=[]//图片容器
        var imgs=[] //最终收集图片
        for (var i = 0; i < res.data.length; i++) {
          box = res.data[i].game_overall_img.slice(21)
          imgs.push("http://192.168.43.77:1997" + box)
        }
        this.setData({imgs})
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  family(id){
    wx.request({
      url: "http://192.168.43.77:1997/search/app_classifylist?game_family_id="+id,
      success: (res) => {
        if(res.data.length==0) return
        this.setData({ select: res.data })
        var box = []//图片容器
        var imgs = [] //最终收集图片
        for (var i = 0; i < res.data.length; i++) {
          box = res.data[i].game_overall_img.slice(21)
          imgs.push("http://192.168.43.77:1997" + box)
        }
        this.setData({ imgs })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    this.selects(options.game_family_id)
    wx.showToast({
      title: "玩命加载中....",
      icon: "loading",
      duration:500
    })
    setTimeout(()=>{
      this.family(options.game_family_id)
    },500)
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