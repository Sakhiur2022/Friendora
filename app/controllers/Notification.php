<?php

defined('ROOT_PATH') or exit('Access denied you hacker!');

class Notification
{
    use Controller;

    public function index()
    {
        // Redirect or show an error, as direct access is not intended
        $this->loadView("404");
    }

    /**
     * Fetches all notifications for the logged-in user.
     */
    public function fetch_all()
    {
        header('Content-Type: application/json');
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['error' => 'Not logged in']);
            http_response_code(403);
            return;
        }

        $notificationModel = new Notifications;
        $userId = $ses->user('id');

        // Join with users_basic to get details about the user who triggered the notification
        $sql = "
            SELECT 
                n.*, 
                ub.Full_Name as userName, 
                ub.profile_photo as userAvatar
            FROM notifications n
            LEFT JOIN users_basic ub ON n.action_by = ub.user_id
            WHERE n.user_id = :user_id
            ORDER BY n.created_at DESC
        ";

        $notifications = $notificationModel->query($sql, ['user_id' => $userId]);

       
        if (is_array($notifications)) {
            foreach ($notifications as $key => $notification) {
                $notifications[$key]->time = $this->time_ago($notification->created_at);
                // Ensure userAvatar has a proper path
                if (empty($notifications[$key]->userAvatar)) {
                    $notifications[$key]->userAvatar = ROOT . '/assets/images/default_pfp.svg';
                } else {
                    // $notifications[$key]->userAvatar = ROOT . '/' . $notifications[$key]->userAvatar;
                }
            }
        }


        echo json_encode($notifications ?: []);
    }

    /**
     * Marks all unread notifications for the user as read.
     */
    public function mark_all_as_read()
    {
        header('Content-Type: application/json');
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['error' => 'Not logged in']);
            http_response_code(403);
            return;
        }

        $notificationModel = new Notifications;
        $userId = $ses->user('id');

        $notificationModel->query("UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = :user_id AND is_read = 0", ['user_id' => $userId]);

        echo json_encode(['success' => true, 'message' => 'All notifications marked as read']);
    }

    /**
     * Marks a specific notification as read.
     */
    public function mark_as_read($notificationId = null)
    {
        header('Content-Type: application/json');
        $ses = new Session;
        if (!$ses->is_loggedIn() || $notificationId === null) {
            echo json_encode(['error' => 'Invalid request']);
            http_response_code(400);
            return;
        }

        $notificationModel = new Notifications;
        $userId = $ses->user('id');

        $notificationModel->query("UPDATE notifications SET is_read = 1, read_at = NOW() WHERE notification_id = :notification_id AND user_id = :user_id", ['notification_id' => $notificationId, 'user_id' => $userId]);

        echo json_encode(['success' => true, 'message' => 'Notification marked as read']);
    }

    //
    public function count_unread_message(){
        header('Content-Type: application/json');
        $ses = new Session;
        if (!$ses->is_loggedIn()) {
            echo json_encode(['error' => 'Not logged in']);
            http_response_code(403);
            return;
        }

        $notificationModel = new Notifications;
        $result = $notificationModel->query('CALL count_unread_message(:user_id)', ['user_id' => Utils::user('id')]);

        echo json_encode(['unread_count' => $result ? (int)$result[0]->{'COUNT(*)'} : 0]);
    }

    // Helper function to generate "time ago" string
    private function time_ago($datetime, $full = false)
    {
        $now = new DateTime;
        $ago = new DateTime($datetime);
        $diff = $now->diff($ago);

        $weeks = floor($diff->d / 7);
        $diff->d -= $weeks * 7;

        $string = [
            'y' => 'year',
            'm' => 'month',
            'w' => 'week',
            'd' => 'day',
            'h' => 'hour',
            'i' => 'minute',
            's' => 'second',
        ];

        $diff_array = [
            'y' => $diff->y,
            'm' => $diff->m,
            'w' => $weeks,
            'd' => $diff->d,
            'h' => $diff->h,
            'i' => $diff->i,
            's' => $diff->s,
        ];

        foreach ($string as $k => &$v) {
            if ($diff_array[$k]) {
                $v = $diff_array[$k] . ' ' . $v . ($diff_array[$k] > 1 ? 's' : '');
            } else {
                unset($string[$k]);
            }
        }

        if (!$full) $string = array_slice($string, 0, 1);
        return $string ? implode(', ', $string) . ' ago' : 'just now';
    }
}