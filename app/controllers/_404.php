<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class _404{
    use Controller;
    public function index(){
       $this->loadView("404");
    }
}