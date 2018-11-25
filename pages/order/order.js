// pages/order/order.js
const app=getApp()
Page({
  /*同意协议 */
  agree(){
    this.setData({isagree:!this.data.isagree})
  },
  /*切换套餐 租号方式 */
  switch(e){
    var i = e.target.dataset.index
    this.setData({ ifyon: i })
    /*如果点击为时租  重新调用计算函数 */
    if(i==0){ 
      this.countnum()
      return
    }
    var price=parseFloat(this.data.ify_hire[i]).toFixed(2)
    var num = (parseFloat(this.data.ify_hire[i]) + parseFloat(this.data.list.hire)).toFixed(2)
    this.setData({ price})
    this.setData({ num: num})
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


  //密码取消按钮  
  qx() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //密码确认  
  qr() {
     /*在这里做模拟验证如果输入123456则为正确 */
    if (this.data.val !=123456)
    wx.showToast({
      title: '密码错误',
      icon: "none"
    })
    else if(this.data.val ==123456){
    this.setData({
      password:true,    //更改密码验证为成功
      hiddenmodalput: true    //隐藏密码框
    })
    // 调用租用事件
    this.affirm()
    }
  },
  //密码框输入的密码   键盘敲击事件
  passwordval(e){
    var val = e.detail.value
    this.setData({val})
  },
  /*确认下单 */
  affirm(){
   //同意协议
    if(!this.data.isagree){
      wx.showToast({
        title:"请同意租号玩协议",
        icon:"none"
      })
      return
    }
    //验证密码 如果密码验证为fasle则弹出密码框
    if(!this.data.password){
      this.setData({ hiddenmodalput: false})
      return
    }
    /*以上为过滤 */
    var uname = app.globalData.uname
    console.log(uname)
    if (uname)
    wx.request({
      url: 'http://192.168.43.77:1997/user/data',
      data: {uname},
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res=> {
        var down = res.data[0].balance - this.data.num
        if(down<0)
        wx.showModal({//余额不足
          title: '提示',
          content: '您的钱包空了哦！',
          showCancel: false,
        })
        else if (down>=0){//余额充足
        console.log(uname,down)
          /*扣费 */
        wx.request({
          url: 'http://192.168.43.77:1997/order/fee',
          data: { uname, down:this.data.num},
          method:"post",
          header:{
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success:res=>{
            
          }
        })
          console.log(this.data.game_id)
          var game_id = this.data.game_id //租用账号id
          var duration=this.data.time   //租用时间
          /*判定租用方式 */
          if  (this.data.ifyon==1) duration=24
          if (this.data.ifyon == 2) duration = 9
          if (this.data.ifyon == 3) duration = 10
          if (this.data.ifyon == 4) duration = 168
          var DateTime=null
          var myDate = new Date();
          var year = myDate.getFullYear();//年
          var month = myDate.getMonth() + 1;//月
          var date = myDate.getDate();//日
          var hour = myDate.getHours();//时
          var minute = myDate.getMinutes();//分
          var second = myDate.getSeconds();//秒
          DateTime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        wx.request({//将订单信息添加数据库
          url: 'http://192.168.43.77:1997/order/add',
          data: { uname,game_id,duration,DateTime},
          method: "post",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            wx.showLoading({
              title: '支付中...',
              duration:1500
            })
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/home/home',
              })
              wx.showToast({
                title: '下单成功',
              })
            },1500)
            
          }
        })
        console.log()
        wx.request({   //将该账号添加至记录
          url: 'http://192.168.43.77:1997/order/often',
          data: { uname, game_id },
          method: "post",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            console.log(res.data)
          }
        })
        }
      }
    })
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
    hiddenmodalput:true,//密码输入框默认隐藏
    val:"",//密码框输入的密码
    password:false, //密码验证 默认不通过
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