<?php
class  Notifications
{
    use Model;

    protected $tableName = 'notifications';

    public $errors = [];

    protected $allowedColumns = [
        'notification_id',
        'content',
        'created_at',
        'is_read',
        'type',
        'uid',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `notifications` (
                `notification_id` int(3) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `type` varchar(50) DEFAULT NULL,
  `uid` int(3) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `uid` (`uid`)

                CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `profile` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}

