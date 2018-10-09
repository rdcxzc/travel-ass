<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/3/5
 * Time: 下午10:36
 */

namespace App\Utility;


class SysConst
{
    const COOKIE_USER_SESSION_NAME = 'userSession';
    const COOKIE_USER_SESSION_TTL = 24 * 3600;//一天
    const  MIME_TYPE = [
        'video' => [
            'video/x-msvideo' => 'avi',
            'video/x-dv' => 'dv',
            'video/mp4' => 'mp4',
            'video/mpeg' => 'mpg',
            'video/quicktime' => 'mov',
            'video/x-ms-wmv ' => 'wm',
            'video/x-flv' => 'flv',
            'video/x-matroska' => 'mkv'
        ]
    ];
}