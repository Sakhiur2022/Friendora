<?php

class _404{
    use Controller;
    public function index(){
       $this->loadView("404",["title" => "Page not found"]);
    }
}