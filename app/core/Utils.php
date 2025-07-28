<?php



class Utils{
    public static function show($stuff){
        echo "<pre>";
            print_r($stuff);
        echo "</pre>";
    }

    public static function redirect($url){
        header("Location:".ROOT."/".$url);
        exit();
    }

    public static function escape($string){
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }

    public static function get_pagination_vars():array{
        $vars = [];
        $vars['page'] = $_GET['page'] ?? 1;
        $vars['page'] = (int)$vars['page'];
        $vars['prev_page'] = $vars['page'] <= 1 ? 1 : $vars['page'] - 1;
        $vars['next_page'] = $vars['page'] + 1;
        return $vars;

    }

    public static function message(string $message,bool $clear = false){
        $session = new Session();
        if(!empty($message)){
            $session->set('message', $message);
        }else{
            if(!empty($session->get('message'))){
                $message = $session->get('message');
                if($clear){
                    $session->remove('message');
                }
                return $message;
            }
        }
        return false;
    }

    public static function getDate($date){
        return date('M j, Y', strtotime($date));
    }

  public static function add_root_to_images($contents)
  {
      preg_match_all('/<img[^>]+>/', $contents, $matches);
      if (is_array($matches) && count($matches) > 0) {
          foreach ($matches[0] as $match) {
              preg_match('/src="([^"]+)"/', $match, $matches2);
              if (isset($matches2[1]) && !strstr($matches2[1], 'http')) {
                  $new_src = 'src="' . ROOT . '/' . ltrim($matches2[1], '/');
                  $contents = str_replace('src="' . $matches2[1], $new_src, $contents);
              }
          }
      }
      return $contents;
  }

  
public static function remove_images_from_content($content, $folder = "uploads/")
{
    if(!file_exists($folder)){
        mkdir($folder, 0777, true);
        file_put_contents($folder. "index.php", "");
    }
    //remove images from content
    preg_match_all('/<img[^>]+>/', $content, $matches);
    $new_content = $content;
    if(is_array($matches) && count($matches) > 0) {
        if (class_exists('\Core\Image')) {
            $image_class = new Image();
        } else {
            $image_class = null;
        }
        foreach ($matches[0] as $match) {
            if(strstr($match, "http"))
            {
                continue; //ignore images with links already continue;
            }

            // get the src
            preg_match('/src="([^"]+)"/', $match, $matches2);

            // get the filename
            preg_match('/data-filename="([^"]+)"/', $match, $matches3);

            if (isset($matches2[1]) && strpos($matches2[1], 'data:') === 0) {
               $parts = explode(',', $matches2[1]);
               $basename = isset($matches3[1]) ? $matches3[1] : 'basename.jpg';
               $filename = $folder ."img_". $basename;
               $new_content = str_replace($matches2[1], $filename, $new_content);
               file_put_contents($filename, base64_decode($parts[1]));

               //resize the image
               if ($image_class) {
                   $image_class->resize($filename, 1000);
               }
            }
        }
    }
    return $new_content;
}


public static function delete_images_from_content(string $content, string $content_new =''):void{

    if(empty($content_new)){

        preg_match_all('/<img[^>]+>/', $content, $matches);
        if(is_array($matches) && count($matches) > 0) {
            foreach ($matches[0] as $match) {
                preg_match('/src="([^"]+)"/', $match, $matches2);
                $matches2[0] = str_replace('src="',"", $matches2[0]);

                if(file_exists($matches2[0])){
                    unlink($matches2[0]);
                }
            }
        }
    }else{
        preg_match_all('/<img[^>]+>/', $content, $matches);
        preg_match_all('/<img[^>]+>/', $content_new, $matches_new);

        $old_images = [];
        $new_images = [];

        //collect old images
        if(is_array($matches) && count($matches) > 0) {
            foreach ($matches[0] as $match) {
                preg_match('/src="([^"]+)"/', $match, $matches2);
                $matches2[0] = str_replace('src="', "", $matches2[0]);
                
                if(file_exists($matches2[0])){
                    $old_images[] = $matches2[0];
                }
            }
        }

        //collect new images
        if(is_array($matches_new) && count($matches_new) > 0) {
            foreach ($matches_new[0] as $match) {
                preg_match('/src="([^"]+)"/', $match, $matches2);
                $matches2[0] = str_replace('src="', "", $matches2[0]);
                if(file_exists($matches2[0])){
                    $new_images[] = $matches2[0];
                }
            }
        }

        //delete old images that are not in new images
        foreach ($old_images as $old_image) {
            if (!in_array($old_image, $new_images)) {
               if (file_exists($old_image)) {
                    unlink($old_image);
                }
            }
        }
    }
    
    
}

public static function URL($key){
     $url = explode("/",$_GET["url"] ?? "home");
      switch ($key) {
        case 'page':
        case 0:
            return $url[0] ?? null;
            break;
        case 'section':
        case 'slug':
        case 1:
            return $url[1] ?? null;
            break;
        case 'action':
        case 2:
            return $url[2] ?? null;
            break;
        case 'id':
        case 3:
            return $url[3] ?? null;
            break; 
        default:
            return null;    
               
      }
}

//get user from session
public static function user($key = ''){
    $session = new Session();
    $row = $session->user();
    if(isset($row->$key)){
        return $row ->$key;
    }
    return $row;
}

    public static function profileUrl($user_id = null) {
        if ($user_id === null) {
            return ROOT . '/profile';
        }
        return ROOT . '/profile/' . $user_id;
    }

}