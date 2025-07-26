`<?php




class  Photos
{
    use Model;

    protected $tableName = 'photos';

    public $errors = [];

    protected $allowedColumns = [
        'photo_id',
        'url',
        'uploaded_at',
        'caption',
        'user_id',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `photos` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `url` text DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `user_id` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

        ";
        $this->query($sql);
    }
}

