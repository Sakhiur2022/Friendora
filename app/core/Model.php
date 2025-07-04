<?php

trait Model
{
    use Database;

    public function getAll($table) {
        $sql = "SELECT * FROM " . $table;
        return $this->query($sql);
    }

    public function getById($table, $id, $idColumn = 'id') {
        $sql = "SELECT * FROM " . $table . " WHERE " . $idColumn . " = :" . $idColumn;
        return $this->query($sql, [$idColumn => $id]);
    }

    public function insert($table, $data) {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $sql = "INSERT INTO " . $table . " ($columns) VALUES ($placeholders)";
        return $this->query($sql, $data);
    }

    public function update($table, $data, $id, $columnToUpdate = 'id') {
        $set = "";
        foreach ($data as $key => $value) {
            $set .= "$key = :$key, ";
        }
        $set = rtrim($set, ", ");
        $sql = "UPDATE " . $table . " SET $set WHERE $columnToUpdate = :$columnToUpdate";
        $data[$columnToUpdate] = $id;
        return $this->query($sql, $data);
    }
       

    public function delete($table, $id, $columnToDelete = 'id') {
        $sql = "DELETE FROM " . $table . " WHERE $columnToDelete = :$columnToDelete";
        return $this->query($sql, [$columnToDelete => $id]);
    }

    public function count($table) {
        $sql = "SELECT COUNT(*) as count FROM " . $table;
        $result = $this->query($sql);
        return $result ? $result[0]->count : 0;
    }

    public function exists($table, $id, $idColumn = 'id') {
        $sql = "SELECT COUNT(*) as count FROM " . $table . " WHERE " . $idColumn . " = :" . $idColumn;
        $result = $this->query($sql, [$idColumn => $id]);
        return $result ? $result[0]->count > 0 : false;
    }

    public function getLastInsertId() {
        return $this->getConnection()->lastInsertId();
    }


    public function where($table, $conditions) {
        $sql = "SELECT * FROM " . $table . " WHERE ";
        $clauses = [];
        $params = [];
        foreach ($conditions as $key => $value) {
            $clauses[] = "$key = :$key";
            $params[$key] = $value;
        }
        $sql .= implode(" AND ", $clauses);
        return $this->query($sql, $params);
    }
}