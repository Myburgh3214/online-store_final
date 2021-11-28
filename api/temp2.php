$sqlTargets = "SELECT * FROM users WHERE email = '$email' AND password = '$loginPassword' ";
$result = $conn->query($sqlTargets);

// vs

function getAllResults($sql) {
  $result = $conn->query($sql);