<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/5
 * Time: 11:45
 */

namespace App\Util;


use App\Utility\SysConst;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use Qiniu\Processing\PersistentFop;

class QiniuUpload
{

    const pic_ext = ['gif', 'jpg', 'jpeg', 'png'];
    const video_ext = ['mp4', 'avi', 'mov', 'flv'];
    const type =['video','pic','audio'];



    public static function uploadFile( $type = '', $filepath = '', $key = '')
    {
            if (!in_array($type, self::type)) {
                throw new \Exception('上传类型不支持',401);
            }

            if (empty($key)) {
                $key = self::setFileName();
            }
            $dirpath = 'travel/' . $type . '/';
            $result = self::upload($type, $key, $dirpath, $filepath);
            $result['full_path'] = Config::QINIU . $result['key'];
            return $result;

    }

    public static function upload($type = 'video', $key = '', $dirpath = '', $filePath)
    {
        $bucket = Config::Bucket;
        $auth = new Auth(Config::AccessKey, Config::SecretKey);
        $upToken = $auth->uploadToken($bucket);
        $uploadMgr = new UploadManager();
        try {
            list($ret, $err) = $uploadMgr->putFile($upToken, $dirpath.$key, $filePath);
            if ($err !== null) {
                return $err;
            } else {
                return $ret;
            }
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage(),$e->getCode());

        }
    }

    public static function delete($key)
    {

    }

    private static function mime($path, $type = 'video')
    {
        $mime = SysConst::MIME_TYPE[$type];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimetype = finfo_file($finfo, $path);
        finfo_close($finfo);
        if (isset($mime[$mimetype])) {
            return $mime[$mimetype];
        } else {
            return false;
        }
    }


    private static function setFileName()
    {
        $tmp_name = sprintf('%010d', time() - 946656000)
            . sprintf('%03d', intval(microtime()) * 1000)
            . sprintf('%04d', mt_rand(0, 9999));
        return $tmp_name;
    }

}