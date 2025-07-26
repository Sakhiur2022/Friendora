<?php




class  Messeges
{
    use Model;

    protected $tableName = 'messages';

    public $errors = [];

    protected $allowedColumns = [
        'sender_id',
        'receiver_id',
        'content',
        'sent_at',
        'status',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `messages` (
                `sender_id` int(10) NOT NULL,
                `receiver_id` int(10) NOT NULL,
                `content` text NOT NULL,
                `sent_at` datetime DEFAULT current_timestamp(),
                `status` enum('sent', 'seen', 'unseen') DEFAULT 'sent',
                PRIMARY KEY (`sender_id`, `receiver_id`, `sent_at`),
                KEY `receiver_id` (`receiver_id`)

                CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
