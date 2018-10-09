<?php
/**
 * Created by PhpStorm.
 * User: yf
 * Date: 2018/1/9
 * Time: 下午1:04
 */

namespace EasySwoole;

use App\Util\MTool;
use \EasySwoole\Core\AbstractInterface\EventInterface;
use \EasySwoole\Core\Swoole\ServerManager;
use \EasySwoole\Core\Swoole\EventRegister;
use \EasySwoole\Core\Http\Request;
use \EasySwoole\Core\Http\Response;
use EasySwoole\Core\Swoole\Process\ProcessManager;
use App\Process\Inotify;
use EasySwoole\Core\Utility\File;
use App\Process\SaveLocation;

use think\Db;

use App\Util\Security;

Class EasySwooleEvent implements EventInterface
{

    public static function frameInitialize(): void
    {
        // TODO: Implement frameInitialize() method.
        date_default_timezone_set('Asia/Shanghai');
        self::loadConf(EASYSWOOLE_ROOT . '/Conf');
        // 获得数据库配置
        $dbConf = Config::getInstance()->getConf('database');
        // 全局初始化
        Db::setConfig($dbConf);
    }

    public static function loadConf($ConfPath)
    {
        $Conf = Config::getInstance();
        $files = File::scanDir($ConfPath);
        foreach ($files as $file) {
            $data = require_once $file;
            $Conf->setConf(strtolower(basename($file, '.php')), (array)$data);
        }
    }

    public static function mainServerCreate(ServerManager $server, EventRegister $register): void
    {
        ProcessManager::getInstance()->addProcess('autoReload', Inotify::class);
//        ProcessManager::getInstance()->addProcess('saveLocation',SaveLocation::class);

        // TODO: Implement mainServerCreate() method.
    }

    public static function onRequest(Request $request, Response $response): void
    {

        $response->withHeader('Access-Control-Allow-Origin', '*');
        $response->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        $response->withHeader('Access-Control-Allow-Credentials', 'true');
        $response->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With,X-Travel-Token');
        if ($request->getMethod() === 'OPTIONS') {
            $response->withStatus(Status::CODE_OK);
            $response->end();
        }

        $path = $request->getUri()->getPath();

        $token = $request->getHeader('x-travel-token');
        if (in_array($path, ['/Api/login/loginByWeixin'])) {
        } else {
            if (!empty($token[0])) {
                $ee = Security::validateToken($token[0]);
                if (!$ee) {
                    MTool::jsonResponse($response, 401, 'token已过期，请重新登录！');
                }
            } else {
                MTool::jsonResponse($response, 401, 'Token is expired', [], 401);
            }
        }
    }

    public static function afterAction(Request $request, Response $response): void
    {
        // TODO: Implement afterAction() method.
    }
}