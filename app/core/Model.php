<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');
trait Model
{
    use Database;

    protected $limit = 10;
    protected $offset = 0;

    public function getAll() {
        $sql = "SELECT * FROM " . $this->tableName;
        return $this->query($sql);
    }

    public function getById($id, $idColumn = 'id') {
        $sql = "SELECT * FROM " . $this->tableName . " WHERE " . $idColumn . " = :" . $idColumn;
        return $this->query($sql, [$idColumn => $id]);
    }

    public function insert($data) {
        // Ensure only allowed columns are inserted
        if(!empty($this->allowedColumns)) {
           foreach ($data as $key => $value) {
                if (!in_array($key, $this->allowedColumns)) {
                    unset($data[$key]);
                }
            }
        }
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $sql = "INSERT INTO " . $this->tableName . " ($columns) VALUES ($placeholders)";
        return $this->query($sql, $data);
    }

    public function update($data, $id, $columnToUpdate = 'id') {
        // Ensure only allowed columns are inserted
        if(!empty($this->allowedColumns)) {
           foreach ($data as $key => $value) {
                if (!in_array($key, $this->allowedColumns)) {
                    unset($data[$key]);
                }
            }
        }
        $set = "";
        foreach (array_keys($data) as $key) {
            $set .= "$key = :$key, ";
        }
        $set = rtrim($set, ", ");
        $sql = "UPDATE " . $this->tableName . " SET $set WHERE $columnToUpdate = :$columnToUpdate";
        $data[$columnToUpdate] = $id;
        return $this->query($sql, $data);
    }

    public function updateAll($data, $id, $idColumn = 'id') {
        if (!empty($this->allowedColumns)) {
            foreach ($data as $key => $value) {
                if (!in_array($key, $this->allowedColumns)) {
                    unset($data[$key]);
                }
            }
        }
        $set = "";
        foreach (array_keys($data) as $key) {
            $set .= "$key = :$key, ";
        }
        $set = rtrim($set, ", ");
        $sql = "UPDATE " . $this->tableName . " SET $set WHERE $idColumn = :$idColumn";
        $data[$idColumn] = $id;
        return $this->query($sql, $data);
    }

    public function delete($id, $columnToDelete = 'id') {
        $sql = "DELETE FROM " . $this->tableName . " WHERE $columnToDelete = :$columnToDelete";
        return $this->query($sql, [$columnToDelete => $id]);
    }

// Example usage:
// $mediaModel->delete($postId, 'post_id');
// This will generate SQL:
// DELETE FROM media WHERE post_id = :post_id
// Example usage:
// $model->deleteWhere(['status' => 'inactive', 'role' => ['admin', 'editor']]);
// This will generate SQL:
// DELETE FROM tableName WHERE status = :status AND role IN (:role_0,:role_1)

public function deleteWhere($conditions) {
    $sql = "DELETE FROM " . $this->tableName . " WHERE ";
    $clauses = [];
    $params = [];

    foreach ($conditions as $key => $value) {
        if (is_array($value)) {
            // Use IN clause for arrays
            $inParams = [];
            foreach ($value as $i => $v) {
                $paramKey = $key . '_' . $i;
                $inParams[] = ':' . $paramKey;
                $params[$paramKey] = $v;
            }
            $clauses[] = "$key IN (" . implode(',', $inParams) . ")";
        } else {
            $clauses[] = "$key = :$key";
            $params[$key] = $value;
        }
    }

    $sql .= implode(" AND ", $clauses);
    return $this->query($sql, $params);
}

    public function count() {
        $sql = "SELECT COUNT(*) as count FROM " . $this->tableName;
        $result = $this->query($sql);
        return $result ? $result[0]->count : 0;
    }

    public function exists($id, $idColumn = 'id') {
        $sql = "SELECT COUNT(*) as count FROM " . $this->tableName . " WHERE " . $idColumn . " = :" . $idColumn;
        $result = $this->query($sql, [$idColumn => $id]);
        return $result ? $result[0]->count > 0 : false;
    }

    public function getLastInsertId() {
        return $this->getConnection()->lastInsertId();
    }

    public function getDistinct($column) {
        $sql = "SELECT DISTINCT $column FROM " . $this->tableName;
        return $this->query($sql);
    }

    // Allows custom operators in where conditions, e.g. ['city <>' => 'Dhaka']
    public function whereWithOperator($conditions) {
        $sql = "SELECT * FROM " . $this->tableName . " WHERE ";
        $clauses = [];
        $params = [];
        foreach ($conditions as $key => $value) {
            if (preg_match('/^(.+)\s*(=|<>|!=|<|>|<=|>=|LIKE)$/i', $key, $matches)) {
                $column = trim($matches[1]);
                $operator = strtoupper(trim($matches[2]));
                $paramKey = preg_replace('/\W/', '_', $column . '_' . uniqid());
                $clauses[] = "$column $operator :$paramKey";
                $params[$paramKey] = $value;
            } else {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
        }
        $sql .= implode(" AND ", $clauses);
        return $this->query($sql, $params);
    }

    public function whereCondition($conditions) {
        $sql = "SELECT * FROM " . $this->tableName . " WHERE ";
        $clauses = [];
        $params = [];
        foreach ($conditions as $key => $value) {
            $clauses[] = "$key = :$key";
            $params[$key] = $value;
        }
        $sql .= implode(" AND ", $clauses);
        return $this->query($sql, $params);
    }

    public function where($data,$data_not=[]){
        $keys = array_keys($data);
        $keys_not = array_keys($data_not);
        $sql = "SELECT * FROM " . $this->tableName . " WHERE ";

        foreach ($keys as $key) {
            $sql .= "$key = :$key AND ";
        }
        foreach ($keys_not as $key) {
            $sql .= "$key <> :$key AND ";
        }
        $sql = rtrim($sql, ' AND ');
        $sql .= " LIMIT $this->limit OFFSET $this->offset";
        $data = array_merge($data, $data_not);
        return $this->query($sql, $data);
    }

     public function first($data,$data_not=[]){
        $keys = array_keys($data);
        $keys_not = array_keys($data_not);
        $sql = "SELECT * FROM " . $this->tableName . " WHERE ";

        foreach ($keys as $key) {
            $sql .= "$key = :$key AND ";
        }
        foreach ($keys_not as $key) {
            $sql .= "$key <> :$key AND ";
        }
        $sql = rtrim($sql, ' AND ');
        $sql .= " LIMIT $this->limit OFFSET $this->offset";
        $data = array_merge($data, $data_not);
        $result = $this->query($sql, $data);
        if (is_array($result) && count($result) > 0) {
            return $result[0]; // Return the first result
        }
        return false; // Return false if no results found
    }

    public function getColumnNames() {
        $sql = "SHOW COLUMNS FROM " . $this->tableName;
        $result = $this->query($sql);
        return array_map(function($col) {
            return $col->Field;
        }, $result);
    }

    public function getTableNames() {
        $sql = "SHOW TABLES";
        $result = $this->query($sql);
        return array_map(function($table) {
            return array_values((array)$table)[0];
        }, $result);
    }

    public function join($joins = [], $conditions = [], $columns = '*') {
        $sql = "SELECT $columns FROM " . $this->tableName;
        foreach ($joins as $join) {
            // $join = ['type' => 'INNER', 'table' => 'other_table', 'on' => 'table.id = other_table.fk_id']
            $type = isset($join['type']) ? strtoupper($join['type']) : 'INNER';
            $sql .= " $type JOIN {$join['table']} ON {$join['on']}";
        }
        if (!empty($conditions)) {
            $clauses = [];
            $params = [];
            foreach ($conditions as $key => $value) {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
            return $this->query($sql, $params);
        }
        return $this->query($sql);
    }

    public function groupBy($groupBy, $columns = '*', $conditions = []) {
        $sql = "SELECT $columns FROM " . $this->tableName;
        $params = [];
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $key => $value) {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
        }
        $sql .= " GROUP BY $groupBy";
        return $this->query($sql, $params);
    }

    public function having($groupBy, $having, $columns = '*', $conditions = []) {
        $sql = "SELECT $columns FROM " . $this->tableName;
        $params = [];
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $key => $value) {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
        }
        $sql .= " GROUP BY $groupBy HAVING $having";
        return $this->query($sql, $params);
    }

    public function orderBy($orderBy, $columns = '*', $conditions = []) {
        $sql = "SELECT $columns FROM " . $this->tableName;
        $params = [];
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $key => $value) {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
        }
        $sql .= " ORDER BY $orderBy";
        return $this->query($sql, $params);
    }

    public function limit($limit, $offset = 0, $columns = '*', $conditions = []) {
        $sql = "SELECT $columns FROM " . $this->tableName;
        $params = [];
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $key => $value) {
                $clauses[] = "$key = :$key";
                $params[$key] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
        }
        $sql .= " LIMIT :offset, :limit";
        $params['offset'] = (int)$offset;
        $params['limit'] = (int)$limit;
        return $this->query($sql, $params);
    }

    public function selectComplex($options = []) {
        // $options = [
        //   'columns' => '*',
        //   'joins' => [],
        //   'conditions' => [],
        //   'groupBy' => '',
        //   'having' => '',
        //   'orderBy' => '',
        //   'limit' => null,
        //   'offset' => 0
        // ]
        $columns = isset($options['columns']) ? $options['columns'] : '*';
        $sql = "SELECT $columns FROM " . $this->tableName;
        $params = [];

        // Joins
        if (!empty($options['joins'])) {
            foreach ($options['joins'] as $join) {
                $type = isset($join['type']) ? strtoupper($join['type']) : 'INNER';
                $sql .= " $type JOIN {$join['table']} ON {$join['on']}";
            }
        }

        // Where
        if (!empty($options['conditions'])) {
            $clauses = [];
            foreach ($options['conditions'] as $key => $value) {
                $paramKey = preg_replace('/\W/', '_', $key);
                $clauses[] = "$key = :$paramKey";
                $params[$paramKey] = $value;
            }
            $sql .= " WHERE " . implode(" AND ", $clauses);
        }

        // Group By
        if (!empty($options['groupBy'])) {
            $sql .= " GROUP BY {$options['groupBy']}";
        }

        // Having
        if (!empty($options['having'])) {
            $sql .= " HAVING {$options['having']}";
        }

        // Order By
        if (!empty($options['orderBy'])) {
            $sql .= " ORDER BY {$options['orderBy']}";
        }

        // Limit & Offset
       if (isset($options['limit'])) {
    $offset = isset($options['offset']) ? (int)$options['offset'] : 0;
    $limit = (int)$options['limit'];
    $sql .= " LIMIT $offset, $limit";
}

        return $this->query($sql, $params);
    }
    /**
     * Searches the database table for rows matching the given search term.
     *
     * @param string $searchTerm The term to search for in the specified columns.
     * @param string $columns A comma-separated string of column names to search in. Defaults to '*'.
     *                        If '*', all columns will be searched.
     * @return array|false The result set as an array of rows, or false on failure.
     *
     * Example SQL Output:
     * If $searchTerm = 'John' and $columns = 'name,email':
     * The generated SQL would be:
     * SELECT name, email FROM tableName WHERE name LIKE :name OR email LIKE :email
     * With bound parameters:
     * :name => '%John%'
     * :email => '%John%'
     */
    public function search($searchTerm, $columns = '*') {
        // Assuming $columns is a string of comma-separated column names
        $columns = empty($columns) ? '*' : $columns;
        $sql = "SELECT $columns FROM " . $this->tableName . " WHERE ";
        $clauses = [];
        $params = [];
        foreach (explode(',', $columns) as $column) {
            $paramKey = preg_replace('/\W/', '_', trim($column));
            $clauses[] = "$column LIKE :$paramKey";
            $params[$paramKey] = '%' . $searchTerm . '%';
        }
        $sql .= implode(" OR ", $clauses);
        return $this->query($sql, $params);
    }
}

