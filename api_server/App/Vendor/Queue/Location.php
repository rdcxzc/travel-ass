<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/18
 * Time: 16:16
 */

namespace App\Vendor\Queue;

use App\Vendor\Redis;
use App\Vendor\TaskBean\LocationBean;

class Location
{

    const QUEUE_NAME = 'save_ocation';
    static function set(LocationBean $taskBean){
        return Redis::getInstance()->rPush(self::QUEUE_NAME,$taskBean);
    }
    static function pop(){
        return Redis::getInstance()->lPop(self::QUEUE_NAME);
    }
    static function size(){
        return Redis::getInstance()->lSize(self::QUEUE_NAME);
    }
}


