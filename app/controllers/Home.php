<?php

class Home{
  use Controller;
  public function index(){
    $this->loadView("home");    
  }

}