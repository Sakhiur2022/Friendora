<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Dashboard{
  use Controller;
  
  public function index(){
    // Check if user is logged in
    $session = new Session();
    if (!$session->is_loggedIn()) {
        Utils::redirect('login');
    }
 
    }
}