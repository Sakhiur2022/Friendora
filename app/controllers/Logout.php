<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

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