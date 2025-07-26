<?php




class  Media
{
    use Model;

    protected $tableName = 'media';

    public $errors = [];

    protected $allowedColumns = [
        'user_id',
        'group_id',
        'role',
        'joined_at',
        'status',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `membership` (
                `user_id` int(3) NOT NULL,
  `group_id` int(3) NOT NULL,
  `joined_at` datetime NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `group_id` (`group_id`)
                CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}