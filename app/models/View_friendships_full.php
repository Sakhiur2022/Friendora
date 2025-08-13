<?php

class View_friendships_full
{
    use Model;

    protected $tableName = 'View_friendships_full';

    public function createTable()
    {
        $sql = "
            CREATE VIEW IF NOT EXISTS view_friendships_full AS
            SELECT
                fr.sender_id AS user_id,
                fr.receiver_id AS friend_id,
                CONCAT(u.fname, ' ', IFNULL(u.minit, ''), ' ', u.lname) AS friend_name,
                p.pfp AS profile_pic,
                CASE 
                    WHEN fr.status = 'accepted' THEN 'friend'
                    WHEN fr.status = 'pending' THEN 'pending_sent'
                END AS relationship_status,
                CASE 
                    WHEN fr.status = 'accepted' THEN fr.responded_at
                    ELSE fr.sent_at
                END AS since,
                (
                    SELECT COUNT(*) 
                    FROM friend_requests mf1
                    JOIN friend_requests mf2
                        ON (
                            (mf1.sender_id = mf2.sender_id AND mf1.receiver_id != fr.receiver_id AND mf2.receiver_id = fr.receiver_id)
                            OR
                            (mf1.receiver_id = mf2.receiver_id AND mf1.sender_id != fr.receiver_id AND mf2.sender_id = fr.receiver_id)
                        )
                    WHERE mf1.status = 'accepted' AND mf2.status = 'accepted'
                      AND (mf1.sender_id = fr.sender_id OR mf1.receiver_id = fr.sender_id)
                ) AS mutual_friends,
                (
                    SELECT COUNT(*)
                    FROM friend_requests tf
                    WHERE tf.status = 'accepted'
                      AND (tf.sender_id = fr.receiver_id OR tf.receiver_id = fr.receiver_id)
                ) AS total_friends
            FROM friend_requests fr
            JOIN users u ON u.id = fr.receiver_id
            LEFT JOIN profile p ON p.user_id = fr.receiver_id

            UNION

            SELECT
                fr.receiver_id AS user_id,
                fr.sender_id AS friend_id,
                CONCAT(u.fname, ' ', IFNULL(u.minit, ''), ' ', u.lname) AS friend_name,
                p.pfp AS profile_pic,
                CASE 
                    WHEN fr.status = 'accepted' THEN 'friend'
                    WHEN fr.status = 'pending' THEN 'pending_received'
                END AS relationship_status,
                CASE 
                    WHEN fr.status = 'accepted' THEN fr.responded_at
                    ELSE fr.sent_at
                END AS since,
                (
                    SELECT COUNT(*) 
                    FROM friend_requests mf1
                    JOIN friend_requests mf2
                        ON (
                            (mf1.sender_id = mf2.sender_id AND mf1.receiver_id != fr.sender_id AND mf2.receiver_id = fr.sender_id)
                            OR
                            (mf1.receiver_id = mf2.receiver_id AND mf1.sender_id != fr.sender_id AND mf2.sender_id = fr.sender_id)
                        )
                    WHERE mf1.status = 'accepted' AND mf2.status = 'accepted'
                      AND (mf1.sender_id = fr.receiver_id OR mf1.receiver_id = fr.receiver_id)
                ) AS mutual_friends,
                (
                    SELECT COUNT(*)
                    FROM friend_requests tf
                    WHERE tf.status = 'accepted'
                      AND (tf.sender_id = fr.sender_id OR tf.receiver_id = fr.sender_id)
                ) AS total_friends
            FROM friend_requests fr
            JOIN users u ON u.id = fr.sender_id
            LEFT JOIN profile p ON p.user_id = fr.sender_id;
        ";
        $this->query($sql);
    }
}
