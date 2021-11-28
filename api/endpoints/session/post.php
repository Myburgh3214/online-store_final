<?php
// aka register

if (!isset($API_HIT)) die;

$postedData = GetJSONObjectFromRequest();

if (isset($postedData['email']) && isset($postedData['psw'])) {
  $foundUser = $APP_DATABASE->findUser($postedData["email"]);

  if (!is_null($foundUser)) {
    SendData('User already exists', false);
  }

  $APP_DATABASE->insertUser($postedData["email"], $postedData['psw']);
  $APP_SESSION->setSession($postedData["email"]);
  SendStatus(201);
}

SendData('No credentials given', false);