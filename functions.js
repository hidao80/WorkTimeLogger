var $ = (id) => {
  return document.querySelector(id);
}

function add() {
  let name = $("#input_box").value;
  $("#items").insertAdjacentHTML('beforeend','<div class=\'item\' onclick=\'writeLog("'+name+'")\'>'+name+'</div>');
}

function writeLog(text) {
  let now = new Date();
  localStorage.setItem(now.toLocaleTimeString(), text);
}