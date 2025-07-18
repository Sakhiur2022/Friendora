<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');
Trait Controller{
    public function loadView($view,$data = []){
        extract($data);      

        require_once "./app/views/$view.view.php";
    }
}