<?php

if (!isset($API_HIT)) die;

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
  
  $APP_DATABASE->insertContact($_POST['name'], $_POST['email'], $_POST['message']);

  SendStatus(201);
}
