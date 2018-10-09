<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/10/4
 * Time: 16:26
 */

namespace App\Model;


use think\Model as TPModel;

class Resource extends TPModel
{

    /**
     * @param $data
     * @return int|string
     */
    public function saveResource($data)
    {
        return $this->insertGetId($data);
    }

}