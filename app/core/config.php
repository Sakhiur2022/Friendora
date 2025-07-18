<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');
if ($_SERVER['SERVER_NAME'] === 'localhost' ) {
    define('ROOT', 'http://localhost/Friendora');
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'friendora');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_DRIVER', 'mysql');
} 
else {
    define('ROOT', 'https://my-production-url.com');
    define('DB_HOST', 'production-db-host');
    define('DB_NAME', 'production_database_name');
    define('DB_USER', 'production_db_user');
    define('DB_PASS', 'production_db_password');
    define('DB_DRIVER', 'mysql');
}

define('APP_NAME', 'Friendora');
define('APP_VERSION', '1.0.0');
define('APP_AUTHOR', 'Sakhiur');
define('APP_DESCRIPTION', 'A social media platform for friends to connect and share.');


define("DEBUG", true);

if (DEBUG) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}else{
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}



