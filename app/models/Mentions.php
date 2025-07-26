<?php



class  Mentions
{
    use Model;

    protected $tableName = 'mentions';

    public $errors = [];

    protected $allowedColumns = [
        
        'mentioner_id',
        'mentioned_id',
        'created_at',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `mentions` (
                `
`mentioner_id` int(10) NOT NULL,
  `mentioned_id` int(10) NOT NULL,
                `created_at` datetime DEFAULT current_timestamp() not null,
                PRIMARY KEY (`mentioner_id`,`mentioned_id`),
  KEY `mentioned_id` (`mentioned_id`)
                CONSTRAINT `mentions_ibfk_1` FOREIGN KEY (`mentioned_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `mentions_ibfk_2` FOREIGN KEY (`mentioner_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
