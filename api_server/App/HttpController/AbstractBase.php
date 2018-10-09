<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/8/28
 * Time: 15:50
 */

namespace App\HttpController;


use App\Util\Security;
use EasySwoole\Core\Http\AbstractInterface\Controller;

class AbstractBase extends Controller
{

    protected $user_id = '';
    protected $user_open_id = '';

    public function index()
    {
        $this->actionNotFound('index');
    }

    protected function getRawContent()
    {
        $req = $this->request()->getSwooleRequest()->rawContent();
        return json_decode($req, true);
    }

    protected function error($code = '0', $msg = '', $data = NULL)
    {

        $return_data = [
            'errno' => $code,
            'errmsg' => $msg
        ];
        if (is_array($data)) {
            $return_data['data'] = $data;
        }
        $this->jsonReturn($return_data);
    }

    protected function success($msg = '', $data = NULL)
    {

        $return_data = [
            'errno' => 0,
            'errmsg' => $msg
        ];
        if (is_array($data)) {
            $return_data['data'] = $data;
        }
        $this->jsonReturn($return_data);

    }

    protected function jsonReturn($res_return = [])
    {
        $this->response()->write(json_encode($res_return, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        $this->response()->withHeader('Content-type', 'application/json;charset=utf-8');
        $this->response()->withStatus(200);
    }

    protected function onRequest($actionName): bool
    {
        $token = $this->request()->getHeader('x-travel-token');
        $path = $this->request()->getUri()->getPath();
        if (!in_array($path, ['/Api/login/loginByWeixin'])) {
            $user_info = Security::getUserId($token[0]);
            if (is_object($user_info)) {
                $this->user_id = $user_info->user_id;
                $this->user_open_id = $user_info->openid;
            }
        }
        return true;
    }


}