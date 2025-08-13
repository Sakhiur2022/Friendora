<?php

class Vw_accepted_edges
{
    use Model;

    protected $tableName = 'vw_accepted_edges';

    public function createTable()
    {
        $sql = "
            CREATE VIEW IF NOT EXISTS vw_accepted_edges AS
            SELECT sender_id AS user_id, receiver_id AS friend_id
            FROM friend_requests
            WHERE status = 'accepted'
            UNION ALL
            SELECT receiver_id AS user_id, sender_id AS friend_id
            FROM friend_requests
            WHERE status = 'accepted';
        ";
        $this->query($sql);
    }
}
