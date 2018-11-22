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
              this.setData({ select: res.data.slice(0, 20) })
              this.setData({ selectall: res.data })
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
          this.setData({ select: res.data.slice(0, 20) })
          this.setData({ selectall: res.data })
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
  /*input框敲击事件*/
  val(event){
    this.setData({value: event.detail.value})
  },
  /* 接收参数并前往商品详情页*/
  detail(event){
    wx.request({
      url: 'http://192.168.43.77:1997/search/app_isexist?game_id=' +event.currentTarget.dataset.game_id,
      success:(res)=>{
        if (this.data.ishistory) return
        if(res.data.res==0){
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
  /*搜索历史记录显示隐藏事件 */
  history(){
    setTimeout(()=>{
      this.setData({ ishistory: !this.data.ishistory })
    },300)
  },
  /*点击下拉列表切换样式*/
  istb(e){
    var istop = e.currentTarget.dataset.text
    if(istop==this.data.istop)
      this.setData({ istop: null })
    else
      this.setData({istop})
  },
  /*综合下拉列表切换样式 */
  switch_p(e){
    var block_r;
    var switch_p=e.currentTarget.dataset.i
    this.setData({switch_p})
    if (switch_p == 1 || switch_p == 2 || switch_p == 3 || switch_p==4)
    block_r=true
    else 
    block_r=false
    console.log(block_r)
    this.setData({block_r})
  },
  /**
   * 页面的初始数据
   */
  data: {
    selectall:[],
    select:[],
    imgs:[],
    value:"",
    ify:[24,9,10,168],
    isbottom:false,//是否到底部
    ifhistory:false,//是否显示搜索历史记录
    top:"http://192.168.43.77:1997/app/上箭头.png",//上箭头
    bottom:"http://192.168.43.77:1997/app/下箭头.png",//下箭头
    istop:null,
    ul: ["综合", "销量", "价格", "时间", "收藏", "到时不下线", "新手专区"],
    switch_p:0,//综合菜单点击切换样式
    block_r:false,//综合右侧下拉
  },

  
  selects(id){//全部
    //if(id!=undefined) 
    wx.request({
      url:"http://192.168.43.77:1997/search/app_gamelist",
      success:(res)=>{
        this.setData({ select: res.data.slice(0,20)})
        this.setData({ selectall: res.data})
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
  family(id){//分类加载
    wx.request({
      url: "http://192.168.43.77:1997/search/app_classifylist?game_family_id="+id,
      success: (res) => {
        if(res.data.length==0){
          wx.showToast({
            title: "为您推荐",
            icon: "none",
            duration: 1000
          })
          return
        }
        this.setData({ select: res.data.slice(0, 20) })
        this.setData({ selectall: res.data })
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
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selects(options.game_family_id)
    setTimeout(() => {
      this.family(options.game_family_id)
    }, 300)
    wx.showToast({
      title: "玩命加载中....",
      icon: "loading",
      duration:1000
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

  /*上拉加载更多 */
  loading() {
    console.log(123)
    var all=this.data.selectall
    var select=this.data.select
    for(var i=0;i<5;i++){
      if(all[select.length]==undefined){
        this.setData({isbottom:true})
        break
      }
      select.push(all[select.length])
    }
    this.setData({select})
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})