<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/8/28
 * Time: 15:56
 */

namespace App\HttpController\Api;
use App\HttpController\AbstractBase;
use App\Model\RouteRecord;
use App\Util\MTool;
use App\Vendor\AsyncRedis;
use App\Vendor\Redis;
use App\Vendor\TaskBean\LocationBean;
use EasySwoole\Core\Component\Cache\Cache;
use think\Exception;
class Location extends AbstractBase
{
    public function saveLocation(){

       $res =  $this->request()->getSwooleRequest()->rawContent();
       $this->response()->write($res);

    }

    public function reportLocation(){
        $content = $this->getRawContent();

        $options = [
            'rec_lat'    => $content['latitude'],
            'rec_lng'    => $content['longitude'],
            'user_id'    => $this->user_id,
            'rec_time' => time(),
            'route_id' => $content['route_id']
        ];

        $bean = new LocationBean();
        $bean->setLocation($options);
        \App\Vendor\Queue\Location::set($bean);



        try {
            $new = new RouteRecord();
            $rs = $new->saveLocation($options);
            if ($rs) {

            } else {
                $this->error('save location fail');
            }
        }catch(Exception $e){
            $this->error($e->getMessage());
        }


    }


    public function getLocationWx(){

        $route_id = $this->request()->getRequestParam('route_id');


//        $this->response()->write(Cache::getInstance()->get('loop'));
        //insert
    }

}