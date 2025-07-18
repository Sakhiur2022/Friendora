<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Dashboard{
  use Controller;
  public function index(){
    $this->loadView("dashboard");    
  }

}