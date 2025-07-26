<?php
class Tokens
{
    use Model;
    protected $tableName = 'tokens';

    public $errors = [];

    protected $allowedColumns = [
        'id',
        'user_id',
        'token',
        'created_at',
        'expires_at',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `tokens` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `token` varchar(64) NOT NULL,
                `user_id` int(11) NOT NULL,
                `created_at` datetime DEFAULT current_timestamp(),
                `expires_at` datetime DEFAULT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `user_id` (`user_id`),
                CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}