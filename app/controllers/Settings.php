<?php


defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Settings{
    use Controller;
    public function index(){
         $data = [];
    $ses = new Session;
    
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    }
       $this->loadView("settings");
    }
}