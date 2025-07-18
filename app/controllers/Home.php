<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Home{
  use Controller;
  public function index(){
    $data = [];
    
    if (isset($_SESSION['USER'])) {
        $user = $_SESSION['USER'];
        $data['user'] = $user;
       $data['date'] = Utils::getDate(date('Y-m-d'));
    }else{
      Utils::redirect("signup");
    }
    $this->loadView("home",$data);    
  }

}