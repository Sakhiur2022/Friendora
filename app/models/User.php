<?php

class User{
    use Model;

    protected $tableName = 'users';

    public $errors = [];

    protected $allowedColumns = [
      'fname',
      'minit',
       'lname',
      'email',
      'pwd',
      'DOB',
      'gender'

    ];

    public function validate($data) {
        $this->errors = [];
        // if(empty($data['name'])) {
        //     $this->errors['name'] = 'Name is required.';
        // }
        if (empty($data['fname'])) {
            $this->errors['fname'] = 'First Name is required.';
        }
        
        if (isset($data['minit']) && strlen($data['minit']) > 1) {
            $this->errors['minit'] = 'Middle initial must be a single character.';
        }
        
        if (empty($data['lname'])) {
            $this->errors['lname'] = 'Last name is required.';
        }
        if (empty($data['DOB'])) {
            $this->errors['DOB'] = 'Date of Birth is required.';
        }  
        if (empty($data['email'])) {
            $this->errors['email'] = 'Email is required.';
        }else if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email format.';
        }else if ($this->exists($data['email'], 'email')) {
            $this->errors['email'] = 'Email already exists.';
        }
        if (empty($data['pwd'])) {
            $this->errors['pwd'] = 'Password is required.';
        }else if (strlen($data['pwd']) < 6) {
            $this->errors['pwd'] = 'Password must be at least 6 characters.';
        }else if (!preg_match('/[A-Z]/', $data['pwd']) || !preg_match('/[a-z]/', $data['pwd']) || !preg_match('/[0-9]/', $data['pwd'])) {
            $this->errors['pwd'] = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
        } else if(empty($data['acceptTerms']) || $data['acceptTerms'] !== 'on') {
            $this->errors['acceptTerms'] = 'You must accept the terms and conditions.';
        }

        if (empty($this->errors)) {
            return true;
        }else{
            return false;
        }
    } 

    public function getErrors() {
        return $this->errors;
    }

    public function createTable() {
        $sql = "
            CREATE TABLE IF NOT EXISTS `users` (
                `id` int(10) NOT NULL AUTO_INCREMENT,
                `fname` varchar(50) NOT NULL,
                `minit` varchar(1) DEFAULT NULL,
                `lname` varchar(50) NOT NULL,
                `pwd` varchar(50) NOT NULL,
                `DOB` date NOT NULL,
                `gender` enum('male','female','non-binary','prefer not to say') NOT NULL DEFAULT 'prefer not to say',
                `email` varchar(50) NOT NULL,
                PRIMARY KEY (`id`),
                KEY `fname` (`fname`),
                KEY `minit` (`minit`),
                KEY `lname` (`lname`),
                KEY `DOB` (`DOB`),
                KEY `gender` (`gender`),
                KEY `email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}