<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Friendship{
  use Controller;
  
  public function index(){
    $data = [];
    $ses = new Session;
    
    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    } else {
      $data['date'] = date('F j, Y');
    }

    $this->loadView("404",$data);
  }

  public function get_friendship_status($user2_id) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
      return;
    }
    
    $user1_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    $query = "SELECT * FROM friend_requests WHERE (sender_id = :user1 AND receiver_id = :user2) OR (sender_id = :user2 AND receiver_id = :user1)";
    $result = $friend_requests->query($query, ['user1' => $user1_id, 'user2' => $user2_id]);

    header('Content-Type: application/json');
    if ($result) {
      $request = $result[0];
      if ($request->status == 'accepted') {
        echo json_encode(['status' => 'friends']);
      } elseif ($request->status == 'pending') {
        if ($request->sender_id == $user1_id) {
          echo json_encode(['status' => 'pending_sent']);
        } else {
          echo json_encode(['status' => 'pending_received']);
        }
      } else { // rejected
        echo json_encode(['status' => 'not_friends']);
      }
    } else {
      echo json_encode(['status' => 'not_friends']);
    }
  }

  public function send_request($receiver_id) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
      return;
    }
    
    $sender_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    
    try {
      $friend_requests->query("CALL send_friend_request(:sender, :receiver)", ['sender' => $sender_id, 'receiver' => $receiver_id]);
      header('Content-Type: application/json');
      echo json_encode(['status' => 'success', 'message' => 'Friend request sent']);
    } catch (Exception $e) {
      header('Content-Type: application/json');
      echo json_encode(['status' => 'error', 'message' => 'Failed to send friend request']);
    }
  }

  public function accept_request($sender_id) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
      return;
    }
    
    $receiver_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    
    try {
      $friend_requests->query("CALL accept_friend_request(:sender, :receiver)", ['sender' => $sender_id, 'receiver' => $receiver_id]);
      header('Content-Type: application/json');
      echo json_encode(['status' => 'success', 'message' => 'Friend request accepted']);
    } catch (Exception $e) {
      header('Content-Type: application/json');
      echo json_encode(['status' => 'error', 'message' => 'Failed to accept friend request']);
    }
  }

  public function reject_request($sender_id) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
      return;
    }
    
    $receiver_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    
    try {
      $friend_requests->query("CALL reject_friend_request(:sender, :receiver)", ['sender' => $sender_id, 'receiver' => $receiver_id]);
      header('Content-Type: application/json');
      echo json_encode(['status' => 'success', 'message' => 'Friend request rejected']);
    } catch (Exception $e) {
      header('Content-Type: application/json');
      echo json_encode(['status' => 'error', 'message' => 'Failed to reject friend request']);
    }
  }

  public function unfriend($friend_id) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
      return;
    }
    
    $user_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    
    try {
      $friend_requests->query("CALL unfriend(:user1, :user2)", ['user1' => $user_id, 'user2' => $friend_id]);
      header('Content-Type: application/json');
      echo json_encode(['status' => 'success', 'message' => 'User unfriended']);
    } catch (Exception $e) {
      header('Content-Type: application/json');
      echo json_encode(['status' => 'error', 'message' => 'Failed to unfriend user']);
    }
  }

  public function get_friend_requests() {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode([]);
      return;
    }
    
    $user_id = $ses->user('id');
    $friend_requests = new Friend_requests;
    $query = "
        SELECT fr.sender_id, u.fname, u.lname, p.pfp, fr.sent_at
        FROM friend_requests fr
        JOIN users u ON u.id = fr.sender_id
        LEFT JOIN profile p ON p.user_id = fr.sender_id
        WHERE fr.receiver_id = :user_id AND fr.status = 'pending'
        ORDER BY fr.sent_at DESC
    ";
    $requests = $friend_requests->query($query, ['user_id' => $user_id]);
    
    header('Content-Type: application/json');
    echo json_encode($requests ?: []);
  }

  public function get_friends($user_id = null) {
    $ses = new Session;
    if (!$ses->is_loggedIn()) {
      echo json_encode([]);
      return;
    }
    
    if ($user_id === null) {
      $user_id = $ses->user('id');
    }
    
    $friend_requests = new Friend_requests;
    $query = "
        SELECT 
            fr.receiver_id AS friend_id,
            CONCAT(u.fname, ' ', IFNULL(u.lname, '')) AS friend_name,
            p.pfp AS profile_pic,
            0 AS mutual_friends
        FROM friend_requests fr
        JOIN users u ON u.id = fr.receiver_id
        LEFT JOIN profile p ON p.user_id = fr.receiver_id
        WHERE fr.sender_id = :user_id AND fr.status = 'accepted'
        
        UNION
        
        SELECT 
            fr.sender_id AS friend_id,
            CONCAT(u.fname, ' ', IFNULL(u.lname, '')) AS friend_name,
            p.pfp AS profile_pic,
            0 AS mutual_friends
        FROM friend_requests fr
        JOIN users u ON u.id = fr.sender_id
        LEFT JOIN profile p ON p.user_id = fr.sender_id
        WHERE fr.receiver_id = :user_id2 AND fr.status = 'accepted'
        
        ORDER BY friend_name
    ";
    $friends = $friend_requests->query($query, ['user_id' => $user_id, 'user_id2' => $user_id]);
    
    header('Content-Type: application/json');
    echo json_encode($friends ?: []);
  }

}