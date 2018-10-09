<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/7
 * Time: 15:58
 */

namespace App\HttpController\Api;

use App\Model\Route as RouteModel;
use think\Exception;

class Route extends \App\HttpController\AbstractBase
{
    public function createRoute()
    {
        $request = $this->getRawContent();
        if (!empty($request)) {
            $insert_data = [
                'user_id' => $this->user_id,
                'start_time' => time(),
                'start_lat' => $request['start']['start_latitude'],
                'start_lng' => $request['start']['start_longitude'],
                'start_location' => $request['start']['start_location'],
                'end_location' => $request['end']['end_location'],
                'end_lat' => $request['end']['end_latitude'],
                'end_lng' => $request['end']['end_longitude'],
                'is_close' => 0
            ];
            try {
                $routeModel = new RouteModel();
                $result = $routeModel->addRoute($insert_data);
                echo $routeModel->getLastSql();
                if ($result) {
                    $this->success('路线创建成功',['route_id' => $result]);
                } else {
                    $this->error('100001', '路线创建失败');
                }
            } catch (Exception $e) {
                $this->error('100002', $e->getMessage());
            }
        }
    }

    public function getUnFinishRoute()
    {
        $tt = $this->getRawContent();


    }

    public function finishRoute()
    {
        $param = $this->getRawContent();
        $route_id = $param['route_id'];
        if(!$param['route_id']){
            $this->error(100001,'参数错误');
            return false;
        }
        try{
            $route_model = new RouteModel();
            $condition[] = ['route_id','=',$route_id];
            $update['is_close'] = 1;
            $route_model->where($condition)->update($update);
        }catch(Exception $e){
            $this->error($e->getCode(),$e->getMessage());
            return false;
        }
    }

}