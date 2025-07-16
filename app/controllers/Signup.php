<?php

class Signup{
  use Controller;
  public function index(){
    $data = [];
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
      $user = new User;
      if($user->validate($_POST)){
        $dataToInsert = $_POST;
        // if(isset($dataToInsert['pwd'])){
        //   $dataToInsert['pwd'] = password_hash($dataToInsert['pwd'], PASSWORD_DEFAULT);
        // }
        $user->insert($dataToInsert);
        Utils::redirect("login");
      }
      $data["errors"] = $user->getErrors();
    }
   
    $this->loadView("signup_test",$data);    
  }

}