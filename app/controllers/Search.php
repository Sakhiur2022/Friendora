<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../debug_search.txt');

class Search {
  use Controller;

  public function index() {
    $data = [];
    $ses = new Session;
    $users_basic = new Users_basic;

    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    }

    $this->loadView("search");
  }

  public function find() {
    header('Content-Type: application/json');

    $searchTerm = $_GET['q'] ?? '';
    if (strlen($searchTerm) < 1) {
      echo json_encode([]);
      return;
    }

    $users_basic = new Users_basic;
    $results = $users_basic->search($searchTerm, 'Full_Name, user_id, profile_photo, age');

    echo json_encode($results);
  }
}