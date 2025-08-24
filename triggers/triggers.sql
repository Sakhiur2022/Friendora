DELIMITER $$

-- Trigger for when a user reacts to a post
CREATE OR REPLACE TRIGGER `after_react_insert`
AFTER INSERT ON `reacts`
FOR EACH ROW
BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was reacted to
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who reacted.
    IF post_author_id != NEW.uid THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`)
        VALUES (post_author_id, NEW.uid, 'react', CONCAT('reacted with ', NEW.type, ' to your post'), NEW.post_id);
    END IF;
END$$

-- Trigger for when a user comments on a post
CREATE OR REPLACE TRIGGER `after_comment_insert`
AFTER INSERT ON `comment`
FOR EACH ROW
BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was commented on
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who commented.
    IF post_author_id != NEW.user_id THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`, `related_comment_id`)
        VALUES (post_author_id, NEW.user_id, 'comment', 'commented on your post', NEW.post_id, NEW.id);
    END IF;
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS trg_fr_before_insert;
DELIMITER $$
CREATE TRIGGER trg_fr_before_insert
BEFORE INSERT ON friend_requests
FOR EACH ROW
BEGIN
    IF NEW.sender_id = NEW.receiver_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'cannot send friend request to self';
    END IF;

    -- optional: you could check other constraints here
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_fr_before_update;
DELIMITER $$
CREATE TRIGGER trg_fr_before_update
BEFORE UPDATE ON friend_requests
FOR EACH ROW
BEGIN
    IF (OLD.status <> NEW.status) AND (NEW.status IN ('accepted','rejected')) THEN
        IF NEW.responded_at IS NULL THEN
            SET NEW.responded_at = NOW();
        END IF;
    END IF;
END$$
DELIMITER ;

DELIMITER $$

-- Trigger for when a user reacts to a post
CREATE OR REPLACE TRIGGER `after_share_insert`
AFTER INSERT ON `shares`
FOR EACH ROW
BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was shared
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who shared.
    IF post_author_id != NEW.uid THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`)
        VALUES (post_author_id, NEW.uid, 'share','shared your post', NEW.post_id);
    END IF;
END$$


