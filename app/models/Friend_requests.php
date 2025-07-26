<?php




class Friend_requests
{
    use Model;
    protected $tableName = 'friend_requests';

    public $errors = [];

    protected $allowedColumns = [
        'id',
        'sender_id',
        'receiver_id',
        'sent_at',
        'responded_at',
        'status',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql =  "CREATE TABLE if not EXISTS `friend_requests` (
  `sender_id` int(10) NOT NULL,
  `receiver_id` int(10) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `responded_at` datetime NOT NULL,
  `status` enum('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`sender_id`,`receiver_id`),
  KEY `reciever_id` (`receiver_id`)
) . ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci"
 ;
        $this->query($sql);
    }
}