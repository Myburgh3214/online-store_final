//object -> callAFunction(object) -> returned object

function functionA() {

}

function functionB($inObject) {

}


function functionC() {
  return $outObject
}






































functionB($inObject);

$outObject = functionC();






function getContentOfFile($filename) {
  // do some other fancy logic
  // check file exists
  // modify file with stuff or whatever
  return file_get_contents($filename);
}






// file 1

$filename = 'file1.txt';
// do some other fancy logic
// check file exists
// modify file with stuff or whatever
echo file_get_contents($filename);


// file 2

$filename = 'file2.txt';
// do some other fancy logic
// check file exists
// modify file with stuff or whatever
echo file_get_contents($filename);











