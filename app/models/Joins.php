<?php




class  Joins
{
    use Model;

    protected $tableName = 'joins';

    public $errors = [];

    protected $allowedColumns = [
        'group_id',
        'uid',
        'joined_at',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `joins` (
                `uid` int(3) NOT NULL,
  `group_id` int(3) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`uid`,`group_id`),
  KEY `group_id` (`group_id`)
                CONSTRAINT `joins_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `joins_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `profile` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
