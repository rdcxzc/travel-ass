<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/8/27
 * Time: 14:24
 */
namespace App\Util;

use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use EasySwoole\Config;

class Security
{
    public static function createToken($uid = [])
    {
        $config = self::getConfig();
        $signer = new Sha256();
        $token = (new Builder())
            ->setId($config['jti'], true)//自定义标识
            ->setIssuedAt(time())//当前时间
            ->setExpiration(time() + $config['expires'])//token有效期时长
            ->set('data', $uid)
            ->sign($signer, $config['jwt_secret'])
            ->getToken();
        return (String)$token;
    }


    /**
     * 检测Token是否过期与篡改
     * @param token
     * @return boolean
     **/
    public static function validateToken($token = null)
    {
        $config = self::getConfig();
        $token = (new Parser())->parse((String)$token);
        $signer = new Sha256();
        if (!$token->verify($signer, $config['jwt_secret'])) {
            return false; //签名不正确
        }

        $validationData = new ValidationData();
        $validationData->setId($config['jti']);//自字义标识

        self::getUserId($token);


        return $token->validate($validationData);
    }


    private static function getConfig($param = '')
    {
        $config = Config::getInstance();
        $jwt_config = $config->getConf('jwt');
        if (empty($param)) {
            return $jwt_config;
        } else {
            return $jwt_config[$param];
        }
    }

    public static function getUserId($token)
    {
        $token = (new Parser())->parse((String)$token);
        $data = $token->getClaim('data');
        return $data;
    }

}