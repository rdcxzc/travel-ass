<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/18
 * Time: 16:22
 */

namespace App\Vendor\TaskBean;


use EasySwoole\Core\Component\Spl\SplBean;

class LocationBean extends SplBean
{
    protected $locationInfo = [];

    public function setLocation($location_info = [])
    {
        $this->locationInfo = $location_info;
    }
    public function getLocation(){
        return $this->locationInfo;
    }

    protected function initialize(): void
    {
        // TODO: Implement initialize() method.
    }

}