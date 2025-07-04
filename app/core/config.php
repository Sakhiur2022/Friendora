<?php

if ($_SERVER['SERVER_NAME'] === 'localhost' ) {
    define('ROOT', 'http://localhost/Friendora/public/');
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'friendora');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_DRIVER', 'mysql');
} 
else {
    define('ROOT', 'https://your-production-url.com/');
    define('DB_HOST', 'production-db-host');
    define('DB_NAME', 'production_database_name');
    define('DB_USER', 'production_db_user');
    define('DB_PASS', 'production_db_password');
    define('DB_DRIVER', 'mysql');
}