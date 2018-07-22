var $ = (id) => {
  return document.querySelector(id);
}

function addItem() {
  let name = $("#input_box").value;
  $("#items").insertAdjacentHTML('beforeend','<div class=\'item\' onclick=\'writeLog("'+name+'")\'>'+name+'</div>');
}

function writeLog(text) {
  let now = new Date();
  localStorage.setItem(now.toLocaleTimeString(), text);
}

function saveLog() {
//  Object.keys(localStorage).forEach(function(key) { 
//    console.log(key);
//  });

  var href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(localStorage));
  location.href = href;
}
