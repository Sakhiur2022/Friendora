<?php




class  Block

{
    use Model;

    protected $tableName = 'block';

    public $errors = [];

    protected $allowedColumns = [
        'blocker_id',
        'blocked_id',
        'blocked_at',
        'reason',
        'status',
        'unblocked_at',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `block` (
  `blocker_id` int(3) NOT NULL,
  `blocked_id` int(3) NOT NULL,
  `blocked_at` datetime DEFAULT current_timestamp(),
  `reason` text NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `unblocked_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`blocker_id`,`blocked_id`),
  KEY `blocked_id` (`blocked_id`)
)
              CONSTRAINT `block_ibfk_1` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT `block_ibfk_2` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
