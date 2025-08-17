<?php

class Users_basic
{
    use Model;

    protected $tableName = 'users_basic';

    public function createTable()
    {
        $sql = "
           CREATE IF NOT EXISTS VIEW `users_basic` AS select `users`.`id` AS `user_id`,concat_ws(' ',trim(`users`.`fname`),trim(coalesce(`users`.`minit`,'')),trim(`users`.`lname`)) AS `Full_Name`,`profile`.`pfp` AS `profile_photo`,timestampdiff(YEAR,`users`.`DOB`,curdate()) AS `age` from (`users` join `profile` on(`users`.`id` = `profile`.`user_id`))

        ";
        $this->query($sql);
    }
}
