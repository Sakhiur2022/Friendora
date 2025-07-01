<?php

class Profile{
  use Controller;
  public function index(){
    $this->loadView("profile");    
  }

}