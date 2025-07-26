<?php




class  Media
{
    use Model;

    protected $tableName = 'media';

    public $errors = [];

    protected $allowedColumns = [
        'post_id',
        'profile_id',
        'media_type',
        'media_url',
        'created_at',
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `media` (
                `id` int(3) NOT NULL AUTO_INCREMENT,
                `profile_id` int(3) NOT NULL,
                `media_type` varchar(100) NOT NULL,
                `media_url` text NOT NULL,
                `created_at` datetime DEFAULT current_timestamp(),
                PRIMARY KEY (`post_id`),
                CONSTRAINT `media_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
