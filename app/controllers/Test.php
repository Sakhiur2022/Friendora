<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Test{
  use Controller;
  public function index(){
    $data = [];
    $ses = new Session;
    
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    } else {
      $data['date'] = date('F j, Y');
    }
   
    $this->loadView("test",$data);    
  }

}