DELIMITER //

CREATE PROCEDURE send_friend_request(IN p_sender INT, IN p_receiver INT)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_reverse_pending INT DEFAULT 0;

    -- Prevent self-friendship
    IF p_sender = p_receiver THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'cannot friend yourself';
    ELSE
        -- Check if any relation already exists
        SELECT COUNT(*) INTO v_exists
        FROM friend_requests
        WHERE (sender_id = p_sender AND receiver_id = p_receiver)
           OR (sender_id = p_receiver AND receiver_id = p_sender);

        IF v_exists = 0 THEN
            -- If receiver already sent a pending request to sender -> accept it
            SELECT COUNT(*) INTO v_reverse_pending
            FROM friend_requests
            WHERE sender_id = p_receiver
              AND receiver_id = p_sender
              AND status = 'pending';

            IF v_reverse_pending > 0 THEN
                UPDATE friend_requests
                SET status = 'accepted', responded_at = NOW()
                WHERE sender_id = p_receiver AND receiver_id = p_sender AND status = 'pending';
            ELSE
                -- Otherwise insert a new pending request
                INSERT INTO friend_requests (sender_id, receiver_id)
                VALUES (p_sender, p_receiver);
            END IF;
        END IF;
    END IF;
END //

DELIMITER ;


-- accept_friend_request: accepts a pending request (receiver accepts a request from sender)
DROP PROCEDURE IF EXISTS accept_friend_request;
DELIMITER $$
CREATE PROCEDURE accept_friend_request(IN p_sender INT, IN p_receiver INT)
BEGIN
    -- Ensure there exists a pending request sender->receiver
    UPDATE friend_requests
    SET status = 'accepted', responded_at = NOW()
    WHERE sender_id = p_sender AND receiver_id = p_receiver AND status = 'pending';
END$$
DELIMITER ;

-- reject_friend_request: marks pending request as rejected
DROP PROCEDURE IF EXISTS reject_friend_request;
DELIMITER $$
CREATE PROCEDURE reject_friend_request(IN p_sender INT, IN p_receiver INT)
BEGIN
    UPDATE friend_requests
    SET status = 'rejected', responded_at = NOW()
    WHERE sender_id = p_sender AND receiver_id = p_receiver AND status = 'pending';
END$$
DELIMITER ;

-- unfriend: deletes any friendship/request between the two users (both directions)
DROP PROCEDURE IF EXISTS unfriend;
DELIMITER $$
CREATE PROCEDURE unfriend(IN p_user1 INT, IN p_user2 INT)
BEGIN
    DELETE FROM friend_requests
    WHERE (sender_id = p_user1 AND receiver_id = p_user2)
       OR (sender_id = p_user2 AND receiver_id = p_user1);
END$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE get_friends(IN p_user_id INT)
BEGIN
    -- Temporary table: all friends of current user
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_user_friends AS
    SELECT 
        CASE 
            WHEN sender_id = p_user_id THEN receiver_id
            ELSE sender_id
        END AS friend_id
    FROM friend_requests
    WHERE (sender_id = p_user_id OR receiver_id = p_user_id)
      AND status = 'accepted';

    -- Temporary table: all friend pairs for mutual friend calculation
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_all_friends AS
    SELECT 
        sender_id,
        receiver_id
    FROM friend_requests
    WHERE status = 'accepted';

    -- Main select
    SELECT 
        u.id AS friend_id,
        CONCAT(u.fname, ' ', IFNULL(u.lname, '')) AS friend_name,
        p.pfp AS profile_pic,

        -- Mutual friends count
        (
            SELECT COUNT(*)
            FROM temp_all_friends f1
            JOIN temp_all_friends f2 ON
                (
                    (f1.sender_id = f2.sender_id AND f1.receiver_id != f2.receiver_id AND f2.receiver_id = temp_user_friends.friend_id)
                    OR
                    (f1.receiver_id = f2.receiver_id AND f1.sender_id != f2.sender_id AND f2.sender_id = temp_user_friends.friend_id)
                )
            WHERE 
                (f1.sender_id = p_user_id OR f1.receiver_id = p_user_id)
        ) AS mutual_friends,

        -- Total friends count for the friend
        (
            SELECT COUNT(*)
            FROM friend_requests fr3
            WHERE (fr3.sender_id = temp_user_friends.friend_id OR fr3.receiver_id = temp_user_friends.friend_id)
              AND fr3.status = 'accepted'
        ) AS total_friends

    FROM temp_user_friends
    JOIN users u ON u.id = temp_user_friends.friend_id
    LEFT JOIN profile p ON p.user_id = u.id
    ORDER BY friend_name;

    -- Cleanup
    DROP TEMPORARY TABLE IF EXISTS temp_user_friends;
    DROP TEMPORARY TABLE IF EXISTS temp_all_friends;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE get_total_friends(IN p_user_id INT, OUT total_friends INT)
BEGIN
    SELECT COUNT(*) INTO total_friends
    FROM friend_requests
    WHERE status = 'accepted'
      AND (sender_id = p_user_id OR receiver_id = p_user_id);
END $$

DELIMITER ;
