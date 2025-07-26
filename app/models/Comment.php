<?php


class  Comment

{
    use Model;

    protected $tableName = 'comment';

    public $errors = [];

    protected $allowedColumns = [
        'profile_id',
        'content',
        'created_at',
        'comment_id',
        'post_id'        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `comment` (
  `profile_id` int(3) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `comment_id` int(3) DEFAULT NULL,
  `post_id` int(3) DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `user_id` (`comment_id`),
  KEY `post_id` (`post_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
