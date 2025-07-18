<?php


defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Post{
    use Controller;
    public function index(){
       $this->loadView("post");
    }
}