-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2025 at 02:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `friendora`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `accept_friend_request` (IN `p_sender` INT, IN `p_receiver` INT)   BEGIN
    -- Ensure there exists a pending request sender->receiver
    UPDATE friend_requests
    SET status = 'accepted', responded_at = NOW()
    WHERE sender_id = p_sender AND receiver_id = p_receiver AND status = 'pending';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `count_unread_message` (IN `p_receiver_id` INT)   BEGIN
SELECT COUNT(*) FROM `messages` WHERE status <> 'read' and receiver_id = p_receiver_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_friends` (IN `p_user_id` INT)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_total_friends` (IN `p_user_id` INT, OUT `total_friends` INT)   BEGIN
    SELECT COUNT(*) INTO total_friends
    FROM friend_requests
    WHERE status = 'accepted'
      AND (sender_id = p_user_id OR receiver_id = p_user_id);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `mark_as_read` (IN `p_receiver` INT, IN `p_sender` INT)   BEGIN
    UPDATE messages
    SET status = 'read'
    WHERE receiver_id = p_receiver
      AND sender_id = p_sender
      AND status != 'read';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reject_friend_request` (IN `p_sender` INT, IN `p_receiver` INT)   BEGIN
    UPDATE friend_requests
    SET status = 'rejected', responded_at = NOW()
    WHERE sender_id = p_sender AND receiver_id = p_receiver AND status = 'pending';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `send_friend_request` (IN `p_sender` INT, IN `p_receiver` INT)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `unfriend` (IN `p_user1` INT, IN `p_user2` INT)   BEGIN
    DELETE FROM friend_requests
    WHERE (sender_id = p_user1 AND receiver_id = p_user2)
       OR (sender_id = p_user2 AND receiver_id = p_user1);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `badge`
--

CREATE TABLE `badge` (
  `id` int(3) NOT NULL,
  `awarded_at` datetime DEFAULT current_timestamp(),
  `badge_desc_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `badge_description`
--

CREATE TABLE `badge_description` (
  `id` int(3) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `block`
--

CREATE TABLE `block` (
  `blocker_id` int(3) NOT NULL,
  `blocked_id` int(3) NOT NULL,
  `block_date` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `user_id` int(3) DEFAULT NULL,
  `post_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `comment`
--
DELIMITER $$
CREATE TRIGGER `after_comment_insert` AFTER INSERT ON `comment` FOR EACH ROW BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was commented on
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who commented.
    IF post_author_id != NEW.user_id THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`, `related_comment_id`)
        VALUES (post_author_id, NEW.user_id, 'comment', 'commented on your post', NEW.post_id, NEW.id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `earns`
--

CREATE TABLE `earns` (
  `uid` int(3) NOT NULL,
  `badge_id` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friend_requests`
--

CREATE TABLE `friend_requests` (
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `responded_at` datetime DEFAULT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending'
) ;

--
-- Dumping data for table `friend_requests`
--

INSERT INTO `friend_requests` (`sender_id`, `receiver_id`, `sent_at`, `responded_at`, `status`) VALUES
(9, 8, '2025-08-24 18:53:28', '2025-08-24 18:53:45', 'accepted');

--
-- Triggers `friend_requests`
--
DELIMITER $$
CREATE TRIGGER `trg_fr_before_insert` BEFORE INSERT ON `friend_requests` FOR EACH ROW BEGIN
    IF NEW.sender_id = NEW.receiver_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'cannot send friend request to self';
    END IF;

    -- optional: you could check other constraints here
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_fr_before_update` BEFORE UPDATE ON `friend_requests` FOR EACH ROW BEGIN
    IF (OLD.status <> NEW.status) AND (NEW.status IN ('accepted','rejected')) THEN
        IF NEW.responded_at IS NULL THEN
            SET NEW.responded_at = NOW();
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

CREATE TABLE `group` (
  `id` int(3) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `creator_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `joins`
--

CREATE TABLE `joins` (
  `uid` int(3) NOT NULL,
  `group_id` int(3) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `post_id` int(3) NOT NULL,
  `media_type` varchar(100) NOT NULL,
  `media_url` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `user_id` int(3) NOT NULL,
  `group_id` int(3) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mentions`
--

CREATE TABLE `mentions` (
  `mentioner_id` int(10) NOT NULL,
  `mentioned_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','delivered','read') NOT NULL DEFAULT 'sent',
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `receiver_id`, `sent_at`, `status`, `content`) VALUES
(112, 8, 9, '2025-08-24 18:54:12', 'read', 'Hi'),
(113, 8, 9, '2025-08-24 18:54:29', 'read', 'How are you?'),
(114, 9, 8, '2025-08-24 18:56:01', 'read', 'I\'m fine'),
(115, 8, 9, '2025-08-24 18:56:51', 'read', 'Nice'),
(116, 8, 9, '2025-08-24 18:57:14', 'read', 'Ok'),
(117, 9, 8, '2025-08-24 18:59:28', 'read', 'Ok'),
(118, 9, 8, '2025-08-24 19:00:52', 'read', 'Hello'),
(119, 9, 8, '2025-08-24 19:01:08', 'read', 'ok');

--
-- Triggers `messages`
--
DELIMITER $$
CREATE TRIGGER `log_messages_insert` AFTER INSERT ON `messages` FOR EACH ROW BEGIN
    INSERT INTO messages_log(message_id, action) VALUES (NEW.message_id, 'insert');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_messages_update` AFTER UPDATE ON `messages` FOR EACH ROW BEGIN
    INSERT INTO messages_log(message_id, action) VALUES (NEW.message_id, 'update');
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `messages_before_insert` BEFORE INSERT ON `messages` FOR EACH ROW BEGIN
    SET NEW.status = 'delivered';
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `messages_log`
--

CREATE TABLE `messages_log` (
  `log_id` bigint(20) NOT NULL,
  `message_id` bigint(20) DEFAULT NULL,
  `action` enum('insert','update') NOT NULL,
  `action_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages_log`
--

INSERT INTO `messages_log` (`log_id`, `message_id`, `action`, `action_at`) VALUES
(1, 112, 'insert', '2025-08-24 18:54:12'),
(2, 113, 'insert', '2025-08-24 18:54:29'),
(3, 112, 'update', '2025-08-24 18:55:43'),
(4, 113, 'update', '2025-08-24 18:55:43'),
(5, 114, 'insert', '2025-08-24 18:56:01'),
(6, 114, 'update', '2025-08-24 18:56:46'),
(7, 115, 'insert', '2025-08-24 18:56:51'),
(8, 115, 'update', '2025-08-24 18:56:58'),
(9, 116, 'insert', '2025-08-24 18:57:14'),
(10, 116, 'update', '2025-08-24 18:57:19'),
(11, 117, 'insert', '2025-08-24 18:59:28'),
(12, 117, 'update', '2025-08-24 18:59:54'),
(13, 118, 'insert', '2025-08-24 19:00:52'),
(14, 118, 'update', '2025-08-24 19:00:55'),
(15, 119, 'insert', '2025-08-24 19:01:08'),
(16, 119, 'update', '2025-08-24 19:01:26');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action_by` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'general',
  `content` text NOT NULL,
  `related_post_id` int(11) DEFAULT NULL,
  `related_comment_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `url` text DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `user_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `url`, `caption`, `user_id`) VALUES
(35, 'http://localhost/Friendora/uploads/profile_photos/profile_8_1756039507.jpg', 'Profile Picture', 8),
(36, 'http://localhost/Friendora/uploads/cover_photos/cover_8_1756039519.jpg', 'Cover Photo', 8),
(38, 'http://localhost/Friendora/uploads/profile_photos/profile_9_1756039920.jpg', 'Profile Picture', 9),
(39, 'http://localhost/Friendora/uploads/cover_photos/cover_9_1756039983.jpg', 'Cover Photo', 9),
(40, 'http://localhost/Friendora/uploads/profile_photos/profile_10_1756040915.jpg', 'Profile Picture', 10),
(41, 'http://localhost/Friendora/uploads/cover_photos/cover_10_1756040926.jpg', 'Cover Photo', 10);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `creator_id` int(3) DEFAULT NULL,
  `group_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `posts_counter`
-- (See below for the actual view)
--
CREATE TABLE `posts_counter` (
`post_id` int(11)
,`comment_count` bigint(21)
,`like_count` bigint(21)
,`haha_count` bigint(21)
,`angry_count` bigint(21)
,`wow_count` bigint(21)
,`share_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(3) NOT NULL,
  `hometown` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `shortBio` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `pfp` text DEFAULT NULL,
  `socialQuote` text DEFAULT NULL,
  `lifeEvent` text DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `polViews` text DEFAULT NULL,
  `lang` varchar(50) DEFAULT NULL,
  `professional` text DEFAULT NULL,
  `work` text DEFAULT NULL,
  `highschool` text DEFAULT NULL,
  `college` varchar(50) DEFAULT NULL,
  `university` text DEFAULT NULL,
  `coverpic` text DEFAULT NULL,
  `user_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `hometown`, `country`, `shortBio`, `city`, `pfp`, `socialQuote`, `lifeEvent`, `religion`, `polViews`, `lang`, `professional`, `work`, `highschool`, `college`, `university`, `coverpic`, `user_id`) VALUES
(7, NULL, NULL, NULL, NULL, 'http://localhost/Friendora/uploads/profile_photos/profile_8_1756039507.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'http://localhost/Friendora/uploads/cover_photos/cover_8_1756039519.jpg', 8),
(8, 'Lunden', '', '', 'Lunden', 'http://localhost/Friendora/uploads/profile_photos/profile_9_1756039920.jpg', '', '', '', '', '', '', '', '', '', '', 'http://localhost/Friendora/uploads/cover_photos/cover_9_1756039983.jpg', 9),
(9, 'Linden', '', 'This the master wizard, if u encounter any drift in this magical world, notify me', 'Rudwell', 'http://localhost/Friendora/uploads/profile_photos/profile_10_1756040915.jpg', '', '', '', '', '', '', '', '', '', '', 'http://localhost/Friendora/uploads/cover_photos/cover_10_1756040926.jpg', 10);

-- --------------------------------------------------------

--
-- Table structure for table `reacts`
--

CREATE TABLE `reacts` (
  `id` int(11) NOT NULL,
  `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `reacted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `reacts`
--
DELIMITER $$
CREATE TRIGGER `after_react_insert` AFTER INSERT ON `reacts` FOR EACH ROW BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was reacted to
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who reacted.
    IF post_author_id != NEW.uid THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`)
        VALUES (post_author_id, NEW.uid, 'react', CONCAT('reacted with ', NEW.type, ' to your post'), NEW.post_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `shares`
--

CREATE TABLE `shares` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `shared_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `shares`
--
DELIMITER $$
CREATE TRIGGER `after_share_insert` AFTER INSERT ON `shares` FOR EACH ROW BEGIN
    DECLARE post_author_id INT;
    
    -- Find the author of the post that was shared
    SELECT `creator_id` INTO post_author_id FROM `post` WHERE `id` = NEW.post_id;
    
    -- Insert a notification for the post's author,
    -- but only if the author is not the one who shared.
    IF post_author_id != NEW.uid THEN
        INSERT INTO `notifications` (`user_id`, `action_by`, `type`, `content`, `related_post_id`)
        VALUES (post_author_id, NEW.uid, 'share','shared your post', NEW.post_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) NOT NULL,
  `user_id` int(10) DEFAULT NULL,
  `token` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `minit` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `pwd` varchar(100) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `minit`, `lname`, `pwd`, `DOB`, `gender`, `email`, `created_at`) VALUES
(8, 'Alaric', 'V', 'Drechsler', 'Drechsler_1997!Wolf', '1997-11-14', 'male', 'alaric.drechsler@reinhardt.ac', '2025-08-24 18:44:13'),
(9, 'Adrielle', 'V', 'Hohenburg', 'Hohenburg29*Moon', '1999-07-29', 'female', 'adrielle.hohenburg@lundenet.org', '2025-08-24 18:47:19'),
(10, 'Master', '', 'Wizard', 'Sakhiur@47', '2002-10-12', 'male', 'sakhiur2020@gmail.com', '2025-08-24 19:07:16');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `user_delete_log` BEFORE DELETE ON `users` FOR EACH ROW BEGIN
	INSERT INTO user_delete_log (fname,email) VALUES(OLD.fname,OLD.email);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `users_basic`
-- (See below for the actual view)
--
CREATE TABLE `users_basic` (
`user_id` int(11)
,`Full_Name` varchar(152)
,`profile_photo` text
,`age` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `user_delete_log`
--

CREATE TABLE `user_delete_log` (
  `log_id` int(5) NOT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `deleted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_delete_log`
--

INSERT INTO `user_delete_log` (`log_id`, `fname`, `email`, `deleted_at`) VALUES
(1, 'Alex', 'alex@gmail.com', '2025-07-27 20:14:28'),
(3, 'Kafka', 'kafka@gmail.com', '2025-08-24 18:28:43'),
(4, 'Ken', 'ken@gmail.com', '2025-08-24 18:28:43'),
(5, 'Raymond', 'raymond@gmail.com', '2025-08-24 18:28:43'),
(6, 'Sakhiur', 'sakhiur2020@gmail.com', '2025-08-24 18:28:43'),
(7, 'Ozaman', 'checker@gmail.com', '2025-08-24 18:28:43'),
(8, 'Nox', 'nox@gmail.com', '2025-08-24 18:28:43');

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_inbox`
-- (See below for the actual view)
--
CREATE TABLE `user_inbox` (
`receiver_id` int(11)
,`sender_id` int(11)
,`content` text
,`sent_at` datetime
,`status` enum('sent','delivered','read')
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_friendships_full`
-- (See below for the actual view)
--
CREATE TABLE `view_friendships_full` (
`user_id` int(11)
,`friend_id` int(11)
,`friend_name` varchar(152)
,`profile_pic` mediumtext
,`relationship_status` varchar(16)
,`since` datetime
,`mutual_friends` bigint(21)
,`total_friends` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_accepted_edges`
-- (See below for the actual view)
--
CREATE TABLE `vw_accepted_edges` (
`user_id` int(11)
,`friend_id` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `websites`
--

CREATE TABLE `websites` (
  `profile_id` int(3) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `posts_counter`
--
DROP TABLE IF EXISTS `posts_counter`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `posts_counter`  AS SELECT `post`.`id` AS `post_id`, count(distinct `comment`.`id`) AS `comment_count`, count(distinct case when `reacts`.`type` = 'like' then `reacts`.`id` end) AS `like_count`, count(distinct case when `reacts`.`type` = 'haha' then `reacts`.`id` end) AS `haha_count`, count(distinct case when `reacts`.`type` = 'angry' then `reacts`.`id` end) AS `angry_count`, count(distinct case when `reacts`.`type` = 'wow' then `reacts`.`id` end) AS `wow_count`, count(distinct `shares`.`id`) AS `share_count` FROM (((`post` left join `comment` on(`comment`.`post_id` = `post`.`id`)) left join `reacts` on(`reacts`.`post_id` = `post`.`id`)) left join `shares` on(`shares`.`post_id` = `post`.`id`)) GROUP BY `post`.`id` ;

-- --------------------------------------------------------

--
-- Structure for view `users_basic`
--
DROP TABLE IF EXISTS `users_basic`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `users_basic`  AS SELECT `users`.`id` AS `user_id`, concat_ws(' ',trim(`users`.`fname`),trim(coalesce(`users`.`minit`,'')),trim(`users`.`lname`)) AS `Full_Name`, `profile`.`pfp` AS `profile_photo`, timestampdiff(YEAR,`users`.`DOB`,curdate()) AS `age` FROM (`users` join `profile` on(`users`.`id` = `profile`.`user_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `user_inbox`
--
DROP TABLE IF EXISTS `user_inbox`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_inbox`  AS SELECT `m`.`receiver_id` AS `receiver_id`, `m`.`sender_id` AS `sender_id`, `m`.`content` AS `content`, `m`.`sent_at` AS `sent_at`, `m`.`status` AS `status` FROM `messages` AS `m` WHERE `m`.`sent_at` = (select max(`messages`.`sent_at`) from `messages` where `messages`.`sender_id` = `m`.`sender_id` AND `messages`.`receiver_id` = `m`.`receiver_id`) ;

-- --------------------------------------------------------

--
-- Structure for view `view_friendships_full`
--
DROP TABLE IF EXISTS `view_friendships_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_friendships_full`  AS SELECT `fr`.`sender_id` AS `user_id`, `fr`.`receiver_id` AS `friend_id`, concat(`u`.`fname`,' ',ifnull(`u`.`minit`,''),' ',`u`.`lname`) AS `friend_name`, `p`.`pfp` AS `profile_pic`, CASE WHEN `fr`.`status` = 'accepted' THEN 'friend' WHEN `fr`.`status` = 'pending' THEN 'pending_sent' END AS `relationship_status`, CASE WHEN `fr`.`status` = 'accepted' THEN `fr`.`responded_at` ELSE `fr`.`sent_at` END AS `since`, (select count(0) from (`friend_requests` `mf1` join `friend_requests` `mf2` on(`mf1`.`sender_id` = `mf2`.`sender_id` and `mf1`.`receiver_id` <> `fr`.`receiver_id` and `mf2`.`receiver_id` = `fr`.`receiver_id` or `mf1`.`receiver_id` = `mf2`.`receiver_id` and `mf1`.`sender_id` <> `fr`.`receiver_id` and `mf2`.`sender_id` = `fr`.`receiver_id`)) where `mf1`.`status` = 'accepted' and `mf2`.`status` = 'accepted' and (`mf1`.`sender_id` = `fr`.`sender_id` or `mf1`.`receiver_id` = `fr`.`sender_id`)) AS `mutual_friends`, (select count(0) from `friend_requests` `tf` where `tf`.`status` = 'accepted' and (`tf`.`sender_id` = `fr`.`receiver_id` or `tf`.`receiver_id` = `fr`.`receiver_id`)) AS `total_friends` FROM ((`friend_requests` `fr` join `users` `u` on(`u`.`id` = `fr`.`receiver_id`)) left join `profile` `p` on(`p`.`user_id` = `fr`.`receiver_id`))union select `fr`.`receiver_id` AS `user_id`,`fr`.`sender_id` AS `friend_id`,concat(`u`.`fname`,' ',ifnull(`u`.`minit`,''),' ',`u`.`lname`) AS `friend_name`,`p`.`pfp` AS `profile_pic`,case when `fr`.`status` = 'accepted' then 'friend' when `fr`.`status` = 'pending' then 'pending_received' end AS `relationship_status`,case when `fr`.`status` = 'accepted' then `fr`.`responded_at` else `fr`.`sent_at` end AS `since`,(select count(0) from (`friend_requests` `mf1` join `friend_requests` `mf2` on(`mf1`.`sender_id` = `mf2`.`sender_id` and `mf1`.`receiver_id` <> `fr`.`sender_id` and `mf2`.`receiver_id` = `fr`.`sender_id` or `mf1`.`receiver_id` = `mf2`.`receiver_id` and `mf1`.`sender_id` <> `fr`.`sender_id` and `mf2`.`sender_id` = `fr`.`sender_id`)) where `mf1`.`status` = 'accepted' and `mf2`.`status` = 'accepted' and (`mf1`.`sender_id` = `fr`.`receiver_id` or `mf1`.`receiver_id` = `fr`.`receiver_id`)) AS `mutual_friends`,(select count(0) from `friend_requests` `tf` where `tf`.`status` = 'accepted' and (`tf`.`sender_id` = `fr`.`sender_id` or `tf`.`receiver_id` = `fr`.`sender_id`)) AS `total_friends` from ((`friend_requests` `fr` join `users` `u` on(`u`.`id` = `fr`.`sender_id`)) left join `profile` `p` on(`p`.`user_id` = `fr`.`sender_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `vw_accepted_edges`
--
DROP TABLE IF EXISTS `vw_accepted_edges`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_accepted_edges`  AS SELECT `friend_requests`.`sender_id` AS `user_id`, `friend_requests`.`receiver_id` AS `friend_id` FROM `friend_requests` WHERE `friend_requests`.`status` = 'accepted'union all select `friend_requests`.`receiver_id` AS `user_id`,`friend_requests`.`sender_id` AS `friend_id` from `friend_requests` where `friend_requests`.`status` = 'accepted'  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `badge_desc_id` (`badge_desc_id`);

--
-- Indexes for table `badge_description`
--
ALTER TABLE `badge_description`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `block`
--
ALTER TABLE `block`
  ADD PRIMARY KEY (`blocker_id`,`blocked_id`),
  ADD KEY `blocked_id` (`blocked_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `earns`
--
ALTER TABLE `earns`
  ADD PRIMARY KEY (`uid`,`badge_id`),
  ADD KEY `badge_id` (`badge_id`);

--
-- Indexes for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`sender_id`,`receiver_id`),
  ADD KEY `fk_fr_receiver` (`receiver_id`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Indexes for table `joins`
--
ALTER TABLE `joins`
  ADD PRIMARY KEY (`uid`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_ibfk_1` (`post_id`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`user_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `mentions`
--
ALTER TABLE `mentions`
  ADD PRIMARY KEY (`mentioner_id`,`mentioned_id`),
  ADD KEY `mentioned_id` (`mentioned_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `messages_ibfk_1` (`sender_id`),
  ADD KEY `messages_ibfk_2` (`receiver_id`);

--
-- Indexes for table `messages_log`
--
ALTER TABLE `messages_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `action_by` (`action_by`),
  ADD KEY `notifications_ibfk_3` (`related_post_id`),
  ADD KEY `notifications_ibfk_4` (`related_comment_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`user_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_profile_user` (`user_id`);

--
-- Indexes for table `reacts`
--
ALTER TABLE `reacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reacts_ibfk_1` (`uid`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `shares`
--
ALTER TABLE `shares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `shares_ibfk_1` (`uid`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_delete_log`
--
ALTER TABLE `user_delete_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `websites`
--
ALTER TABLE `websites`
  ADD PRIMARY KEY (`profile_id`,`url`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `badge`
--
ALTER TABLE `badge`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `badge_description`
--
ALTER TABLE `badge_description`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `messages_log`
--
ALTER TABLE `messages_log`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reacts`
--
ALTER TABLE `reacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `shares`
--
ALTER TABLE `shares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_delete_log`
--
ALTER TABLE `user_delete_log`
  MODIFY `log_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `badge`
--
ALTER TABLE `badge`
  ADD CONSTRAINT `badge_ibfk_1` FOREIGN KEY (`badge_desc_id`) REFERENCES `badge_description` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `block`
--
ALTER TABLE `block`
  ADD CONSTRAINT `block_ibfk_1` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `block_ibfk_2` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `earns`
--
ALTER TABLE `earns`
  ADD CONSTRAINT `earns_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `earns_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badge` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `fk_fr_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_fr_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `group`
--
ALTER TABLE `group`
  ADD CONSTRAINT `group_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `joins`
--
ALTER TABLE `joins`
  ADD CONSTRAINT `joins_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `joins_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mentions`
--
ALTER TABLE `mentions`
  ADD CONSTRAINT `mentions_ibfk_1` FOREIGN KEY (`mentioner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mentions_ibfk_2` FOREIGN KEY (`mentioned_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`related_post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`related_comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reacts`
--
ALTER TABLE `reacts`
  ADD CONSTRAINT `reacts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reacts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shares`
--
ALTER TABLE `shares`
  ADD CONSTRAINT `shares_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shares_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `websites`
--
ALTER TABLE `websites`
  ADD CONSTRAINT `websites_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
