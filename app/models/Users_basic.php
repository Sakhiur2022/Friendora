<?php

class Users_basic
{
    use Model;

    protected $tableName = 'users_basic';
    public $errors = [];

    protected $allowedColumns = [
        'user_id',
        'Full_Name',
        'profile_photo',
        'age',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE VIEW IF NOT EXISTS users_basic AS
            SELECT 
                users.id AS user_id,
                CONCAT_WS(' ',
                    TRIM(users.fname),
                    TRIM(COALESCE(users.minit, '')),
                    TRIM(users.lname)
                ) AS Full_Name,
                profile.pfp AS profile_photo,
                TIMESTAMPDIFF(YEAR, users.dob, CURDATE()) AS age
            FROM users
            JOIN profile ON users.id = profile.user_id;
        ";
        $this->query($sql);
    }
}
