"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var appapi = require("../../static/data/api.js");
// const util = require("../../static/data/util.js");
var ctx;
var interval;
var app = getApp();
var ischecking = false;

var photoList = new Array();
var photoLists = new Array();
var videoList = new Array();
var that;
var tempheight;

exports.default = Page({
  onReady: function onReady() {
    that = this;
    ctx = wx.createCameraContext();
    this.getCameraHeight();
  },
  getCameraHeight: function getCameraHeight() {
    var wHeight = app.globalData.device.height;
    this.setData({
      camera_height: wHeight - 300
    });
  },
  getIconTop: function getIconTop() {
    var wHeight = app.globalData.device.height;
    this.setData({
      corverTop: wHeight - 120
    });
  },


  data: {
    src: "",
    camera_height: "350",
    position: "back",
    flash: "off",
    show_preview: "block",
    photoList: [],
    video_text: "录视频",
    is_startVideo: false,
    time: "(30s)",
    currentTime: 30,
    photoLists: [],
    videoList: [],
    popupvideo: "none",
    show3: false,
    video: {
      poster: "",
      src: ""
    }
  },

  takePhoto: function takePhoto() {
    var route_info = wx.getStorageSync("route_info");
    console.log(ctx);
    ctx.takePhoto({
      quality: "high",
      success: function success(res) {
        var o = {
          cover: res.tempImagePath,
          path: res.tempImagePath
        };
        photoLists.push(res.tempImagePath);
        photoList.push(o);
        wx.uploadFile({
          url: appapi.UploadFiles,
          filePath: res.tempImagePath,
          name: "file",
          header: {
            // 'Content-Type': 'application/json',
            "X-Travel-Token": wx.getStorageSync("token")
          },
          formData: {
            type: "pic",
            route_id: route_info.route_id
          },
          success: function success(res) {
            if (res.data.errno == 0) {
              wx.showToast({
                title: "上传成功"
              });
            }
            // console.log(res.data);
          }
        });
        // console.log(photoList);
        that.setData({
          photoList: photoList,
          photoLists: photoLists,
          show_preview: "block"
        });
      }
    });
  },
  videoRecord: function videoRecord() {
    var _this = this;

    var is_startVideo = this.data.is_startVideo;
    var route_info = wx.getStorageSync("route_info");
    if (!is_startVideo) {
      ctx.startRecord({
        timeoutCallback: function timeoutCallback(res) {
          var o = {
            cover: res.tempThumbPath,
            path: res.tempVideoPath
          };
          videoList.push(o);
          clearInterval(interval);
          wx.uploadFile({
            url: appapi.UploadFiles,
            filePath: res.tempVideoPath,
            name: "file",
            header: {
              // 'Content-Type': 'application/json',
              "X-Travel-Token": wx.getStorageSync("token")
            },
            formData: {
              type: "video",
              route_id: route_info.route_id
            },
            success: function success(res) {
              if (res.data.errno == 0) {
                wx.showToast({
                  title: "上传成功"
                });
              }
              // console.log(res.data);
            }
          });
          that.setData({
            videoList: videoList,
            show_preview: "block",
            video_text: "录视频",
            currentTime: 30,
            time: "(30s)",
            is_startVideo: false
          });
        },
        success: function success(res) {
          if (!is_startVideo) {
            that.setData({
              video_text: "停止",
              is_startVideo: true
            });
          }
          _this.countDown();
          console.log(res);
        },
        fail: function fail(res) {
          if (!is_startVideo) {
            this.setData({
              video_text: "录视频",
              is_startVideo: false
            });
          }
        }
      });
    } else {
      this.stopVideoRerecord();
    }
  },
  stopVideoRerecord: function stopVideoRerecord() {
    var route_info = wx.getStorageSync("route_info");
    ctx.stopRecord({
      success: function success(res) {
        var o = {
          cover: res.tempThumbPath,
          path: res.tempVideoPath
        };
        videoList.push(o);
        clearInterval(interval);
        wx.uploadFile({
          url: appapi.UploadFiles,
          filePath: res.tempVideoPath,
          name: "file",
          header: {
            // 'Content-Type': 'application/json',
            "X-Travel-Token": wx.getStorageSync("token")
          },
          formData: {
            type: "video",
            route_id: route_info.route_id
          },
          success: function success(res) {
            // console.log(res.data);
            if (res.data.errno == 0) {
              wx.showToast({
                title: "上传成功"
              });
            }
          }
        });
        that.setData({
          videoList: videoList,
          show_preview: "block",
          video_text: "录视频",
          currentTime: 30,
          time: "(30s)",
          is_startVideo: false
        });
      }
    });
  },
  countDown: function countDown() {
    var currentTime = that.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: "(" + currentTime + "s)"
      });
      if (currentTime <= 0) {
        console.log(1111);
        clearInterval(interval);
        that.setData({
          video_text: "录视频",
          currentTime: 30,
          time: "(30s)",
          is_startVideo: false
        });
      }
    }, 1000);
  },
  togglePosition: function togglePosition() {
    this.setData({
      position: this.data.position === "front" ? "back" : "front"
    });
  },
  previewImage: function previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.photoLists
    });
  },
  deleteImg: function deleteImg(e) {
    var index = e.target.dataset.index;
    var src = e.target.dataset.src;
    var imgList = this.data.photoList;
    if (index > -1) {
      imgList.splice(index, 1);
    }
    that.setData({
      photoList: imgList
    });
  },
  deleteVideo: function deleteVideo(e) {
    var index = e.target.dataset.index;
    var src = e.target.dataset.src;
    var videoList = this.data.videoList;
    if (index > -1) {
      videoList.splice(index, 1);
    }
    that.setData({
      videoList: videoList
    });
  },
  previewVideo: function previewVideo(e) {
    tempheight = this.data.camera_height;
    var show = e.currentTarget.dataset.show;
    var poster = e.currentTarget.dataset.poster;
    var src = e.currentTarget.dataset.src;
    this.setData({
      show3: show,
      camera_height: 0,
      popupvideo: "block",
      video: {
        poster: poster,
        src: src
      }
    });
  },
  handleShow3: function handleShow3() {
    this.setData({
      show3: false,
      camera_height: tempheight,
      popupvideo: "none",
      video: {
        poster: "",
        src: ""
      }
    });
  },
  saveFileServer: function saveFileServer() {
    var tempImg = this.data.photoList;
    var tempVideo = this.data.videoList;
    var route_info = wx.getStorageSync("route_info");
    var img_done = false;
    var video_done = false;
    for (var o in tempImg) {
      wx.uploadFile({
        url: appapi.UploadFiles,
        filePath: tempImg[o].cover,
        name: "file",
        header: {
          // 'Content-Type': 'application/json',
          "X-Travel-Token": wx.getStorageSync("token")
        },
        formData: {
          type: "pic",
          route_id: route_info.route_id
        },
        success: function success(res) {
          console.log(res.data);
        }
      });
      if (o == tempImg.length - 1) {
        img_done = true;
      }
    }

    for (var o in tempVideo) {
      wx.uploadFile({
        url: appapi.UploadFiles,
        filePath: tempVideo[o].path,
        name: "file",
        header: {
          "X-Travel-Token": wx.getStorageSync("token")
        },
        formData: {
          type: "video",
          route_id: route_info.route_id
        },
        success: function success(res) {
          console.log(res.data);
        }
      });
      if (o == tempVideo.length - 1) {
        video_done = true;
      }
    }
    if (video_done && img_done) {
      wx.showToast({
        content: "上传成功！"
      });
    }
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //   filePath: tempFilePaths[0],
    //   name: 'file',
    //   formData: {
    //     'user': 'test'
    //   },
    //   success (res){
    //     const data = res.data
    //     //do something
    //   }
    // })
  }
});