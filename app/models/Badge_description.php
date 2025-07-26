<?php




class  Badge_description

{
    use Model;

    protected $tableName = 'badge_description';

    public $errors = [];

    protected $allowedColumns = [
        'profile_id',
        'badge_name',
        'description',
        'icon_url',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "CREATE TABLE IF NOT EXISTS `badge_description` (
  `Profile_id` int(3) NOT NULL,
  `Badge_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon_url` text DEFAULT NULL,
  PRIMARY KEY (`Profile_id`)
)
              CONSTRAINT `badge_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
