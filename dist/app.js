'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./static/utils/system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var user = require('./static/data/user.js');
exports.default = App({
  globalData: {
    userInfo: {
      nickname: 'Hi,游客',
      username: '点击去登录',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    device: {
      height: ''
    },
    token: ''
  },
  onLaunch: function onLaunch(e) {
    var _this = this;

    user.checkLogin().then(function (res) {
      _this.globalData.userInfo = wx.getStorageSync('userInfo');
      _this.globalData.token = wx.getStorageSync('token');
    }).catch(function () {});
    var that = this;

    wx.getSystemInfo({
      success: function success(res) {
        that.globalData.device.height = res.windowHeight;
      }
    });
    console.log(e);
    _system2.default.attachInfo();
  },
  onShow: function onShow() {},
  onHide: function onHide() {}
});