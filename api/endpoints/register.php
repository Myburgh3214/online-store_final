<?php

if (!isset($API_HIT)) die;

if (isset($_POST['email']) && isset($_POST['psw'])) {
  $foundUser = $APP_DATABASE->findUser($_POST["email"]);

  if (!is_null($foundUser)) {
    SendData('User already exists', false);
  }

  $APP_DATABASE->insertUser($_POST["email"], $_POST['psw']);
  $APP_SESSION->setSession($_POST["email"]);
  SendStatus(201);
}

SendData('No credentials given', false);