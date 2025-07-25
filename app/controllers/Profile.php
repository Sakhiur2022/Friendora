<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../php_error.log');

class Profile {
  use Controller;

  public function index() {
    $data = [];
    $profileData = [];
    $ses = new Session;
    $request = new Request;
    $user = new User;
    $user_profile = new Profiles;
    $websites = new Websites;

    $user_profile->createTable();
    $websites->createTable();

    if (!$ses->is_loggedIn()) {
      Utils::redirect("login");
    }

    if ($request->isPosted() && $request->isAjax()) {
      header("Content-Type: application/json");

      $data = $request->post();
      $data['user_id'] = Utils::user('id');
      $gender = $data['gender'];
      $dob = $data['birthday'];
      $links = $data['website'] ?? [];
      $links = is_array($links) ? $links : [$links];

      $user->update(['gender' => $gender, 'dob' => $dob], $data['user_id'], 'id');

      if (!$user_profile->exists($data['user_id'], 'user_id')) {
        $user_profile->insert($data);
      } else {
        $user_profile->updateAll($data, $data['user_id'], 'user_id');
      }

      $result = $user_profile->first(['user_id' => $data['user_id']]);
      $data['profile_id'] = $result->id;

      // Insert each website individually
      if (!empty($links)) {
        foreach ($links as $websiteUrl) {
          $websiteUrl = trim($websiteUrl);
          if ($websiteUrl !== '') {
            $websites->insert([
              'profile_id' => $data['profile_id'],
              'url' => $websiteUrl
            ]);
          }
        }
      }

      // Remove old websites not in the new list
      $existingWebsites = $websites->where(['profile_id' => $data['profile_id']]);
      $existingUrls = array_column($existingWebsites ?? [], 'url');
      $websitesToRemove = array_diff($existingUrls, $links);

      if (!empty($websitesToRemove)) {
        foreach ($websitesToRemove as $urlToRemove) {
          $websites->deleteWhere([
            'profile_id' => $data['profile_id'],
            'url' => $urlToRemove
          ]);
        }
      }

      echo json_encode([
        'success'  => $result !== false,
        'message'  => $result !== false ? 'Profile updated successfully' : 'Failed to update profile',
        'user'     => $result,
        'fname'    => Utils::user('fname'),
        'lname'    => Utils::user('lname'),
        'gender'   => Utils::user('gender'),
        'birthday' => Utils::user('dob')
      ]);
      return; // ❗ prevents loading full HTML view
    }
    $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
    
    $this->loadView("profile", $profileData);
  }
}