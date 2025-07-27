<?php




class  Media
{
    use Model;

    protected $tableName = 'media';

    public $errors = [];

    protected $allowedColumns = [
        'post_id',
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
                `post_id` int(3) NOT NULL,
                `media_type` varchar(100) NOT NULL,
                `media_url` text NOT NULL,
                `created_at` datetime DEFAULT current_timestamp(),
                PRIMARY KEY (`id`),
                FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $this->query($sql);
    }
}
