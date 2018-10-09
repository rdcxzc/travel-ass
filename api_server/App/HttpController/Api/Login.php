<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/6
 * Time: 14:34
 */

namespace App\HttpController\Api;

use App\Util\Curl;
use App\Util\MTool;
use EasySwoole\Config;
use think\Db;
use App\Util\UUID;
use App\Util\Security;

class Login extends \App\HttpController\AbstractBase
{

    public function loginByWeixin()
    {
        $param = $this->getRawContent();
        if(empty($param)){
            $this->error('100001','参数不正确');
            return false;
        }

        $code = $param['code'];
        $fullUserInfo = $param['userInfo'];
        $userInfo = $fullUserInfo['userInfo'];
        $clientIp = '';


        $config = Config::getInstance()->getConf('wxapp');
        $rq = new Curl();

        $q['grant_type'] = 'authorization_code';
        $q['js_code'] = $code;
        $q['appid'] = trim($config['appid']);
        $q['secret'] = trim($config['appsecret']);
        $qu['query'] = $q;
        $res = $rq->request('GET', 'https://api.weixin.qq.com/sns/jscode2session', $qu);

        $sessionData = json_decode($res->getBody(), true);

        if (empty($sessionData['openid']) || !isset($sessionData['openid'])) {
            $this->error('10000', '登录失败');
            return false;
        }

        $signature = sha1($fullUserInfo['rawData'] . $sessionData['session_key']);
        if ($signature != $fullUserInfo['signature']) {
            $this->error('10000', '登录失败', '');
            return false;
        }


        $option = [
            'appid' => $config['appid'],
            'sessionKey' => $sessionData['session_key'],
            'iv' => $fullUserInfo['iv'],
            'encryptData' => $fullUserInfo['encryptedData']
        ];
        $decrypt = MTool::wxdecrypt($option);

        $user_info = Db::name('user')->where(['weixin_openid' => $decrypt['openId']])->find();
        if (empty($user_info)) {
            $insertUser = [
                'username' => 'wxUser' . UUID::v4(),
                'password' => md5(md5($sessionData['openid'])),
                'register_time' => time(),
                'register_ip' => $clientIp,
                'last_login_time' => time(),
                'last_login_ip' => $clientIp,
                'mobile' => '',
                'weixin_openid' => $sessionData['openid'],
                'avatar' => (!empty($userInfo['avatarUrl'])) ? $userInfo['avatarUrl'] : '',
                'gender' => (!empty($userInfo['gender'])) ? $userInfo['gender'] : 0, // 性别 0：未知、1：男、2：女
                'nickname' => $userInfo['nickName']
            ];
            $user_info['id'] = Db::name('user')->insert($insertUser);
        }

        $sessionData['user_id'] = $user_info['id'];
        $newUserInfo = Db::name('user')->where(['id' => $user_info['id']])->field('id, username, nickname, gender, avatar, birthday')->find();


        unset($condition);
        $condition['id'] = $user_info['id'];
        $updateData = [
            'last_login_time' => time(),
            'last_login_ip' => $clientIp
        ];
        Db::name('user')->where($condition)->update($updateData);

        // 创建 token
        unset($sessionData['session_key']);

        $token = Security::createToken($sessionData);
        if (empty($token) || empty($newUserInfo)) {
            $this->error(10000, '登录失败');
            return false;
        }
        $returnToken['token'] = $token;
        $returnToken['userInfo'] = $newUserInfo;

        print_r($returnToken);

        $this->success('登录成功',$returnToken);

    }


}