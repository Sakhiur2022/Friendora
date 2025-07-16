<?php

class Logout{
  use Controller;
  public function index(){
    echo "Logging out...";
     if(!empty($_SESSION['USER'])){
        unset($_SESSION['USER']);
     }
     Utils::redirect("login");
  }

}