<?php

if (!isset($API_HIT)) die;

$postedData = GetJSONObjectFromRequest();

if (isset($postedData['email']) && isset($postedData['psw'])) {
  $foundUser = $APP_DATABASE->getUser($postedData["email"], $postedData["psw"]);

  if (!is_null($foundUser)) {
    $APP_SESSION->setSession($postedData['email']);
    SendStatus(202);
  }

  SendData('Invalid Credentials', false);
}


SendData('No credentials given', false);