<?php

class DB
{
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

  private $conn = NULL;
  private function close()
  {
    if (!is_null($this->conn)) {
      $this->conn->close();
      $this->conn = NULL;
    }
  }
  private function query(string $sql)
  {
    if (is_null($this->conn)) {
      $conn = $this->getDatabase();
    }
    return $conn->query($sql);
  }

  public function getFirstResult(string $sql)
  {
    $result = $this->query($sql);
    if ($result->num_rows > 0) {
      // output data of each row
      while ($row = $result->fetch_assoc()) {
        $this->close();
        return $row;
      }
    }
    return NULL;
  }

  public function getAllResults(string $sql)
  {
    $result = $this->query($sql);
    $rows = array();
    if ($result->num_rows > 0) {
      // output data of each row
      while ($row = $result->fetch_assoc()) {
        array_push($rows, $row);
      }
    }
    $this->close();
    return $rows;
  }

  public function insertContact(string $name, string $email, string $message)
  {
    $this->query("INSERT INTO contact_form (name, email, message) VALUES ('$name', '$email', '$message')");
    $this->close();
  }

  public function getUser(string $email, string $password)
  {
    $loginPassword = md5($password);
    $results = $this->getFirstResult("SELECT * FROM users WHERE email = '$email' AND password = '$loginPassword' ");
    $this->close();
    return $results;
  }

  public function findUser(string $email)
  {
    $results = $this->getFirstResult("SELECT * FROM users WHERE email = '$email' ");
    $this->close();
    return $results;
  }

  public function insertUser(string $email, string $password)
  {
    $secPassword = md5($password); /// turns password into hash
    // http://onlinemd5.com/ -> use this to generate md5
    $this->query("INSERT INTO users (email, password, role) VALUES ('$email', '$secPassword', 'member')");
    $this->close();
  }
}
