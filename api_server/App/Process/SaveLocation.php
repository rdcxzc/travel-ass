<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/18
 * Time: 16:27
 */

namespace App\Process;

use App\Model\RouteRecord;
use App\Vendor\Queue\Location;
use App\Vendor\TaskBean\LocationBean;
use EasySwoole\Core\Component\Logger;
use EasySwoole\Core\Swoole\Process\AbstractProcess;
use Swoole\Process;
use think\Exception;
use EasySwoole\Core\Component\Cache\Cache;

class SaveLocation extends AbstractProcess
{
    private $loop= 0;
    public function run(Process $process)
    {
        $locationRecord = new RouteRecord();

        $this->addTick(300, function () use ($locationRecord) {
            $loop = Cache::getInstance()->get('loop') ?? 0;
            if(Location::size() >= 60  ){
                while(true){
                    $task = Location::pop();
                    if ($task instanceof LocationBean) {
                        $insert_data[] = $task->getLocation();
                        if (count($insert_data) == 60) {
                            try {
                                $locationRecord->saveLocation($insert_data, true);
                                unset($insert_data);
                                break;
                            } catch (Exception $e) {
                                Logger::getInstance()->log('位置记录:' . $e->getMessage());
                            }
                        }
                    }
                }
            }else{
                if($loop >= 35){
                    while(true){
                        $task = Location::pop();
                        if ($task instanceof LocationBean) {
                            $insert_data[] = $task->getLocation();
                            if (count($insert_data) ==Location::size()) {
                                try {
                                    $locationRecord->saveLocation($insert_data, true);
                                    unset($insert_data);
                                    Cache::getInstance()->set('loop',0);
                                    break;
                                } catch (Exception $e) {
                                    Logger::getInstance()->log('位置记录:' . $e->getMessage());
                                }
                            }
                        }
                    }

                }

            }
                //echo Location::size().PHP_EOL;
                $loop ++;
                //echo $loop.PHP_EOL;

                Cache::getInstance()->set('loop', $loop);

        });

        /**
         *
         * $task = Location::pop();
        if ($task instanceof LocationBean) {
        $insert_data[] = $task->getLocation();
        if (count($insert_data) == 60) {
        try {
        $locationRecord->saveLocation($insert_data, true);
        print_r($insert_data);
        unset($insert_data);
        } catch (Exception $e) {
        Logger::getInstance()->log('位置记录:' . $e->getMessage());
        }
        }
        }
         */


    }


    //当进程关闭的时候会执行该事件
    public function onShutDown()
    {
        // TODO: Implement onShutDown() method.
    }

    //当有信息发给该进程的时候，会执行此进程
    public function onReceive(string $str, ...$args)
    {
        // TODO: Implement onReceive() method.
        var_dump('process rec' . $str);
    }

}