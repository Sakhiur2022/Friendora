<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Signup{
  use Controller;
  public function index(){
    $data = [];
    $request = new Request;
    if($request->isPosted()){     
      $user = new User;
      $user->createTable();
      if($user->validate($request->post())){
        //hashing the password
        // $pwd = password_hash($request->post('pwd'), PASSWORD_DEFAULT);
        // $request->set('pwd', $pwd);

        $user->insert($request->post());
        Utils::redirect("login");
      }
      $data["errors"] = $user->getErrors();
   
    }
   
    $this->loadView("signup",$data);    
  }

}