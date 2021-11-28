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

  private function getConnection()
  {
    if (is_null($this->conn)) {
      $this->conn = new mysqli($this->hostname, $this->username, $this->password, $this->database); // Create connection
    }
    return $this->conn;
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
    return $this->getConnection()->query($sql);
  }

  public function getFirstResult(string $sql, bool $closeAfter = true)
  {
    $result = $this->query($sql);
    if ($result->num_rows > 0) {
      // output data of each row
      while ($row = $result->fetch_assoc()) {
        if ($closeAfter) {
          $this->close();
        }
        return $row;
      }
    }
    if ($closeAfter) {
      $this->close();
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
    $cname = mysqli_real_escape_string($this->getConnection(), $name);
    $cemail = mysqli_real_escape_string($this->getConnection(), $email);
    $cmessage = mysqli_real_escape_string($this->getConnection(), $message);
    $this->query("INSERT INTO contact_form (name, email, message) VALUES ('$cname', '$cemail', '$cmessage')");
    $this->close();
  }

  public function getUser(string $email, string $password)
  {
    $cemail = mysqli_real_escape_string($this->getConnection(), $email);
    $loginPassword = md5($password);
    $results = $this->getFirstResult("SELECT * FROM users WHERE email = '$cemail' AND password = '$loginPassword' ");
    return $results;
  }

  public function findUser(string $email)
  {
    $cemail = mysqli_real_escape_string($this->getConnection(), $email);
    $results = $this->getFirstResult("SELECT * FROM users WHERE email = '$cemail' ");
    return $results;
  }

  public function insertUser(string $email, string $password)
  {
    $cemail = mysqli_real_escape_string($this->getConnection(), $email);
    $secPassword = md5($password); /// turns password into hash
    // http://onlinemd5.com/ -> use this to generate md5
    $this->query("INSERT INTO users (email, password, role) VALUES ('$cemail', '$secPassword', 'member')");
    $this->close();
  }

  public function updateUser(string $email, string $password)
  {
    $cemail = mysqli_real_escape_string($this->getConnection(), $email);
    $secPassword = md5($password); /// turns password into hash
    // http://onlinemd5.com/ -> use this to generate md5
    $this->query("UPDATE users SET password = '$secPassword' WHERE email = '$cemail' ");
    $this->close();
  }

  public function createOrder(string $userId)
  {
    $cuserId = mysqli_real_escape_string($this->getConnection(), $userId);
    $this->query("INSERT INTO orders (user_id, total) VALUES ('$cuserId', 0)");
    return $this->conn->insert_id;
  }

  public function finalizeOrder(string $orderId, float $total)
  {
    $corderId = mysqli_real_escape_string($this->getConnection(), $orderId);
    $ctotal = mysqli_real_escape_string($this->getConnection(), $total);
    $this->query("UPDATE orders SET total = $ctotal WHERE orders.id = $corderId");
    $this->close();
  }

  public function addItemsToOrder(int $orderId, int $productId, int $qty, float $price, float $total)
  {
    $corderId = mysqli_real_escape_string($this->getConnection(), $orderId);
    $cproductId = mysqli_real_escape_string($this->getConnection(), $productId);
    $cqty = mysqli_real_escape_string($this->getConnection(), $qty);
    $cprice = mysqli_real_escape_string($this->getConnection(), $price);
    $ctotal = mysqli_real_escape_string($this->getConnection(), $total);
    $result = $this->query("INSERT INTO order_items (order_id, product_id, qty, price, total) VALUES ($corderId, $cproductId, $cqty, $cprice, $ctotal)");
    return $result;
  }
}
