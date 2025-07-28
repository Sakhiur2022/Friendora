<?php
class  Post_counter
{
    use Model;

    protected $tableName = 'posts_counter';

    public $errors = [];

    protected $allowedColumns = [
        'post_id',
        'comment_count',
        'like_count',
        'haha_count',
        'angry_count',
        'wow_count',
        'share_count'
    ];

    public function getErrors()
    {
        return $this->errors;
    }

    public function createTable()
    {
        $sql = "
           CREATE OR REPLACE VIEW posts_counter AS
SELECT 
    post.id AS post_id,
    COUNT(DISTINCT comment.id) AS comment_count,
    COUNT(DISTINCT CASE WHEN reacts.type = 'like' THEN reacts.id END) AS like_count,
    COUNT(DISTINCT CASE WHEN reacts.type = 'haha' THEN reacts.id END) AS haha_count,
    COUNT(DISTINCT CASE WHEN reacts.type = 'angry' THEN reacts.id END) AS angry_count,
    COUNT(DISTINCT CASE WHEN reacts.type = 'wow' THEN reacts.id END) AS wow_count,
    COUNT(DISTINCT shares.id) AS share_count
FROM post
LEFT JOIN comment ON comment.post_id = post.id
LEFT JOIN reacts ON reacts.post_id = post.id
LEFT JOIN shares ON shares.post_id = post.id
GROUP BY post.id;

        ";
        $this->query($sql);
    }
}
