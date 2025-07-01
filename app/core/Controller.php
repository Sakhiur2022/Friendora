<?php

Trait Controller{
    public function loadView($view,$data = []){
        extract($data);      

        require_once "../app/views/$view.view.php";
    }
}