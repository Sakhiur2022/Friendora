-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2025 at 04:19 PM
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
  `id` int(3) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `user_id` int(3) DEFAULT NULL,
  `post_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `content`, `created_at`, `user_id`, `post_id`) VALUES
(5, 'Yo, mama', '2025-07-26 22:47:45', 1, 4),
(6, 'Hi', '2025-07-27 00:17:11', 2, 21),
(8, 'kkkk', '2025-07-27 00:27:10', 1, 17),
(9, 'HI', '2025-07-27 01:50:19', 4, 23),
(10, 'Yo boy', '2025-07-27 02:04:38', 4, 19),
(11, 'How are you??', '2025-07-27 02:04:59', 4, 18),
(12, 'ho ho, long time no see mate', '2025-07-27 02:06:07', 3, 18),
(13, 'I\'m fine guys', '2025-07-27 02:06:50', 1, 18),
(14, 'Hi', '2025-07-27 02:24:41', 1, 10),
(15, 'Great', '2025-07-27 02:26:41', 1, 24),
(16, 'Hello', '2025-07-27 02:28:54', 4, 24),
(17, 'Hi my friend', '2025-07-27 02:30:17', 2, 24),
(18, 'What things??', '2025-07-27 18:16:36', 2, 27),
(19, 'ho ho', '2025-07-27 18:19:32', 1, 27),
(20, 'hello', '2025-07-27 19:39:57', 1, 28),
(21, 'Cool', '2025-07-27 19:41:13', 1, 23);

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
  `sender_id` int(10) NOT NULL,
  `receiver_id` int(10) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `responded_at` datetime NOT NULL,
  `status` enum('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `media_type` varchar(100) NOT NULL,
  `media_url` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `post_id`, `media_type`, `media_url`, `created_at`) VALUES
(1, 19, 'image', 'http://localhost/Friendora/uploads/posts/post_19_1753551302.jpeg', '2025-07-26 23:35:02'),
(3, 21, 'image', 'http://localhost/Friendora/uploads/posts/post_21_1753553754.jpeg', '2025-07-27 00:15:54'),
(5, 23, 'image', 'http://localhost/Friendora/uploads/posts/post_23_1753557000.jpeg', '2025-07-27 01:10:00'),
(6, 24, 'image', 'http://localhost/Friendora/uploads/posts/post_24_1753560486.jpeg', '2025-07-27 02:08:06');

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
  `sender_id` int(10) NOT NULL,
  `receiver_id` int(10) NOT NULL,
  `sent_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('seen','unseen') DEFAULT 'unseen',
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(3) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `type` varchar(50) DEFAULT NULL,
  `uid` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(3) NOT NULL,
  `url` text DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `user_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `url`, `caption`, `user_id`) VALUES
(1, 'uploads/covers/cover_1_1753523936.png', 'Cover photo', 1),
(2, 'uploads/covers/cover_1_1753524901.jpeg', 'Cover photo', 1),
(3, 'http://localhost/Friendora/uploads/cover_photos/cover_1_1753544566.png', 'Cover Photo', 1),
(4, 'http://localhost/Friendora/uploads/cover_photos/cover_1_1753544577.png', 'Cover Photo', 1),
(5, 'http://localhost/Friendora/uploads/profile_photos/profile_1_1753544817.jpg', 'Profile Picture', 1),
(6, 'http://localhost/Friendora/uploads/profile_photos/profile_2_1753545089.jpg', 'Profile Picture', 2),
(7, 'http://localhost/Friendora/uploads/cover_photos/cover_2_1753545108.jpeg', 'Cover Photo', 2),
(9, 'http://localhost/Friendora/uploads/posts/post_19_1753551302.jpeg', 'Post image', 1),
(13, 'http://localhost/Friendora/uploads/posts/post_21_1753553754.jpeg', 'Post image', 2),
(14, 'http://localhost/Friendora/uploads/cover_photos/cover_2_1753553856.jpeg', 'Cover Photo', 2),
(16, 'http://localhost/Friendora/uploads/cover_photos/cover_1_1753554824.jpeg', 'Cover Photo', 1),
(17, 'http://localhost/Friendora/uploads/profile_photos/profile_3_1753556449.jpeg', 'Profile Picture', 3),
(18, 'http://localhost/Friendora/uploads/cover_photos/cover_3_1753556465.jpeg', 'Cover Photo', 3),
(19, 'http://localhost/Friendora/uploads/profile_photos/profile_4_1753556732.jpeg', 'Profile Picture', 4),
(20, 'http://localhost/Friendora/uploads/cover_photos/cover_4_1753556740.jpeg', 'Cover Photo', 4),
(21, 'http://localhost/Friendora/uploads/posts/post_23_1753557000.jpeg', 'Post image', 4),
(22, 'http://localhost/Friendora/uploads/posts/post_24_1753560486.jpeg', 'Post image', 3),
(24, 'http://localhost/Friendora/uploads/profile_photos/profile_5_1753617079.jpeg', 'Profile Picture', 5),
(25, 'http://localhost/Friendora/uploads/cover_photos/cover_5_1753617164.jpeg', 'Cover Photo', 5);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(3) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `creator_id` int(3) DEFAULT NULL,
  `group_id` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `content`, `created_at`, `creator_id`, `group_id`) VALUES
(1, 'Hi, this  is sakhiur. Just finished watching one piece', '2025-07-26 15:37:29', 1, NULL),
(4, 'Hey guys', '2025-07-26 21:19:47', 1, NULL),
(8, 'Haha, it\'s so funny. Love it', '2025-07-26 21:40:12', 1, NULL),
(10, 'Hi guys', '2025-07-26 21:51:58', 2, NULL),
(12, 'Cyber world', '2025-07-26 21:54:00', 2, NULL),
(13, 'Cyber world', '2025-07-26 22:58:19', 1, NULL),
(14, 'Samurai', '2025-07-26 23:03:36', 1, NULL),
(15, 'Just another photo', '2025-07-26 23:15:08', 1, NULL),
(17, 'Hi', '2025-07-26 23:26:14', 1, NULL),
(18, 'Hello', '2025-07-26 23:32:47', 1, NULL),
(19, 'Night scenario', '2025-07-26 23:35:02', 1, NULL),
(21, 'Sunshine', '2025-07-27 00:15:54', 2, NULL),
(23, 'Hi guys, chilling on nature', '2025-07-27 01:10:00', 4, NULL),
(24, 'Enjoying sunlight', '2025-07-27 02:08:06', 3, NULL),
(26, 'Feeling great', '2025-07-27 18:02:32', 5, NULL),
(27, 'Checking things', '2025-07-27 18:04:07', 5, NULL),
(28, 'Hey guys', '2025-07-27 18:15:25', 2, NULL);

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
(1, 'Barishal', 'Bangladesh', 'Ok this is my bio, I love watching anime and reading webtoons', 'Dhaka', 'http://localhost/Friendora/uploads/profile_photos/profile_1_1753544817.jpg', 'In the digital realm, we are all architects of our own reality.', 'Graduated VR University (2018), Joined DreamScape Studios (2019), Won Cyber Art Award (2023)', 'Digital Spiritualism', 'Progressive Futurist', 'English, Japanese, Bangla', 'Cybertech', 'DreamScape Studios', 'Digital Arts Academy', 'Cyber Tech Institute', 'Virtual Reality University', 'http://localhost/Friendora/uploads/cover_photos/cover_1_1753554824.jpeg', 1),
(2, 'Nippon', '', 'Anime fan and webtoon reader', 'Jakarta', 'http://localhost/Friendora/uploads/profile_photos/profile_2_1753545089.jpg', '', '', '', '', '', '', '', '', '', '', 'http://localhost/Friendora/uploads/cover_photos/cover_2_1753553856.jpeg', 2),
(3, NULL, NULL, NULL, NULL, 'http://localhost/Friendora/uploads/profile_photos/profile_3_1753556449.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'http://localhost/Friendora/uploads/cover_photos/cover_3_1753556465.jpeg', 3),
(4, 'Dhaka', 'Bangladesh', 'A young soul trying to find peace', 'Dhaka', 'http://localhost/Friendora/uploads/profile_photos/profile_4_1753556732.jpeg', 'Discipline isn\'t built on comfort—it\'s forged in silence, when no one’s watching, and quitting whispers loudest.', 'Born, Taken dinner, Watched anime', 'Islam', 'Dr. Yunus all the way', 'English, Bangla', 'Sleeper', 'Home', 'Faizur Rahman', 'City College', 'North South University', 'http://localhost/Friendora/uploads/cover_photos/cover_4_1753556740.jpeg', 4),
(5, 'Corus', 'Arkland', 'Loves to drink', 'Tokyo', 'http://localhost/Friendora/uploads/profile_photos/profile_5_1753617079.jpeg', 'Do or Die', 'Born, live, first mission', 'Christianity', 'Hit', 'English', 'Hitman, Agent', 'Reinhafer', 'Porayan Cultural School', 'Edward College', 'Grandall', 'http://localhost/Friendora/uploads/cover_photos/cover_5_1753617164.jpeg', 5);

-- --------------------------------------------------------

--
-- Table structure for table `reacts`
--

CREATE TABLE `reacts` (
  `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `icon_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shares`
--

CREATE TABLE `shares` (
  `uid` int(3) NOT NULL,
  `post_id` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id` int(3) NOT NULL,
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
(1, 'Kafka', 'S', 'Rahman', 'HNkukc.t2n:RgD!', '1981-01-31', 'male', 'kafka@gmail.com', '2025-07-25 20:08:05'),
(2, 'Ken', 'G', 'Kaneki', 'HNkukc.t2n:RgD!', '1983-05-26', 'male', 'ken@gmail.com', '2025-07-26 21:50:51'),
(3, 'Raymond', 'T', 'Creed', 'HTUKDiii65%%%6', '1997-02-06', 'male', 'raymond@gmail.com', '2025-07-27 00:57:02'),
(4, 'Sakhiur', '', 'Rahman', 'HNkukc.t2n:RgD!', '2002-11-13', 'male', 'sakhiur2020@gmail.com', '2025-07-27 01:03:04'),
(5, 'Ozaman', 'Y', 'Taker', 'Checker@gmail.com56', '2009-05-17', 'male', 'checker@gmail.com', '2025-07-27 17:45:43');

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
`user_id` int(3)
,`Full_Name` varchar(152)
,`profile_photo` text
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
(1, 'Alex', 'alex@gmail.com', '2025-07-27 20:14:28');

-- --------------------------------------------------------

--
-- Table structure for table `websites`
--

CREATE TABLE `websites` (
  `profile_id` int(3) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `websites`
--

INSERT INTO `websites` (`profile_id`, `url`) VALUES
(1, 'https://alexandra-dreams.cyber, https://sakhiur.com'),
(4, 'www.kubernaticaina.com'),
(5, 'www.checker.com');

-- --------------------------------------------------------

--
-- Structure for view `users_basic`
--
DROP TABLE IF EXISTS `users_basic`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `users_basic`  AS SELECT `users`.`id` AS `user_id`, concat_ws(' ',trim(`users`.`fname`),trim(coalesce(`users`.`minit`,'')),trim(`users`.`lname`)) AS `Full_Name`, `profile`.`pfp` AS `profile_photo` FROM (`users` join `profile` on(`users`.`id` = `profile`.`user_id`)) ;

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
  ADD KEY `reciever_id` (`receiver_id`);

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
  ADD PRIMARY KEY (`sender_id`,`receiver_id`,`sent_at`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

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
  ADD PRIMARY KEY (`uid`,`post_id`);

--
-- Indexes for table `shares`
--
ALTER TABLE `shares`
  ADD PRIMARY KEY (`uid`,`post_id`),
  ADD KEY `post_id` (`post_id`);

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
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_delete_log`
--
ALTER TABLE `user_delete_log`
  MODIFY `log_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `reacts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
