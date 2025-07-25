<?php

class Websites{
    use Model;

    protected $tableName = 'websites';

    public $errors = [];

    protected $allowedColumns = [
        'profile_id',
        'url',
    ];

    public function getErrors() {
        return $this->errors;
    }

    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS `websites` (
                `profile_id` int(3) NOT NULL,
                `url` varchar(200) NOT NULL,
                PRIMARY KEY (`profile_id`,`url`),
                CONSTRAINT `websites_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
