<?php

if (!isset($API_HIT)) die;

class Session {
  private string $_sessionEmailVar;

  public function __construct(string $emailVar)
  {
    $this->_sessionEmailVar = $emailVar;
    session_start();
  }

  public function getSession() {
    return array(
      'session' => session_id(),
      'email' => $_SESSION[$this->_sessionEmailVar] // null if user is not logged in
    );
  }

  public function clearSession() {
    session_unset(); 
    session_destroy();
  }

  public function setSession($email) {
    $_SESSION[$this->_sessionEmailVar] = $email;
  }
}