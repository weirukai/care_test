// pages/self.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      avatarUrl:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3641306367,2787304394&fm=26&gp=0.jpg'
    },
    prescriptions:[
      //模拟数据，真实数据调用医院服务器数据
      {
        doctorName:"钟南山",
        diagnosis:"新冠肺炎，建议入院治疗",
        date:"2021-02-15"
      },
      {
        doctorName:"钟南山",
        diagnosis:"新冠肺炎，建议入院治疗,先进行初期药物治疗，无效进行激素治疗，EMCO等凑字数检擦字数",
        date:"2021-02-15"
      }
    ]
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