"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var that2;
var point = [];
var app = getApp();
var api = require("../../static/data/api.js");
var util = require("../../static/data/util.js");
var EARTH_RADIUS = 6378137.0; //单位M
var PI = Math.PI;

function getGreatCircleDistance(lat1, lng1, lat2, lng2) {}

function getlocation(is_log) {
  var latitude1, longitude1;
  wx.getLocation({
    type: "gcj02",
    success: function success(res) {
      latitude1 = res.latitude;
      longitude1 = res.longitude;
      if (is_log) {
        point.push({ latitude: latitude1, longitude: longitude1 });
        that2.sendLocation(res);
      }
      that2.setData({
        latitude: res.latitude,
        longitude: res.longitude
      });
    }
  });
}

function drawline() {
  that2.setData({
    polyline: [{
      points: point,
      color: "#99FF00",
      width: 4,
      dottedLine: false
    }]
  });
}
exports.default = Page({
  getMapHeight: function getMapHeight() {
    var wHeight = app.globalData.device.height;
    this.setData({
      mapHeight: wHeight - 45
    });
  },
  getIconTop: function getIconTop() {
    var wHeight = app.globalData.device.height;
    this.setData({
      corverTop: wHeight - 120
    });
  },

  onHide: function onHide() {},
  onUnload: function onUnload() {},
  onLoad: function onLoad() {
    this.getMapHeight();
    this.getIconTop();
  },

  onReady: function onReady() {
    that2 = this;
    getlocation();
    util.checkRouteInfo().then(function (res) {
      var loc = [{
        id: 1,
        latitude: res.start_location.lat,
        longitude: res.start_location.lng,
        iconPath: "/static/images/start.png",
        label: {
          fontSize: 12,
          color: "#FF0000",
          content: "",
          x: 0.5,
          y: 0.5
        },
        callout: {
          content: res.start,
          color: "#000000",
          fontSize: 16,
          bgColor: "#ffffff",
          borderRadius: 10,
          display: "ALWAYS",
          padding: 6,
          boxShadow: "0 0 1px 1px rgba(0,0,0,.2)"
        },
        width: 30,
        height: 30
      }, {
        id: 2,
        latitude: res.end_location.lat,
        longitude: res.end_location.lng,
        iconPath: "/static/images/end.png",
        label: {
          fontSize: 12,
          color: "#FF0000",
          content: "",
          x: 0.5,
          y: 0.5
        },
        callout: {
          content: res.end,
          color: "#000000",
          fontSize: 16,
          bgColor: "#ffffff",
          borderRadius: 10,
          display: "ALWAYS",
          padding: 6,
          boxShadow: "0 0 1px 1px rgba(0,0,0,.2)"
        },
        width: 30,
        height: 30
      }];

      that2.setData({
        markers: loc,
        scale: 12,
        route_id: res.route_id
      });
    });
  },
  data: {
    route_id: '',
    polyline: [],
    markers: [],
    latitude: "",
    longitude: "",
    start_icon: "kaishi",
    start_text: "开始记录",
    start_stop: false,
    yuyin_icon: "yuyin",
    yuyin_text: "环境录音",
    yuyin_stop: false,
    timer: "",
    mapHeight: "420",
    corverTop: "",
    scale: 14
  },
  location: function location() {
    getlocation();
  },
  regionchange: function regionchange(e) {},
  markertap: function markertap(e) {},
  controltap: function controltap(e) {},
  sendLocation: function sendLocation(data) {
    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == 'object') {
      data.route_id = this.data.route_id;
    }
    util.request(api.ReportLocation, data, "POST").then(function (res) {});
  },
  startLogLocation: function startLogLocation() {
    if (that2.data.start_stop == false) {
      var repeat = function repeat() {
        // console.log("re")
        var res = getlocation(true);
        console.log(res);
        drawline();
      };

      util.request(api.CreateRoute).then(function (res) {});
      this.timer = setInterval(repeat, 2000);

      that2.setData({
        start_icon: "tingzhi",
        start_text: "停止记录",
        start_stop: true
      });
      this.keepScreenOn();
    } else {
      this.stopLogLocation();
      that2.setData({
        start_icon: "kaishi",
        start_text: "开始记录",
        start_stop: false
      });
    }
  },
  stopLogLocation: function stopLogLocation() {
    console.log("clear");
    clearInterval(this.timer);
    this.cancleScreenOn();
  },
  setScreenBrightness: function setScreenBrightness() {},
  keepScreenOn: function keepScreenOn() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },
  cancleScreenOn: function cancleScreenOn() {
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },
  getSpotPhoto: function getSpotPhoto() {
    wx.navigateTo({
      url: "../map/photo"
    });
  },
  getSpotAudio: function getSpotAudio() {
    if (that2.data.yuyin_stop == false) {
      wx.startRecord({
        success: function success(res) {
          var tempFilePath = res.tempFilePath;
        },
        fail: function fail(res) {
          //录音失败
        }
      });
      that2.setData({
        yuyin_icon: "tingzhi",
        yuyin_text: "停止录音",
        yuyin_stop: true
      });
    } else {
      this.stopGetAudio();
    }
  },
  stopGetAudio: function stopGetAudio() {
    wx.stopRecord();
    that2.setData({
      yuyin_icon: "yuyin",
      yuyin_text: "环境录音",
      yuyin_stop: false
    });
  },
  error: function error(e) {
    console.log(e.detail);
  }
});