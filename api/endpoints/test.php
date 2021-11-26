<?php

if (!isset($API_HIT)) die;

$helloCar = (object) array('hello' => 'world');
SendData($helloCar);
