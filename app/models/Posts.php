<?php

class Posts
{
    use Model;

    protected $tableName = 'post';

    public $errors = [];

    protected $allowedColumns = [
        'id',
        'content',
        'created_at',
        'creator_id',
        'group_id',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `post` (
                `id` int(3) NOT NULL,
                `content` text DEFAULT NULL,
                `created_at` datetime DEFAULT current_timestamp(),
                `creator_id` int(3) DEFAULT NULL,
                `group_id` int(3) DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `creator_id` (`creator_id`),
                KEY `group_id` (`group_id`),
                CONSTRAINT `post_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
