<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');

class App {

    private $controller = "Home";
    private $method = "index";

    public function __construct() {
        $url = $this->splitUrl();

      

        // Now just loadController once
        $this->loadController();
    }

    public function splitUrl() {
        $url = explode("/", $_GET["url"] ?? "home");
        return $url;
    }

    public function loadController() {
        $url = $this->splitUrl();

        if ($url[0] === "") {
            require_once './app/controllers/Home.php';
        } else {
            $path = "./app/controllers/" . ucfirst($url[0]) . ".php";
            if (file_exists($path)) {
                require_once $path;
                $this->controller = ucfirst($url[0]);
                unset($url[0]);
            } else {
                require_once "./app/controllers/_404.php";
                $this->controller = "_404";
            }

            if (!empty($url[1])) {
                if (method_exists($this->controller, $url[1])) {
                    $this->method = $url[1];
                    unset($url[1]);
                }
            }
        }

        $this->controller = new $this->controller;
        call_user_func_array([$this->controller, $this->method], $url);
    }
}
