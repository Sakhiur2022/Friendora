<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

Trait Database {
    private $connection;   

    private function connect() {
        try {
            $dsn = DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME;
            $this->connection = new PDO($dsn, DB_USER, DB_PASS);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->connection;
    }

    public function query($sql, $data = []) {
        if (!$this->connection) {
            $this->connect();
        }
        $statement = $this->connection->prepare($sql);
        $check = $statement->execute($data);
        
        if ($check) {
            // For SELECT queries, return the results
            if (stripos(trim($sql), 'SELECT') === 0) {
                $result = $statement->fetchAll(PDO::FETCH_OBJ);
                return is_array($result) && count($result) > 0 ? $result : [];
            } else {
                // For INSERT, UPDATE, DELETE queries, return true on success
                return true;
            }
        } else {
            return false;
        }
    }
}