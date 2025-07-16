<?php

class User{
    use Model;

    protected $tableName = 'users';

    public $errors = [];

    protected $allowedColumns = [
       'name',
       'DOB',
       'email',
       'pwd'
    ];

    public function validate($data) {
        $this->errors = [];
        if (empty($data['name'])) {
            $this->errors['name'] = 'Name is required.';
        }
        if (empty($data['dob'])) {
            $this->errors['dob'] = 'Date of Birth is required.';
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
}