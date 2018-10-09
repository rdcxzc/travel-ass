'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,
      value: 0
    },
    state: {
      type: String,
      value: 'summary',
      observer: function observer(val) {
        this.data.selfState = val;
        this.setData({
          buttonImageObj: this.buttonImageObjFunc(),
          detailsObj: this.detailsObjFunc()
        });
      }
    },
    animate: {
      type: Boolean,
      value: true
    },
    showArrow: {
      type: Boolean,
      value: true
    },
    detailHeight: { // new
      type: Number
    }
  },

  ready: function ready() {
    var _this = this;

    this.data.detailHeight = 0;
    wx.createSelectorQuery().in(this).select('.details').boundingClientRect(function (res) {
      console.log('details', res.height);
      _this.data.detailHeight = res.height;
    }).exec();

    this.data.selfState = this.properties.state;
    console.log(this.data.selfState);
    this.setData({
      buttonImageObj: this.buttonImageObjFunc(),
      detailsObj: this.detailsObjFunc()
    });
  },


  /**
   * 组件的初始数据
   */
  data: {
    selfState: 'summary',
    triangleImg: './images/triangle.png',
    buttonImageObj: {},
    detailsObj: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    buttonImageObjFunc: function buttonImageObjFunc() {
      var style = {};
      console.log(this.data.animate);
      if (this.data.animate) {
        console.log('???');
        style.transition = 'transform 0.3s';
      }
      if (this.data.selfState === 'summary') {
        style.transform = 'rotate(0deg)';
      } else {
        style.transform = 'rotate(180deg)';
      }
      return style;
    },
    buttonObjFunc: function buttonObjFunc() {
      var style = {};
      return style;
    },
    detailsObjFunc: function detailsObjFunc() {
      var style = {};
      // if (this.animate) {
      // }
      style.transition = 'height .3s';
      if (this.data.selfState === 'summary') {
        style.height = this.data.height;
      } else {
        style.height = this.data.detailHeight;
      }
      return style;
    },
    touchStartHandler: function touchStartHandler() {
      if (this.data.selfState === 'summary') {
        this.data.selfState = 'details';
      } else {
        this.data.selfState = 'summary';
      }
      this.setData({
        buttonImageObj: this.buttonImageObjFunc(),
        detailsObj: this.detailsObjFunc()
      });
    },
    touchMoveHandler: function touchMoveHandler() {},
    touchEndHandler: function touchEndHandler() {}
  }
});