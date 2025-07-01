<?php

Trait Controller{
    public function loadView($view,$data = [],$layout = "main"){
        extract($data);
        $path = "../app/views/$view.view.php";
        if(file_exists($path)){
            ob_start();
            require_once $path;
            $content = ob_get_clean();
        }

        require_once "../app/views/layouts/$layout.view.php";
    }
}