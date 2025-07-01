<?php

class Signup{
  use Controller;
  public function index(){
    $this->loadView("signup");    
  }

}