<?php
// aka reset password

if (!isset($API_HIT)) die;

$postedData = GetJSONObjectFromRequest();

if (isset($postedData['email']) && isset($postedData['psw'])) {
  $foundUser = $APP_DATABASE->findUser($postedData["email"]);

  if (is_null($foundUser)) {
    SendData('User does not exist', false);
  }

  $APP_DATABASE->updateUser($postedData["email"], $postedData['psw']);
  $APP_SESSION->setSession($postedData["email"]);
  SendStatus(202);
}

SendData('No credentials given', false);