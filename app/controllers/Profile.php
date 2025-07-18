<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Profile{
  use Controller;
  public function index(){
    $this->loadView("profile");    
  }

}