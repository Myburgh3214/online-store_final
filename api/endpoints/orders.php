<?php

if (!isset($API_HIT)) die;

if (isset($_POST['backpack'])) {
  
  $APP_DATABASE->insertProduct($_POST['backpack']);

  SendStatus(201);
}
