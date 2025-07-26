<?php

class Profiles{
    use Model;

    protected $tableName = 'profile';

    public $errors = [];

    protected $allowedColumns = [
      'hometown',
      'shortBio',
       'city',
      'pfp',
      'socialQuote',
      'country',
      'professional',
      'lifeEvent',
      'religion',
        'polViews',
        'lang',
        'work',
        'highschool',
        'college',
        'university',
        'coverpic',
        'user_id',
    ];

   
    public function getErrors() {
        return $this->errors;
    }

    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS `profile` (
                `id` int(3) NOT NULL,
                `hometown` varchar(100) DEFAULT NULL,
                `Bio` text DEFAULT NULL,
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
                `university` text DEFAULT NULL,
                `coverpic` text DEFAULT NULL,
                `user_id` int(3) DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `fk_profile_user` (`user_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}