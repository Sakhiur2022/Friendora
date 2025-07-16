<?php

class Utils{
    public static function show($stuff){
        echo "<pre>";
            print_r($stuff);
        echo "</pre>";
    }

    public static function redirect($url){
        header("Location:".ROOT."/".$url);
        exit();
    }

    public static function escape($string){
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}