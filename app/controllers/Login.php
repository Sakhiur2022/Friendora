<?php

class Login{
  use Controller;
  public function index(){
    $data = [];
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
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
  
   
    $this->loadView("login_test",$data);    
  }

}