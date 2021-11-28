<?php

if (!isset($API_HIT)) die;

$postedData = GetJSONObjectFromRequest();

if (!$APP_SESSION->isLoggedIn())
  SendStatus(401);

$currentUser = $APP_SESSION->getUserKey();
if (isset($postedData['items']) && count($postedData['items']) > 0) {
  $workingTotal = 0;
  $createdOrderId = $APP_DATABASE->createOrder($currentUser);
  foreach ($postedData['items'] as $key => $orderItem) {
    $product = $APP_DATABASE->getFirstResult('SELECT * FROM products WHERE id = '.$orderItem['id'], false);
    $thisTotal = $product['price'] * $orderItem['qty'];
    $APP_DATABASE->addItemsToOrder($createdOrderId, $orderItem['id'], $orderItem['qty'], $product['price'], $thisTotal);
    $workingTotal = $workingTotal + $thisTotal;
  }
  $APP_DATABASE->finalizeOrder($createdOrderId, $workingTotal);
  
  $APP_SESSION->resetSession();
  SendStatus(201);
}

SendData('Invalid data sent', false);