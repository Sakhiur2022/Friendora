<?php


defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Search{
    use Controller;
    public function index(){
       $this->loadView("search");
    }
}