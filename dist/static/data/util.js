'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var api = require('./api.js');

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/**
 * 封封微信的的request
 */
function request(pageurl) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "GET";

  return new Promise(function (resolve, reject) {
    wx.request({
      url: pageurl,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Travel-Token': wx.getStorageSync('token')
      },
      success: function success(res) {
        console.log("success");

        if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            var code = null;
            return login().then(function (res) {
              code = res.code;
              return getUserInfo();
            }).then(function (userInfo) {
              //登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(function (res) {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch(function (err) {
                reject(err);
              });
            }).catch(function (err) {
              reject(err);
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function fail(err) {
        reject(err);
        console.log("failed");
      }
    });
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function success() {
        resolve(true);
      },
      fail: function fail() {
        reject(false);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function success(res) {
        if (res.code) {
          //登录远程服务器
          console.log(res);
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {

    wx.getSetting({
      success: function success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: function success(res) {
              // console.log(res)
              resolve(res);
            },
            fail: function fail(err) {
              reject(err);
            }
          });
        }
      }
    });
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  });
}

function checkRouteInfo() {
  return new Promise(function (resolve, reject) {
    var route_info = wx.getStorageSync('route_info');
    if ((typeof route_info === 'undefined' ? 'undefined' : _typeof(route_info)) == 'object') {
      if (route_info.route_id) {
        resolve(route_info);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

module.exports = {
  formatTime: formatTime,
  request: request,
  redirect: redirect,
  showErrorToast: showErrorToast,
  checkSession: checkSession,
  login: login,
  getUserInfo: getUserInfo,
  checkRouteInfo: checkRouteInfo
};