<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

Trait Database {
    private $connection;   

   private function connect() {
    try {
        $dsn = DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME;
        $this->connection = new PDO($dsn, DB_USER, DB_PASS);
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Set MySQL session timezone to match PHP
        $this->connection->exec("SET time_zone = '+06:00'"); // Dhaka time

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
        $trimmed = strtolower(trim($sql));

        // For SELECT or CALL queries, return the results
        if (str_starts_with($trimmed, 'select') || str_starts_with($trimmed, 'call')) {
            $result = $statement->fetchAll(PDO::FETCH_OBJ);

            // Free any remaining result sets to avoid "Commands out of sync" errors
            while ($statement->nextRowset()) { /* skip */ }

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