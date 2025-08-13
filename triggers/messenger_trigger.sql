
DELIMITER $$

CREATE TRIGGER messages_before_insert
BEFORE INSERT ON messages
FOR EACH ROW
BEGIN
    SET NEW.status = 'delivered';
END$$

DELIMITER ;


CREATE TABLE messages_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT,
    action ENUM('insert','update') NOT NULL,
    action_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER log_messages_insert
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    INSERT INTO messages_log(message_id, action) VALUES (NEW.message_id, 'insert');
END$$

CREATE TRIGGER log_messages_update
AFTER UPDATE ON messages
FOR EACH ROW
BEGIN
    INSERT INTO messages_log(message_id, action) VALUES (NEW.message_id, 'update');
END$$

DELIMITER ;
