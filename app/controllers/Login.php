<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Login{
  use Controller;
  public function index(){
    $data = [];
    $request = new Request;
    if($request->posted()){
       $user = new User;
      $data['email'] = $_POST['email'];
     

      $userInfo =$user->first($data);
      if($userInfo){
        $_SESSION['USER'] = $userInfo;
        Utils::redirect("home");
      }
      else{
          $user->errors['email'] = 'Email not found.';
          $user->errors['pwd'] = 'Incorrect password.';
          $data["errors"] = $user->getErrors(); 
      }
         
    }
  
   
    $this->loadView("login",$data);    
  }

}