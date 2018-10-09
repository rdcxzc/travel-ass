"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _amapWx = require("../../static/map/amap-wx.js");

var _amapWx2 = _interopRequireDefault(_amapWx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
var appapi = require("../../static/data/api.js");
var util = require("../../static/data/util.js");
var that;
var checking = false;
// mapSearchInput.js

var key = "4216f7d550dc95ef4ac91e3c0ee6a19a";
exports.default = Page({
  data: {
    text: "定位中…",
    text_city: "",
    latitude: "",
    longitude: "",
    location: "",
    src: "http://static.tbk.nxspecial.cn/items/icon/pos.png",
    end_location: "",
    end_latitude: "",
    end_longitude: "",
    start_location: ""
  },
  fn: function fn() {
    var _this = this;

    wx.getLocation({
      type: "gcj02",
      success: function success(res) {
        _this.data.location = res.latitude + "," + res.longitude;
        console.log(_this.data.location, "location");
      },
      fail: function fail(err) {}
    });
    if (!checking) {
      this.checkCurrentRoute();
    }
  },
  onShow: function onShow() {
    if (!checking) {
      this.checkCurrentRoute();
    }
  },
  reserveAddr: function reserveAddr() {
    var _this2 = this;

    console.log(this.data.location);
    wx.request({
      url: "https://apis.map.qq.com/ws/geocoder/v1/?",
      data: {
        location: this.data.location,
        key: "RHGBZ-S2LAU-5MRV7-4QPTZ-JI25K-HVBDV"
      },
      success: function success(res) {
        console.log(res);
        _this2.setData({
          text: res.data.result.address,
          latitude: res.data.result.location.lat,
          longitude: res.data.result.location.lng,
          text_city: res.data.result.ad_info.city
        });
      }
    });
  },
  createRoute: function createRoute() {
    var start_arr = {};
    var end_arr = {};
    var data = {};

    if (!this.data.longitude || !this.data.latitude) {
      wx.showAlert({
        content: "行程起点未选择"
      });
      return false;
    } else {
      start_arr["start_location"] = this.data.text;
      start_arr["start_latitude"] = this.data.latitude;
      start_arr["start_longitude"] = this.data.longitude;
    }
    if (!this.data.end_latitude || !this.data.end_longitude) {
      wx.showAlert({
        content: "行程终点未填写"
      });
      return false;
    } else {
      end_arr["end_location"] = this.data.end_location;
      end_arr["end_latitude"] = this.data.end_latitude;
      end_arr["end_longitude"] = this.data.end_longitude;
    }

    data["start"] = start_arr;
    data["end"] = end_arr;
    this.sendCreateRoute(data);
  },
  sendCreateRoute: function sendCreateRoute(data) {
    util.request(appapi.CreateNewRoute, data, "POST").then(function (res) {
      if (res.errno == 0) {
        var route_info = {};
        route_info.route_id = res.data.route_id;
        route_info.start = data.start.start_location;
        route_info.end = data.end.end_location;
        route_info.start_location = {
          lat: data.start.start_latitude,
          lng: data.start.start_longitude
        };
        route_info.end_location = {
          lat: data.end.end_latitude,
          lng: data.end.end_longitude
        };

        wx.setStorage({
          key: "route_info",
          data: route_info
        });
        wx.redirectTo({
          url: "/pages/map/index"
        });
      }
    });
  },
  checkCurrentRoute: function checkCurrentRoute() {
    var _this3 = this;

    checking = true;
    var rinfo = wx.getStorageSync("route_info");
    if (rinfo !== null && (typeof rinfo === "undefined" ? "undefined" : _typeof(rinfo)) == "object") {
      if (rinfo.route_id) {
        wx.showConfirm({
          title: "",
          content: "有未完成的行程，继续行程或者结束上次行程并开始新行程",
          cancelText: "继续上次",
          confirmText: "开始新的",
          success: function success(res) {
            console.log(res);
            if (res.confirm) {
              _this3.finishRoute(rinfo);
            }
            if (res.cancel) {
              wx.redirectTo({
                url: "/pages/map/index"
              });
            }
          }
        });
      }
    }
  },
  finishRoute: function finishRoute(rinfo) {
    console.log(appapi);
    util.request(appapi.FinishRoute, { route_id: rinfo.route_id }, "POST").then(function (res) {
      if (res.errno == 0) {
        wx.setStorageSync("route_info", null);
        wx.redirectTo({
          path: "/pages/map/create"
        });
      }
    }).catch(function (res) {
      wx.showToast({
        title: "网络异常"
      });
    });
  },
  getUnfinishRoute: function getUnfinishRoute() {},
  getPosition: function getPosition() {
    var _this4 = this;

    wx.request({
      url: "https://apis.map.qq.com/ws/location/v1/ip",
      data: {
        key: "RHGBZ-S2LAU-5MRV7-4QPTZ-JI25K-HVBDV"
      },
      success: function success(res) {
        _this4.setData({
          text: res.data.result.ad_info.city,
          text_city: res.data.result.ad_info.city
        });
      }
    });
  },
  openLocationChoose: function openLocationChoose(e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: "/pages/map/choose?city=" + this.data.text_city + "&type=" + type
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },
  onReady: function onReady() {
    that = this;
    this.getPosition();
    this.fn();
  }
});