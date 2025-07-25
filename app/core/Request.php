<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Request{
    public function method(){
        return $_SERVER['REQUEST_METHOD'];
    }
    public function isPosted(){
        if($this->method() === 'POST'){
            return true;
        }else{
            return false;
        }
    }

    //get value from the POST variable
    public function post($key = '', $default = ''){
        if(empty($key)){
            return $_POST;
        }else if(isset($_POST[$key])){
            return $_POST[$key];
        }
        return $default;
    }

    //put data into the POST variable
    public function set($key,$value = ''){
        $_POST[$key] = $value;
    }

    //get value from the REQUEST variable
    public function input($key, $default = ''){
        if(isset($_REQUEST[$key])){
            return $_REQUEST[$key];
        }
        return $default;
    }

    // get all values from the REQUEST variable
    public function all(){
        return $_REQUEST;
    }

    public function isAjax() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }

}