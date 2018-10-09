'use strict';

/**
 * 用户相关服务
 */

var util = require('./util.js');
var api = require('./api.js');
/**
 * 调用微信登录
 */
function loginByWeixin() {

  var code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then(function (res) {
      code = res.code;
      return util.getUserInfo();
    }).then(function (userInfo) {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
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
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {

  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(function () {
        resolve(true);
      }).catch(function () {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin: loginByWeixin,
  checkLogin: checkLogin
};