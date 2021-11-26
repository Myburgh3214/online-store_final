const dataImg = "https://jsonplaceholder.typicode.com/photos/1";

 let test2 = fetch(dataImg, {
    method: 'GET'});
let test3 = test2.then(response => {
  return response.json();
}).then(data => {
  createImage(data.thumbnailUrl)
});
function createImage(url){
  let testImg = document.createElement('img');
  testImg.src = url;
  document.getElementById('mini-backpack').appendChild(testImg);

}
