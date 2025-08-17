DELIMITER $$

CREATE PROCEDURE mark_as_read(IN p_receiver INT, IN p_sender INT)
BEGIN
    UPDATE messages
    SET status = 'read'
    WHERE receiver_id = p_receiver
      AND sender_id = p_sender
      AND status != 'read';
END$$

DELIMITER ;


DELIMITER $$
CREATE OR REPLACE PROCEDURE count_unread_message(IN p_receiver_id INT)
BEGIN
SELECT COUNT(*) FROM `messages` WHERE status <> 'read' and receiver_id = p_receiver_id;
END$$


DELIMITER $$

CREATE OR REPLACE PROCEDURE send_message(
    IN p_sender INT,
    IN p_receiver INT,
    IN p_content TEXT
)
BEGIN
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (p_sender, p_receiver, p_content);
END$$

DELIMITER ;

