<?php

class User_inbox
{
    use Model;

    protected $tableName = 'user_inbox';

    public function createTable()
    {
        $sql = "
           CREATE VIEW IF NOT EXISTS user_inbox AS
SELECT 
    m.receiver_id,
    m.sender_id,
    m.content,
    m.sent_at,
    m.status
FROM messages m
WHERE m.sent_at = (
    SELECT MAX(sent_at)
    FROM messages
    WHERE sender_id = m.sender_id AND receiver_id = m.receiver_id
);

        ";
        $this->query($sql);
    }
}
