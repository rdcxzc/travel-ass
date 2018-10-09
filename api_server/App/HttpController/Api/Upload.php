<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/9/7
 * Time: 16:52
 */

namespace App\HttpController\Api;

use App\Model\Resource;
use App\Util\MTool;
use App\Util\QiniuUpload;

class Upload extends \App\HttpController\AbstractBase
{

    public function UploadVideo()
    {
        $field = $this->request()->getRequestParam('file_name') ?? 'file';
        $file = $this->request()->getUploadedFile($field);
        if (empty($file)) {
            $this->error('没有检测到文件');
            return false;
        }
        $tempFile = $file->getTempName();
        $options = [];
        $options['video_size'] = $file->getSize() / (1024 * 1024);
        $options['video_name'] = $file->getClientFilename();
        $options['member_id'] = $this->member_id ?? '3189';
        $options['store_id'] = '637';
        $result = QiniuUpload::uploadFile($options, 'goods', $tempFile);
        if (isset($result['error'])) {
            $this->error($result['error']);
            return false;
        }
        if (!empty($result) && isset($result['key'])) {
            $options['video_url'] = $result['full_path'];
            $options['video_place'] = $result['key'];
            $options['add_time'] = time();
            $options['last_playtime'] = time();
            $model = new VideoModel();
            $this->success('视频上传成功', $result);
        } else {
            unset($options);
            $this->error('视频上传失败');
        }


    }




    public function UploadFiles()
    {
        $file = $this->request()->getUploadedFile('file');

        if(!empty($file)){
            $tempName = $file->getTempName();

            $type=$this->request()->getRequestParam('type');
            $route_id = $this->request()->getRequestParam('route_id');

            try {
                $res = QiniuUpload::uploadFile($type, $tempName);
                $model_resource = new Resource();
                $data = [
                    'route_id' => $route_id,
                    'user_id'   => $this->user_id,
                    'file_type' => $type,
                    'file_name' => $res['key'],
                    'file_url'     => $res['full_path'],
                    'file_location' => 'qiniu'
                ];
                $res_id = $model_resource->saveResource($data);

                $this->success('success',['r_id' => $res_id]);
            }catch(\Exception $exception){
                $this->error($exception->getCode(),$exception->getMessage());
                echo $exception->getMessage();

            }

        }




    }

}