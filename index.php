<?php
define("ROOT_PATH", __DIR__);
$minPHPVersion = '7.4.0';
if (version_compare(PHP_VERSION, $minPHPVersion, '<')) {
    die("PHP version must be at least $minPHPVersion. Current version: " . PHP_VERSION);
}
require_once './app/core/ini.php';

$app = new App;
