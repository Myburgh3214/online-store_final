<?php

class DB {
  private string $hostname;
  private string $username;
  private string $password;
  private string $database;

  public function __construct(string $host, string $username, string $password, string $database)
  {
    $this->hostname = $host;
    $this->username = $username;
    $this->password = $password;
    $this->database = $database;
  }

  private function getDatabase()
  {
    return new mysqli($this->hostname, $this->username, $this->password, $this->database); // Create connection
  }

  private function query(string $sql) {
    $conn = NULL;
    try {
      $conn = $this->getDatabase();
      return $conn->query($sql);
    } finally {
      $conn->close();
    }
  }

  public function getFirstResult(string $sql) {
    $result = $this->query($sql);
    if ($result->num_rows > 0) {
      // output data of each row
      while ($row = $result->fetch_assoc()) {
        return $row;
      }
    }
    return NULL;
  }

  public function insertContact(string $name, string $email, string $message) {
    $this->query("INSERT INTO contact_form (name, email, message) VALUES ('$name', '$email', '$message')");
  }

  public function getUser(string $email, string $password) {
    $loginPassword = md5($password);
    return $this->getFirstResult("SELECT * FROM users WHERE email = '$email' AND password = '$loginPassword' ");
  }
  
  public function findUser(string $email) {
    return $this->getFirstResult("SELECT * FROM users WHERE email = '$email' ");
  }

  public function insertUser(string $email, string $password) {
    $secPassword = md5($password);/// turns password into hash
    // http://onlinemd5.com/ -> use this to generate md5
    $this->query("INSERT INTO users (email, password, role) VALUES ('$email', '$secPassword', 'member')");
  }
}
