// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    gradientColor: {
      '0%': '#9cdf9c',
      '100%': '#1c801c',
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    postClasses:[],
    SwiperUrls:['https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1618576833,631712544&fm=26&gp=0.jpg',
    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'], //循环轮播的课程的地址
    interval: 5000,
    duration: 500,
    indicatorDots: true,
    indicatorColor: "#ffffff",
    activecolor:"#00c758",
    autoplay: true,
    progresses:[
      {
        progress:17,//当前进度
        ingredients:[
          {
            drugName:'0.9%氯化钠注射液',
            content:'100ml'
        },{
          drugName:'利巴韦林注射液',
          content:'0.100g'
        },
        {
          drugName:'注射用盐酸头孢替安',
          content:'0.800g'
        }
        ]


      },
      {
        progress:89,//当前进度
        ingredients:[
          {
            drugName:'0.9%氯化钠注射液',
            content:'100ml'
        },{
          drugName:'利巴韦林注射液',
          content:'0.100g'
        },
        {
          drugName:'注射用盐酸头孢替安',
          content:'0.800g'
        }
        ]


      }


    ]


  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
