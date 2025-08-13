<?php



class  Messages
{
    use Model;

    protected $tableName = 'messages';

    public $errors = [];

    protected $allowedColumns = [
        'sender_id',
        'receiver_id',
        'status',
        'content'
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
           CREATE TABLE IF NOT EXISTS `messages` (
  `message_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','delivered','read') NOT NULL DEFAULT 'sent',
  `content` text NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `messages_ibfk_1` (`sender_id`),
  KEY `messages_ibfk_2` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
