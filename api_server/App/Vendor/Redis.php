<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/18
 * Time: 16:10
 */

namespace App\Vendor;
use EasySwoole\Config;


class Redis
{
    private $con;
    protected static $instance;
    protected $tryConnectTimes = 0;
    protected $maxTryConnectTimes = 3;
    function __construct()
    {
        $this->connect();
    }
    function connect(){
        $this->tryConnectTimes++;
        $conf = Config::getInstance()->getConf("redis");
        $this->con = new \Redis();
        $this->con->connect($conf['host'], $conf['port'],2);
        $this->con->auth($conf['auth']);
        if(!$this->ping()){
            if($this->tryConnectTimes <= $this->maxTryConnectTimes){
                return $this->connect();
            }else{
                trigger_error("redis connect fail");
                return null;
            }
        }
        $this->con->setOption(\Redis::OPT_SERIALIZER,\Redis::SERIALIZER_PHP);
    }
    static function getInstance(){
        if(is_object(self::$instance)){
            return self::$instance;
        }else{
            self::$instance = new Redis();
            return self::$instance;
        }
    }
    function rPush($key,$val){
        try{
            return $this->con->rpush($key,$val);
//            return $ret;
        }catch(\Exception $e){
            $this->connect();
            if($this->tryConnectTimes <= $this->maxTryConnectTimes){
                return $this->rPush($key,$val);
            }else{
                return false;
            }

        }

    }
    function lPop($key){
        try{
            return $this->con->lPop($key);
        }catch(\Exception $e){
            $this->connect();
            if($this->tryConnectTimes <= $this->maxTryConnectTimes){
                return $this->lPop($key);
            }else{
                return false;
            }

        }
    }
    function lSize($key){
        try{
            $ret = $this->con->lSize($key);
            return $ret;
        }catch(\Exception $e){
            $this->connect();
            if($this->tryConnectTimes <= $this->maxTryConnectTimes){
                return $this->lSize($key);
            }else{
                return false;
            }

        }
    }
    function getRedisConnect(){
        return $this->con;
    }
    function ping(){
        try{
            $ret = $this->con->ping();
            if(!empty($ret)){
                $this->tryConnectTimes = 0;
                return true;
            }else{
                return false;
            }
        }catch(\Exception $e){
            return false;
        }
    }

}