<?php

return [
        // 数据库类型
        'type'            => 'mysql',
        // 服务器地址
        'hostname'        => '127.0.0.1',
        // 数据库名
        'database'        => 'TravelAssDatabase',
        // 用户名
        'username'        => 'root',
        // 密码
        'password'        => '4b9ca17e063a1051',
        // 端口
        'hostport'        => '3306',
        // 数据库表前缀
        'prefix'          => 'ta_',
        // 是否需要断线重连
        'break_reconnect' => true,
        //分页配置
        'paginate'               => [
            'type'      => 'bootstrap',
            'var_page'  => 'page',
            'list_rows' => 15,
        ],
];