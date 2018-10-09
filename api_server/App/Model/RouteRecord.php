<?php
/**
 * Created by PhpStorm.
 * User: muchang
 * Date: 2018/9/17
 * Time: 18:59
 */

namespace App\Model;
 use think\Model as TPModel;

class RouteRecord extends TPModel
{
    public function saveLocation($data,$is_mutil = false){
        if(!$is_mutil) {
            return $this->insert($data);
        }else{
            return $this->insertAll($data);
        }
    }

}