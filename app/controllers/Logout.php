<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Logout{
  use Controller;
  public function index(){
    echo "Logging out...";
    $session = new Session;
    $session->logout();
    Utils::redirect("login");
  }

}