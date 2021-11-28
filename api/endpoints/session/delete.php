<?php

if (!isset($API_HIT)) die;

$APP_SESSION->clearSession();
SendStatus(204);


//[GET] /api/session
// returns the current session / creates a new session

//[DELETE] /api/session
// deletes the session / and logs out the user - since the session no longer exists