<?php




class  Group
{
    use Model;

    protected $tableName = 'group';

    public $errors = [];

    protected $allowedColumns = [
        'id',
        'name',
        'creator_id',
        
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
           
            CREATE TABLE IF NOT EXISTS `group` (
                `id` int(3) NOT NULL AUTO_INCREMENT,
                `name` varchar(100) NOT NULL,
                `creator_id` int(3) NOT NULL,
                PRIMARY KEY (`id`),
                CONSTRAINT `group_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

        ";
        $this->query($sql);
    }
}