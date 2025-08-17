<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Home{
  use Controller;
  public function index(){
    $data = [];
    $ses = new Session;
    
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    } else {
      $data['date'] = date('F j, Y');
    }
   
    $this->loadView("home",$data);    
  }
  public function get_all_friend_ids(){
    header('Content-Type: application/json');
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    } else {
      $userId = Utils::user('id');
      $friends = new Friend_requests;
      $all_friends = $friends->query('CALL get_friends(:user_id)',["user_id"=>$userId]);
      $all_friend_ids = [];
      foreach ($all_friends as $friend) {
        $all_friend_ids[] = $friend->friend_id;
      }
      echo json_encode($all_friend_ids);
    }
  }

}