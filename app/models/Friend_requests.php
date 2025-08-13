<?php
class Friend_requests
{
    use Model;
    protected $tableName = 'friend_requests';

    public $errors = [];

    protected $allowedColumns = [
        'sender_id',
        'receiver_id',
        'status'
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql =  "CREATE TABLE IF NOT EXISTS friend_requests ( sender_id INT NOT NULL, receiver_id INT NOT NULL, sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, responded_at DATETIME DEFAULT NULL, status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending', PRIMARY KEY (sender_id, receiver_id), CONSTRAINT fk_fr_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_fr_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT chk_sender_receiver CHECK (sender_id <> receiver_id) ) ENGINE=InnoDB;"
 ;
        $this->query($sql);
    }
}