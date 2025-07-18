<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

spl_autoload_register(function ($class_name) {
    require_once $fileName = "./app/models/".ucfirst($class_name).".php";
    if (!file_exists($fileName)) {
        throw new Exception("{$class_name} model does not exist.");
    }
});

// session_start();
require_once 'Session.php';
require_once 'config.php';
require_once 'Utils.php';
require_once 'Request.php';
require_once 'Image.php';
require_once 'Pager.php';
require_once 'Database.php';
require_once 'Model.php';
require_once 'Controller.php';
require_once 'App.php';