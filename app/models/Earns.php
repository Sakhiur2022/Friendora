<?php




class  Earns
{
    use Model;

    protected $tableName = 'earns';

    public $errors = [];

    protected $allowedColumns = [
        'uid',
        'badge_id',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS`earns` (
  `uid` int(3) NOT NULL,
  `badge_id` int(3) NOT NULL,
  PRIMARY KEY (`uid`,`badge_id`),
  KEY `badge_id` (`badge_id`)
)
              CONSTRAINT `earns_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT `earns_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badge` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_cis
        ";
        $this->query($sql);
    }
}
