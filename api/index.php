<?php

$API_HIT = true;

require_once('./lib/session.php');
require_once('./lib/cors.php');
require_once('./lib/db.php');

$APP_DATABASE = new DB("localhost", "root", "root", "koekieblom");
$APP_SESSION = new Session("email");

function SendData($dataToSend, $isJson = true)
{
  if ($isJson == true) {
    header('Content-Type: application/json');
    echo json_encode($dataToSend);
  } else {
    header('Content-Type: text-plain');
    echo $dataToSend;
  }
  die;
}

function SendStatus($statusCode)
{
  header('Content-Type: application/json');
  echo '{"response":"OK"}';
  http_response_code($statusCode);
  die;
}

function GetJSONObjectFromRequest() {
  return json_decode(file_get_contents('php://input'), true);
}

$funcFile = './endpoints/' . strtolower($_GET['_endpoint']) . '/' . strtolower($_SERVER['REQUEST_METHOD']) . '.php';
if (!file_exists($funcFile)) {
  http_response_code(404);
  die;
}

cors();
require_once($funcFile);
