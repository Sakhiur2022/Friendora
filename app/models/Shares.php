<?php




class  Shares
{
    use Model;

    protected $tableName = 'shares';

    public $errors = [];

    protected $allowedColumns = [
        'uid',
        'post_id',
        'share_type',
        'shared_at',
        'shared_id',
        'icon_url',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `shares` (
                 `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `share_type` varchar(100) DEFAULT NULL,
  `shared_id` int(3) NOT NULL,
  `shared_at` datetime NOT NULL,
  `icon_url` text DEFAULT NULL,
  PRIMARY KEY (`uid`,`post_id`)

    KEY `post_id` (`post_id`),
    CONSTRAINT `fk_shares_user` FOREIGN KEY (`uid`) REFERENCES `users`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_shares_post` FOREIGN KEY (`post_id`) REFERENCES `posts`(`postid`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
