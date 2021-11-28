<?php

if (!isset($API_HIT)) die;

SendData($APP_DATABASE->getAllResults("SELECT * FROM `products`"));