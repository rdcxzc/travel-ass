'use strict';

var ApiRootUrl = 'https://travelass.api.nxspecial.cn/Api/';

module.exports = {
  AuthLoginByWeixin: ApiRootUrl + 'login/loginByWeixin', //微信登录

  ReportLocation: ApiRootUrl + 'location/reportLocation', //上传位置


  CreateNewRoute: ApiRootUrl + 'route/createRoute', //创建行程

  FinishRoute: ApiRootUrl + 'route/finishRoute', //行程结束

  GetRouteList: ApiRootUrl + 'route/getRouteList', //获取历史行程

  UploadFiles: ApiRootUrl + 'upload/uploadFiles'

  // UploadPhoto: ApiRootUrl + ''

};