<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/8/28
 * Time: 11:48
 */

namespace App\Util;
class MTool
{
    public static function var_dump($data = [])
    {
        ob_start();
        var_export($data);
        $content = ob_get_clean();
        return $content;
    }

    public static function wxdecrypt($option = [])
    {
        $d = new wxBizDataCrypt($option['appid'], $option['sessionKey']);
        $code = $d->decryptData($option['encryptData'], $option['iv'], $data);
        if ($code == 0) {
            return json_decode($data,true);
        } else {
            return $code;
        }
    }

    public static function jsonResponse($response,$code=0,$msg='',$data = [],$statusCode = 200){
        $return_data = [
            'errno' => $code,
            'errmsg' => $msg
        ];
        if (is_array($data)) {
            $return_data['data'] = $data;
        }
        $response->write(json_encode($return_data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
        $response->withHeader('Content-type','application/json;charset=utf-8');
        $response->withStatus($statusCode);
        $response->end();
    }

    public static function C($key, $conf = 'common')
    {
        $config = \EasySwoole\Config::getInstance()->getConf($conf);
        $value = null;
        if (strpos(trim($key), '.') !== FALSE) {
            $ks = explode('.', $key);
            $value = $config[$ks[0]][$ks[1]];
        } else {
            $value = !is_null($config[$key]) ? $config[$key] : null;
        }
        return $value;
    }
}