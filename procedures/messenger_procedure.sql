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


