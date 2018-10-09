"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _amapWx = require("../../static/map/amap-wx.js");

var _amapWx2 = _interopRequireDefault(_amapWx);

var _qqmapWxJssdkMin = require("../../static/map/qqmap-wx-jssdk.min.js");

var _qqmapWxJssdkMin2 = _interopRequireDefault(_qqmapWxJssdkMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = "4216f7d550dc95ef4ac91e3c0ee6a19a";

var qqkey = "RHGBZ-S2LAU-5MRV7-4QPTZ-JI25K-HVBDV";
var address = require("../../static/utils/city.js");

var lonlat;
var city;
exports.default = Page({
  data: {
    tips: [],
    prevent: false,
    keywords: "",
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: "",
    target_city: "请选择",
    animation: [],
    from_type: ""
  },
  onLoad: function onLoad(e) {
    if (typeof e.city != "undefined") {
      this.setData({
        target_city: e.city,
        from_type: e.type
      });
    }
    this.animation = wx.createAnimation();
    var id = address.provinces[0].id;
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id]
      // areas: address.areas[address.citys[id][0].id],
    });
  },


  // 输入框正在输入时触发的事件
  bindInput: function bindInput(e) {
    var _this = this;

    // 通过e.target.value获得输入框当前的值
    var keywords = e.detail.value;
    // 调用amapFile.AMapWX方法构建myAmapFun对象
    var myAmapFun = new _amapWx2.default.AMapWX({ key: key });
    var city = this.data.target_city;
    // myAmapFun对象调用getInputtips方法获得搜索提示数据
    myAmapFun.getInputtips({
      keywords: keywords, // 输入框键入的关键字
      location: lonlat, // 坐标
      city: city, // 城市
      success: function success(data) {
        // 调用成功后的回调函数
        console.log(data, "data");
        if (data && data.tips) {
          _this.setData({
            tips: data.tips
          });
        }
        console.log(_this.data.tips, "this.data.tips");
      }
    });
  },

  // 搜索显示列表点击事件触发
  bindSearch: function bindSearch(e) {
    var _this2 = this;

    var keywords = e.target.dataset.keywords;
    // 调用QQMapWX构造函数构建出qqmap对象
    var qqmap = new _qqmapWxJssdkMin2.default({ key: qqkey });
    // qqmap调用geocoder方法来获取
    qqmap.geocoder({
      address: this.data.target_city + ("" + keywords),
      success: function success(res) {
        console.log(res);
        // 调用成功则执行文字描述转换事件
        var pages = getCurrentPages();
        console.log(pages);
        var prevPage = pages[pages.length - 2];
        console.log(_this2.from);
        if (_this2.data.from_type == "start") {
          prevPage.setData({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            text: keywords
          });
        } else if (_this2.data.from_type == "end") {
          prevPage.setData({
            end_latitude: res.result.location.lat,
            end_longitude: res.result.location.lng,
            end_location: keywords
          });
        }
        console.log(prevPage);
        wx.navigateBack();
      },
      fail: function fail(res) {
        // 调用失败则执行此回调函数
      },
      complete: function complete(res) {
        // 成功与否都将执行此回调函数
      }
    });
  },

  // 文字描述转换事件
  reverseGeocoder: function reverseGeocoder(mapObj, response) {
    var _this3 = this;

    var name = response.result.title;
    // 调用reverseGeocoder由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表
    mapObj.reverseGeocoder({
      location: {
        latitude: response.result.location.lat,
        longitude: response.result.location.lng
      },
      success: function success(res) {
        // 调用成功则执行此回调函数
        // 执行打开第三方地图查看事件
        _this3.openLocation(res, name);
      },
      fail: function fail(res) {
        // 调用失败则执行此回调函数
      },
      complete: function complete(res) {
        // 无论成功与否都会执行此回调函数
      }
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },


  // 点击所在地区弹出选择框
  selectDistrict: function selectDistrict(e) {
    var that = this;
    // 如果已经显示，不在执行显示动画
    if (that.data.addressMenuIsShow) {
      return;
    }
    // 执行显示动画
    that.startAddressAnimation(true);
  },
  // 执行动画
  startAddressAnimation: function startAddressAnimation(isShow) {
    console.log(isShow);
    var that = this;
    if (isShow) {
      console.log(that);
      // vh是用来表示尺寸的单位，高度全屏是100vh
      that.animation.translateY(0 + "vh").step();
    } else {
      that.animation.translateY(40 + "vh").step();
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow
    });
  },
  // 点击地区选择取消按钮
  cityCancel: function cityCancel(e) {
    this.startAddressAnimation(false);
  },
  // 点击地区选择确定按钮
  citySure: function citySure(e) {
    var that = this;
    var city = that.data.city;
    var value = that.data.value;
    that.startAddressAnimation(false);
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + "," + that.data.citys[value[1]].name;
    that.setData({
      areaInfo: areaInfo,
      target_city: that.data.citys[value[1]].name
    });
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function hideCitySelected(e) {
    console.log(e);
    this.startAddressAnimation(false);
  },
  // 处理省市县联动逻辑
  cityChange: function cityChange(e) {
    console.log(e);
    var value = e.detail.value;
    var provinces = this.data.provinces;
    var citys = this.data.citys;
    var areas = this.data.areas;
    var provinceNum = value[0];
    var cityNum = value[1];
    var countyNum = value[2];
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id;
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id]
      });
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id;
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id]
      });
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      });
    }
    console.log(this.data);
  }
});