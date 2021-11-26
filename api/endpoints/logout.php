<?php

if (!isset($API_HIT)) die;

$APP_SESSION->clearSession();
SendStatus(204);