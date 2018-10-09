<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/15
 * Time: 14:09
 */

namespace App\Model;
use think\Model as TPModel;

class Route extends TPModel
{
    /**
     * @param $condition
     * @param string $field
     * @return array|\PDOStatement|string|\think\Model
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getRouteInfo($condition, $field = '*')
    {
        return $this->where($condition)->field($field)->findOrFail();
    }

    /**
     * @param $condition
     * @param $pageSize
     * @param string $order
     * @param string $field
     * @return \think\Paginator
     * @throws \think\db\exception\DbException
     */
    public function getRouteList($condition, $pageSize, $order = 'route_id desc', $field = '*')
    {
        return $this->where($condition)->field($field)->order($order)->paginate($pageSize);
    }

    /**
     * @param $data
     * @param bool $isMulti
     * @return int|string
     */
    public function addRoute($data, $isMulti = false)
    {

        if (!$isMulti) {
            return $this->insertGetId($data);
        } else {
            return $this->insertAll($data);
        }
    }

    /**
     * @param $condition
     * @param $data
     * @return $this
     */
    public function delLogicRoute($condition, $data)
    {
        return $this->where($condition)->update(['is_del' => 0]);
    }

    /**
     * @param $condition
     * @return bool
     * @throws \Exception
     */
    public function delRoute($condition)
    {
        return $this->where($condition)->delete();
    }


}