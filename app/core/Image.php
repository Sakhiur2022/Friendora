<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Image{
    public function resize($filename, $maxWidth = 768) {
        //check what kind of image it is
        $type =  mime_content_type($filename);

        if(file_exists($filename)) {
            switch ($type) {
                case 'image/png':
                    $image = imagecreatefrompng($filename);
                    break;
                case 'image/jpeg':
                    $image = imagecreatefromjpeg($filename);
                    break;
                case 'image/gif':
                    $image = imagecreatefromgif($filename);
                    break;
                case 'image/webp':
                    $image = imagecreatefromwebp($filename);
                    break;  
                default:
                    return $filename;
            }
            $src_w = imagesx($image);
            $src_h = imagesy($image);

            if ($src_w > $src_h) {
                //reduce max size if image is smaller
                if ($src_w < $maxWidth) {
                    $maxWidth = $src_w;
                }

                $dst_w = $maxWidth;
                $dst_h = ($src_h / $src_w) * $maxWidth;
            }else{

                //reduce max size if image is smaller
                if ($src_h < $maxWidth) {
                    $maxWidth = $src_h;
                }
                $dst_h = $maxWidth;
                $dst_w = ($src_w / $src_h) * $maxWidth;
            }

            $dst_w = round($dst_w);
            $dst_h = round($dst_h);

            $dst_image = imagecreatetruecolor($dst_w, $dst_h);

            if($type === 'image/png') {
                imagealphablending($dst_image, false);
                imagesavealpha($dst_image, true);
            }
            imagecopyresampled($dst_image, $image, 0, 0, 0, 0, $dst_w, $dst_h, $src_w, $src_h);

            imagedestroy($image);

            switch ($type) {
                case 'image/png':
                    imagepng($dst_image, $filename,8);
                    break;
                case 'image/gif':
                    imagegif($dst_image, $filename);
                    break;
                case 'image/jpeg':
                    imagejpeg($dst_image, $filename, 90);
                    break;
                case 'image/webp':
                    imagewebp($dst_image, $filename, 90);
                    break;
                default:
                    imagejpeg($dst_image, $filename, 90);
            }
            imagedestroy($dst_image);
        }
        return $filename;
    }
}
