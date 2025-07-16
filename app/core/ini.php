<?php

spl_autoload_register(function ($class_name) {
    require_once $fileName = "./app/models/".ucfirst($class_name).".php";
    if (!file_exists($fileName)) {
        throw new Exception("{$class_name} model does not exist.");
    }
});

require_once 'session.config.php';
require_once 'config.php';
require_once 'Utils.php';
require_once 'Database.php';
require_once 'Model.php';
require_once 'Controller.php';
require_once 'App.php';