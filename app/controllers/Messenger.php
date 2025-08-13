<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Messenger {
    use Controller;
    
    public function index() {
        $data = [];
        $ses = new Session;
        
        if (!$ses->is_loggedIn()) {
            Utils::redirect("login");
            return;
        }
        
        // Get user's friends for contact list
        $friendsData = Utils::get_friends(Utils::user('id'), false); // false = return data, don't output JSON
        $data['friends'] = $friendsData['friends'] ?? [];
        $data['scripts'] = ['messenger'];
        $data['jsData'] = [
            'currentUserId' => Utils::user('id')
        ];
        
        $this->loadView("messenger", $data);
    }
    
    public function send_message($receiver_id = null, $message = null) {
        header('Content-Type: application/json');
        
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
            return;
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $receiver_id = $input['receiver_id'] ?? $receiver_id;
            $message = $input['message'] ?? $message;
        }
        
        if (!$receiver_id || !$message) {
            echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
            return;
        }
        
        $sender_id = Utils::user('id');
        
        try {
            $messages = new Messages;
            $messages->createTable(); // Ensure table exists
            
            // Insert message using the model
            $result = $messages->insert([
                'sender_id' => $sender_id,
                'receiver_id' => $receiver_id,
                'content' => $message,
                'status' => 'sent'
            ]);
            
            if ($result) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Message sent successfully',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to send message']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    public function get_inbox() {
        header('Content-Type: application/json');
        
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
            return;
        }
        
        $user_id = Utils::user('id');
        
        try {
            $user_inbox = new User_inbox;
            $user_inbox->createTable(); // Ensure view exists
            
            // Get all latest messages from the view where user is involved
            $query = "SELECT * FROM user_inbox WHERE receiver_id = ? OR sender_id = ?";
            $all_messages = $user_inbox->query($query, [$user_id, $user_id]);
            
            // Group by conversation (other participant) to get unique conversations
            $conversations = [];
            foreach ($all_messages as $message) {
                $other_user_id = ($message['sender_id'] == $user_id) ? $message['receiver_id'] : $message['sender_id'];
                
                // Keep only the latest message per conversation
                if (!isset($conversations[$other_user_id]) || 
                    strtotime($message['sent_at']) > strtotime($conversations[$other_user_id]['sent_at'])) {
                    $conversations[$other_user_id] = $message;
                }
            }
            
            // Convert back to indexed array
            $messages = array_values($conversations);
            
            echo json_encode([
                'status' => 'success',
                'messages' => $messages ?: []
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    public function get_conversation($contact_id = null) {
        header('Content-Type: application/json');
        
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
            return;
        }
        
        if (!$contact_id) {
            echo json_encode(['status' => 'error', 'message' => 'Contact ID required']);
            return;
        }
        
        $user_id = Utils::user('id');
        
        try {
            $messages = new Messages;
            
            // Get conversation between two users with user details
            $query = "SELECT m.*, 
                             u1.fname as sender_fname, u1.lname as sender_lname, 
                             p1.pfp as sender_pfp,
                             u2.fname as receiver_fname, u2.lname as receiver_lname, 
                             p2.pfp as receiver_pfp
                      FROM messages m
                      LEFT JOIN users u1 ON m.sender_id = u1.id
                      LEFT JOIN profile p1 ON p1.user_id = u1.id
                      LEFT JOIN users u2 ON m.receiver_id = u2.id
                      LEFT JOIN profile p2 ON p2.user_id = u2.id
                      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
                         OR (m.sender_id = ? AND m.receiver_id = ?)
                      ORDER BY m.sent_at ASC";
            
            $conversation = $messages->query($query, [$user_id, $contact_id, $contact_id, $user_id]);
            
            echo json_encode([
                'status' => 'success',
                'messages' => $conversation ?: []
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    public function mark_as_read($sender_id = null) {
        header('Content-Type: application/json');
        
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
            return;
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $sender_id = $input['sender_id'] ?? $sender_id;
        }
        
        if (!$sender_id) {
            echo json_encode(['status' => 'error', 'message' => 'Sender ID required']);
            return;
        }
        
        $receiver_id = Utils::user('id');
        
        try {
            $messages = new Messages;
            
            // Update messages to read status
            $result = $messages->updateAll(
                ['status' => 'read'], 
                $receiver_id, 
                'receiver_id',
                "AND sender_id = $sender_id AND status != 'read'"
            );
            
            echo json_encode(['status' => 'success', 'message' => 'Messages marked as read']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    public function poll_new_messages() {
        header('Content-Type: application/json');
        
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
            return;
        }
        
        $last_poll_time = $_GET['last_poll_time'] ?? date('Y-m-d H:i:s', strtotime('-1 hour'));
        $user_id = Utils::user('id');
        
        try {
            $messages = new Messages;
            
            // Poll for new messages since last poll time
            $query = "SELECT m.*, u.fname, u.lname, p.pfp 
                      FROM messages m
                      LEFT JOIN users u ON m.sender_id = u.id
                      LEFT JOIN profile p ON p.user_id = u.id
                      WHERE m.sent_at > ? AND m.receiver_id = ?
                      ORDER BY m.sent_at DESC";
            
            $new_messages = $messages->query($query, [$last_poll_time, $user_id]);
            
            echo json_encode([
                'status' => 'success',
                'new_messages' => $new_messages ?: [],
                'poll_time' => date('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
    
    private function getFriends() {
        try {
            // $friendship = new Friendship;
            $user_id = Utils::user('id');
            
            // Use the existing friendship method but capture output
            ob_start();
            Utils::get_friends($user_id);
            $json_output = ob_get_clean();
            
            $result = json_decode($json_output, true);
            
            if ($result && isset($result['friends'])) {
                return $result['friends'];
            }
            
            return [];
        } catch (Exception $e) {
            return [];
        }
    }
}
