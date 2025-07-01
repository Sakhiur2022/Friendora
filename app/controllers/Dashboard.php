<?php

class Dashboard{
  use Controller;
  public function index(){
    $this->loadView("dashboard");    
  }

}