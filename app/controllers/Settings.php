<?php


defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Settings{
    use Controller;
    public function index(){
         $data = [];
    $ses = new Session;
    
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    }
       $this->loadView("settings");
    }

    //functions to update user information

    public function update_user_fname(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $input_data = json_decode(file_get_contents("php://input"), true);
      $result = $user->update(['fname' => $input_data['fname']], Utils::user('id'));

      if($result) {
          echo json_encode(["status" => "success", "message" => "First name updated successfully"]);
      } else {
          echo json_encode(["status" => "error", "message" => "Failed to update first name"]);
      }
    }

    public function update_user_minit(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $input_data = json_decode(file_get_contents("php://input"), true);
      $result = $user->update(['minit' => $input_data['minit']], Utils::user('id'));

      if($result) {
          echo json_encode(["status" => "success", "message" => "Middle initial updated successfully"]);
      } else {
          echo json_encode(["status" => "error", "message" => "Failed to update middle initial"]);
      }
    }

    public function update_user_lname(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $input_data = json_decode(file_get_contents("php://input"), true);
      $result = $user->update(['lname' => $input_data['lname']], Utils::user('id'));
      
      if($result) {
          echo json_encode(["status" => "success", "message" => "Last name updated successfully"]);
      } else {
          echo json_encode(["status" => "error", "message" => "Failed to update last name"]);
      }
    }

    public function update_user_email(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $input_data = json_decode(file_get_contents("php://input"), true);
      if ($user->exists($input_data['email'], 'email')){
          echo json_encode(["status" => "error", "message" => "Email already exists"]);
          exit;
      }
      $result = $user->update(['email' => $input_data['email']], Utils::user('id'));

      if($result) {
          echo json_encode(["status" => "success", "message" => "Email updated successfully"]);
      } else {
          echo json_encode(["status" => "error", "message" => "Failed to update email"]);
      }
    }
    public function update_user_password(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $input_data = json_decode(file_get_contents("php://input"), true);
      
      // // Hash the password before storing (assuming you want to hash it)
      // if(isset($input_data['password'])) {
      //     $input_data['password'] = password_hash($input_data['password'], PASSWORD_DEFAULT);
      // }

      $result = $user->update(['pwd' => $input_data['password']], Utils::user('id'));

      if($result) {
          echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
      } else {
          echo json_encode(["status" => "error", "message" => "Failed to update password"]);
      }
    }

    public function get_user_info(){
      header('Content-Type: application/json');
      $ses = new Session;
      if(!$ses->is_loggedIn()){
          echo json_encode(["status" => "error", "message" => "Unauthorized"]);
          exit;
      }
      $user = new User;
      $user_info = $user->first(['id'=> Utils::user('id')]);
      echo json_encode(["status" => "success", "user_info" => $user_info]);
    }
}