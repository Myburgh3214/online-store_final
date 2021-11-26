<?php

if (!isset($API_HIT)) die;

if (isset($_POST['email']) && isset($_POST['psw'])) {
  $foundUser = $APP_DATABASE->getUser($_POST["email"], $_POST["psw"]);

  if (!is_null($foundUser)) {
    $APP_SESSION->setSession($email);
    SendStatus(202);
  }
}


SendData('No credentials given', false);