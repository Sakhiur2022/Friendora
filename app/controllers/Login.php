<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Login{
  use Controller;
  public function index(){
    $data = [];
    $request = new Request;
    $session = new Session;
    if($request->isPosted()){
      $user = new User;
      $data['email'] = $request->post('email');

      $userInfo =$user->first($data);
      if($userInfo){
          // Uncomment the following line if I want to use password hashing
          // if(password_verify($data['pwd'], $userInfo->pwd)){
          //   $session->auth($userInfo);
          //   Utils::redirect("home");
          // }
            // Debug: log both passwords to a file
            file_put_contents(__DIR__.'/../../debug_login.txt',
              'POST: '.trim($request->post('pwd'))."\nDB: ".trim($userInfo->pwd)."\n", FILE_APPEND);
            if(trim($request->post('pwd')) === trim($userInfo->pwd)){
              $session->auth($userInfo);
              Utils::redirect("home");
            }
            else{
              $user->errors['pwd'] = 'Incorrect password.';
            }
      }
      else{
          $user->errors['email'] = 'Email not found.';
        }
        $data["errors"] = $user->getErrors(); 
        
    }
  
   
    $this->loadView("login",$data);    
  }

}