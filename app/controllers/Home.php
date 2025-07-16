<?php

class Home{
  use Controller;
  public function index(){
    $data = [];
    if (isset($_SESSION['USER'])) {
        $user = $_SESSION['USER'];
        $data['user'] = $user;
       
    }else{
      Utils::redirect("signup");
    }
    $this->loadView("home",$data);    
  }

}