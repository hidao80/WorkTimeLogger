var $ = id => {
  return document.querySelector(id);
}
var itemList;
var maxItemNum = 0;

function addItem(_name = undefined) {
  let name;
  if (_name === undefined) {
    name = $("#input_box").value;
    
    itemList.push(name);
    
    localStorage.setItem("itemList", JSON.stringify(itemList));
  } else {
    name = _name;
  }

  $("#items").insertAdjacentHTML('afterbegin','<div class="item" id="item'+maxItemNum+'" onclick=\'writeLog("'+name+'")\' ondbclick=\'deleteItem("item'+maxItemNum+'")\' ontouchstart=\'deleteItemTouch("item'+maxItemNum+'")\'>'+name+'</div>');

  maxItemNum++;
}

function deleteItem(id) {
  $('#items').removeChild($("#"+id));
}

function deleteItemTouch(id) {
  if (event.targetTouches.length > 1) {
    $('#items').removeChild($("#"+id));
  }
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

function init() {
  if (localStorage.getItem("itemList") !== undefined) {
    itemList = JSON.parse(localStorage.getItem("itemList"));
    
    for (let i in itemList) { 
  console.log(itemList[i]);
      if (itemList[i] != "" ) addItem(itemList[i]);
    }
  } else {
    itemList = new Array();
  }
    console.log(JSON.parse(localStorage.getItem("itemList")));
  console.log(itemList);
}
