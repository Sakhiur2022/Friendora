<?php




class  Reacts
{
    use Model;

    protected $tableName = 'reacts';


    public $errors = [];

    protected $allowedColumns = [
        'uid',
        'post_id',
        'react_type',
        'created_at',
        'icon_url',
        'react_id',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `reacts` (
                 `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `react_type` varchar(50) DEFAULT NULL,
  `react_id` int(3) NOT NULL,
  `created_at` datetime NOT NULL,
  `icon_url` text DEFAULT NULL,
  PRIMARY KEY (`uid`,`post_id`)

    KEY `post_id` (`post_id`),
    CONSTRAINT `fk_reacts_user` FOREIGN KEY (`uid`) REFERENCES `users`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reacts_post` FOREIGN KEY (`post_id`) REFERENCES `posts`(`postid`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}

