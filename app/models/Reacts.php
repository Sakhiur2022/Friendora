<?php
class  Reacts
{
    use Model;

    protected $tableName = 'reacts';


    public $errors = [];

    protected $allowedColumns = [
        'uid',
        'post_id',
        'type',
        'reacted_at'
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
          CREATE TABLE IF NOT EXISTS `reacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `reacted_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reacts_ibfk_1` (`uid`),
  CONSTRAINT `reacts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}

