<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/13
 * Time: 16:48
 */

namespace App\Model\User;
use EasySwoole\Core\Component\Spl\SplBean;
class Bean extends SplBean
{
    protected $route_id;
    protected $user_id;
    protected $is_close;
    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->user_id;
    }
    /**
     * @param mixed $userId
     */
    public function setUserId($userId): void
    {
        $this->use_id = $userId;
    }





    /**
     * @param mixed $addTime
     */
    public function setAddTime($addTime): void
    {
        $this->addTime = $addTime;
    }
    protected function initialize(): void
    {
        if(empty($this->addTime)){
            $this->addTime = time();
        }
        //默认md5是32 位，当从数据库中读出数据恢复为bean的时候，不对密码做md5
        if(strlen($this->password) == 32){
            $this->password = md5($this->password);
        }
    }
}