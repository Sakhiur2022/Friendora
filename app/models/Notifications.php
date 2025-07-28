<?php
class  Notifications
{
    use Model;

    protected $tableName = 'notifications';

    public $errors = [];

    protected $allowedColumns = [
        'user_id ',
        'action_by ',
        'type',
        'content',
        'related_post_id',
        'related_comment_id',
        'is_read',
        'read_at'
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE  IF NOT EXISTS `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `action_by` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'general',
  `content` text NOT NULL,
  `related_post_id` int(11) DEFAULT NULL,
  `related_comment_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `action_by` (`action_by`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}

