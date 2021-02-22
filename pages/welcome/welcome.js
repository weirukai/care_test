// pages/welcome/welcome.js
//完成登录的判断和蓝牙设备的准备工作
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    devices:[
      {
        deviceID:"3C:C0:EB:15:6A:9A",
        localName:"",
        name:"位置设备"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
      
      if (app.globalData.userInfo) {
        //说明登录成功了
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.hasUserInfo)
    var that=this
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter({
          success: function(res) {
              /* 获取本机的蓝牙状态 */
              setTimeout(() => {
                  that.getBluetoothAdapterState()
              }, 1000)
          },
          fail: function(err) {
            // 初始化失败
          }
      })
  } else {

  }

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

// 检测本机蓝牙是否可用
  getBluetoothAdapterState:function(){
    var that = this;
    that.toastTitle = '检查蓝牙状态'
    wx.getBluetoothAdapterState({
        success: function(res) {
           that.startBluetoothDevicesDiscovery()
        },
        fail(res) {
            console.log(res)
        }
    })
},

//开始搜索蓝牙设备
startBluetoothDevicesDiscovery:function() {
  var that = this;
  setTimeout(() => {
      wx.startBluetoothDevicesDiscovery({
          success: function(res) {
              /* 获取蓝牙设备列表 */
              that.getBluetoothDevices()
          },
          fail(res) {
          }
      })
  }, 1000)
},

//获取搜索到的蓝牙设备列表
getBluetoothDevices:function() {
  var that = this;
  setTimeout(() => {
      wx.getBluetoothDevices({
          services: [],
          allowDuplicatesKey: false,
          interval: 0,
          success: function(res) {
              if (res.devices.length > 0) {
                  if (JSON.stringify(res.devices).indexOf(that.deviceName) !== -1) {
                      for (let i = 0; i < res.devices.length; i++) {
                          if (that.deviceName === res.devices[i].name) {
                              /* 根据指定的蓝牙设备名称匹配到deviceId */
                              that.deviceId = that.devices[i].deviceId;
                              setTimeout(() => {
                                  that.connectTO();
                              }, 2000);
                          };
                      };
                  } else {
                  }
              } else {
              }
          },
          fail(res) {
              console.log(res, '获取蓝牙设备列表失败=====')
          }
      })
  }, 2000)
},
//连接到蓝牙
connectTO:function() {
  wx.createBLEConnection({
      deviceId: deviceId,
      success: function(res) {
          that.connectedDeviceId = deviceId;
          /* 4.获取连接设备的service服务 */
          that.getBLEDeviceServices();
          wx.stopBluetoothDevicesDiscovery({
              success: function(res) {
                  console.log(res, '停止搜索')
              },
              fail(res) {
              }
          })
      },
      fail: function(res) {
      }
  })
},

//获取蓝牙设备的服务，获取的serviceId有多个要试着连接最终确定其中是稳定版本的服务获取服务完后获取设备特征值
getBLEDeviceServices:function() {
  setTimeout(() => {
      wx.getBLEDeviceServices({
          deviceId: that.connectedDeviceId,
          success: function(res) {
              that.services = res.services
              /* 获取连接设备的所有特征值 */
              that.getBLEDeviceCharacteristics()
          },
          fail: (res) => {
          }
      })
  }, 2000)
},


//获取到的特征值有多个，最后要用的是能读，能写，能监听的那个值的uuid作为特征值id，
getBLEDeviceCharacteristics:function() {
  setTimeout(() => {
      wx.getBLEDeviceCharacteristics({
          deviceId: connectedDeviceId,
          serviceId: services[2].uuid,
          success: function(res) {
              for (var i = 0; i < res.characteristics.length; i++) {
                  if ((res.characteristics[i].properties.notify || res.characteristics[i].properties.indicate) &&
                      (res.characteristics[i].properties.read && res.characteristics[i].properties.write)) {
                      console.log(res.characteristics[i].uuid, '蓝牙特征值 ==========')
                      /* 获取蓝牙特征值 */
                      that.notifyCharacteristicsId = res.characteristics[i].uuid
                      // 启用低功耗蓝牙设备特征值变化时的 notify 功能
                      that.notifyBLECharacteristicValueChange()
                  }
              }
          },
          fail: function(res) {
          }
      })
  }, 1000)
},

// 启用低功耗蓝牙设备特征值变化时的 notify 功能
notifyBLECharacteristicValueChange:function() { 
  var that = this;
  console.log('6.启用低功耗蓝牙设备特征值变化时的 notify 功能')
  wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.connectedDeviceId,
      serviceId: that.notifyServicweId,
      characteristicId: that.notifyCharacteristicsId,
      complete(res) {
          /*用来监听手机蓝牙设备的数据变化*/
          wx.onBLECharacteristicValueChange(function(res) {
              /**/
              that.balanceData += that.buf2string(res.value)
              that.hexstr += that.receiveData(res.value)
          })
      },
      fail(res) {
          console.log(res, '启用低功耗蓝牙设备监听失败')
          that.measuringTip(res)
      }
  })
},

/*转换成需要的格式*/
 buf2string:function(buffer) {
          var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
          return arr.map((char, i) => {
              return String.fromCharCode(char);
          }).join('');
},
receiveData:function(buf) {
          return this.hexCharCodeToStr(this.ab2hex(buf))
},
/*转成二进制*/
 ab2hex:function (buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer), function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('')
},
/*转成可展会的文字*/
hexCharCodeToStr:function(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16);
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
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