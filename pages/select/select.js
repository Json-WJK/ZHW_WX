// pages/select/select.js
Page({
  /*搜索 */
  sseek(e){
    //非空验证
    console.log(e)
    var kwords = this.data.value.replace(/^\s+|s+$/g, "")
    //用户点击历史记录时判定 是删除还是搜索
    if(e.target.dataset.text!=undefined){
      /*如果用户点击搜索记录进行搜索  则执行b方案 */
      if (e.currentTarget.dataset.text != undefined)
        kwords = e.currentTarget.dataset.text
    }
    /*如果用户点击了删除 结束函数*/
    if (e.target.dataset.index != undefined)
    return
    console.log(kwords)
    if (kwords=="") return
    var text=[];
          /*获取历史记录 */
    wx.getStorage({
      key: 'seek',
      success:(res)=>{
      },
      complete:(res)=>{
        if(!res.data) res.data=[]//如果storage里没有seek，则创建一个数组
        for (var item of res.data){
          if(item==kwords) return//如果记录中有该记录  return
        }
        res.data.unshift(kwords);
        text=res.data
        console.log(text)
    /*修改 */
        wx.setStorage({
          key: 'seek',
          data: text,
          success:(res)=>{  
          }
        })
      }
    })
    setTimeout(() => {
      this.setData({ historys: text })
    }, 500)
    
    wx.request({
      url: "http://192.168.43.77:1997/search/app_seek?kwords=" + kwords,
      success:(res)=>{
        if(res.data.result==0){
          wx.request({
            url: "http://192.168.43.77:1997/search/app_seeks?kwords=" + kwords,
            success: (res) => {
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
  /*搜索历史记录显示隐藏事件 焦点事件*/
  history(){
    setTimeout(()=>{
      this.setData({ ishistory: !this.data.ishistory })
    },300)
    /*获取历史记录 */
    wx.getStorage({
      key: 'seek',
      success: (res) => {
        this.setData({ historys: res.data })
      },
    })
    
  },
  /*清空与删除单个历史记录 */
  deleteall(e){
    var i = e.currentTarget.dataset.index//删除元素下标
    var box=[]
    if(i==undefined)
    wx.removeStorage({
      key: 'seek',
      success: (res)=> {
        this.setData({historys:[]})
      },
    })
    else if(i!=undefined){
      wx.getStorage({
        key: 'seek',
        success: (res)=> {
          box=res.data
          box.splice(i,1)
          wx.setStorage({
            key: 'seek',
            data: box,
          })
        },
      })
    }
    wx.showToast({
      title: '清除成功',
    })
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
    ishistory:false,//是否显示搜索历史记录
    historys:[],
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
    console.log(getApp().globalData.uname)
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
    var all=this.data.selectall
    var select=this.data.select
    for(var i=0;i<5;i++){
      if(all[select.length]==undefined){
        this.setData({isbottom:true})
        break
      }
      select.push(all[select.length])
    }
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(()=>{
      wx.hideLoading()
    },500)
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