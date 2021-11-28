<?php

if (!isset($API_HIT)) die;

$postedData = GetJSONObjectFromRequest();

if (isset($postedData['name']) && isset($postedData['email']) && isset($postedData['message'])) {  
  $APP_DATABASE->insertContact($postedData['name'], $postedData['email'], $postedData['message']);

  SendStatus(201);
}

SendData('Invalid data sent', false);