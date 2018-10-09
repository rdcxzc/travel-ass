<?php

namespace App\HttpController;


use EasySwoole\Core\Http\Request;
use EasySwoole\Core\Http\Response;
use FastRoute\RouteCollector;

class Router extends \EasySwoole\Core\Http\AbstractInterface\Router
{

    function register(RouteCollector $routeCollector)
    {

        $routeCollector->get('/', function (Request $request, Response $response) {
            $response->write('access deny');
            $response->end();
        });

        $routeCollector->get('/test', function (Request $request, Response $response) {
            $response->write('this router test');
            $response->end();
        });

        $routeCollector->get('/user/{id:\d+}', function (Request $request, Response $response, $id) {
            $response->write("this is router user ,your id is {$id}");
            $response->end();
        });


        $routeCollector->get('/user2/{id:\d+}', '/test2');

    }
}