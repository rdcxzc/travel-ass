<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/18
 * Time: 10:53
 */

namespace App\Vendor;

use App\Util\MTool;
use EasySwoole\Config;


class AsyncRedis
{
    private $client;
    private $options = [
        'database' => 0
    ];
    public function __construct(array $options=[])
    {
        $options = $this->options;
        $conf = Config::getInstance()->getConf('redis');
        $this->redis = new \swoole_redis($options);
        $this->redis->on('close',[$this,'onClose']);
        $this->redis->connect($conf['host'],$conf['port'],[$this,'onConnect']);
    }

    public function get($key = 0){
        $this->client->get($key,function(\swoole_redis $client,$result){

        });
    }

    public function onConnect(\swoole_redis $redis,bool $result){var_dump($result);
    $this->client = $redis;
        if ($result === false) {
            echo "connect to redis server failed.\n";
            throw new \Exception($redis->errMsg,$redis->errCode);
            return;
        }else{
            $redis->subscribe('travel_ass_report_queue');
            $this->client = $redis;

        }
    }

    public function onClose(\swoole_redis $redis){
//        print_r($redis);
    }



}