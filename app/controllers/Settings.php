<?php


defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Settings{
    use Controller;
    public function index(){
       $this->loadView("settings");
    }
}