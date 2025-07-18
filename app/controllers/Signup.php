<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Signup{
  use Controller;
  public function index(){
    $data = [];
    $request = new Request;
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
      echo "Signup page";
      $user = new User;
      $user->createTable();
      if($user->validate($_POST)){
        $dataToInsert = $_POST;
        // if(isset($dataToInsert['pwd'])){
        //   $dataToInsert['pwd'] = password_hash($dataToInsert['pwd'], PASSWORD_DEFAULT);
        // }
        $user->insert($dataToInsert);
        Utils::redirect("login");
      }
      $data["errors"] = $user->getErrors();
      Utils::show("user");
    }
   
    $this->loadView("signup",$data);    
  }

}