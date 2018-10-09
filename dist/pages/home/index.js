"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var user = require("../../static/data/user.js");
var that2;
var app = getApp();
exports.default = Page({
  data: {
    show5: false,
    blurClose: false,
    loginPopUp: false
  },
  onReady: function onReady() {
    var _this = this;

    that2 = this;
    //this.checkLogin();
    user.checkLogin().then(function (res) {
      wx.showToast({
        title: "登录成功",
        icon: "success"
      });

      _this.globalData.userInfo = wx.getStorageSync("userInfo");
      _this.globalData.token = wx.getStorageSync("token");
      var path = wx.getStorageSync('preUrl');
      wx.navigateTo({
        url: path
      });
    }).catch(function () {});
  },
  hideLicense: function hideLicense() {
    this.setData({
      loginPopUp: false
    });
  },
  showLicense: function showLicense() {
    this.setData({
      loginPopUp: true
    });
  },
  goLogin: function goLogin(e) {
    var _this2 = this;

    console.log(e);
    user.loginByWeixin().then(function (res) {
      _this2.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.reLaunch({
        url: "/pages/home/index",
        success: function success() {}
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  show_provision: function show_provision(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      show5: show
    });
  },
  handleShow5: function handleShow5() {
    this.setData({
      show5: false
    });
  },
  goUrl: function goUrl(e) {
    var _this3 = this;

    var path = e.currentTarget.dataset.url;
    user.checkLogin().then(function (res) {
      wx.navigateTo({
        url: path
      });
    }).catch(function () {
      _this3.showLicense();
    });
  }
});