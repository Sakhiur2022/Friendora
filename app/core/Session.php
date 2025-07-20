<?php
defined('ROOT_PATH') OR exit('Access denied you hacker!');

class Session
{
    public $mainKey = 'APP';
    public $userKey = 'USER';

    private function startSession()
    {
         if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.use_only_cookies', 1);
            ini_set('session.use_strict_mode', 1);

            session_set_cookie_params([
                'lifetime' => 1800, // 30 minutes
                'domain'   => 'localhost',
                'path'     => '/',
                'secure'   => true,
                'httponly' => true
            ]);

            session_start();

            if (!isset($_SESSION['last_regeneration'])) {
                session_regenerate_id(true);
                $_SESSION['last_regeneration'] = time();
            } else {
                $interval = 60 * 30; // 30 minutes
                if (time() - $_SESSION['last_regeneration'] > $interval) {
                    session_regenerate_id(true);
                    $_SESSION['last_regeneration'] = time();
                }
            }
        }
        return true;
    }

    public function set($keyOrArray, $value = ''){
        $this->startSession();
        if (is_array($keyOrArray)) {
            foreach ($keyOrArray as $key => $value) {
                $_SESSION[$this->mainKey][$key] = $value;
            }
            return 1;
        } else {
            $_SESSION[$this->mainKey][$keyOrArray] = $value;
            return 1;
        }
    }

    public function get($key, $default = ''){
        $this->startSession();
        if (isset($_SESSION[$this->mainKey][$key])) {
            return $_SESSION[$this->mainKey][$key];
        }
        return $default;
    }

    public function auth($user_row){
        $this->startSession();
        $_SESSION[$this->userKey] = $user_row;
        return true;
    }

    public function logout(){
        $this->startSession();
       if (isset($_SESSION[$this->userKey])) {
            unset($_SESSION[$this->userKey]);
        }
        return 0;
    }

    public function is_loggedIn(){
        $this->startSession();
        return !empty($_SESSION[$this->userKey]);
    }

    //gets data from a column in the session user data
    public function user($key = '', $default = ''){
        $this->startSession();
        if(empty($key) && !empty($_SESSION[$this->userKey])){
            return $_SESSION[$this->userKey];
        }else 
        if(!empty($_SESSION[$this->userKey]->$key)){
            return $_SESSION[$this->userKey]->$key;
        }
        return $default;
    }

    //returns data from a key and deletes it from the session
    public function pop($key, $default = ''){
        $this->startSession();
        if (isset($_SESSION[$this->mainKey][$key])) {
            $value = $_SESSION[$this->mainKey][$key];
            unset($_SESSION[$this->mainKey][$key]);
            return $value;
        }
        return $default;
    }

    //returns all data from the app array
    public function all(){
        $this->startSession();
        return isset($_SESSION[$this->mainKey]) ? $_SESSION[$this->mainKey] : [];
    }

    public function remove($key){
        $this->startSession();
        if (isset($_SESSION[$this->mainKey][$key])) {
            unset($_SESSION[$this->mainKey][$key]);
            return true;
        }
        return false;   
    }

}
