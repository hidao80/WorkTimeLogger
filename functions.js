var $ = id => {
  return document.querySelector(id);
}
var itemList;
var maxItemNum = 0;
var logArray;
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";

function addItem(_name = undefined) {
  let name;
  if (_name === undefined) {
    name = $("#input_box").value;
    
    itemList.push(name);
    
    localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
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
  let data = {};
  data[now.toLocaleTimeString()] = text; 
  localStorage.setItem(WORK_TIME_LOG, data);
}

function saveLog() {
//  var href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(localStorage));
//  location.href = href;
  //ファイルを作ってダウンロードします。
  let resultJson = JSON.stringify(localStorage.getItem(WORK_TIME_LOG));
  let downLoadLink = document.createElement("a");
  downLoadLink.download = $scope.fileName;
  downLoadLink.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
  downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
  downLoadLink.click();
}

function init() {
  if (localStorage.getItem(ITEM_LIST) !== undefined) {
    itemList = JSON.parse(localStorage.getItem(ITEM_LIST));
    
    for (let i in itemList) { 
      if (itemList[i] != "" ) addItem(itemList[i]);
    }
  } else {
    itemList = new Array();
  }

  if (localStorage.getItem(WORK_TIME_LOG) !== undefined) {
    logArray = JSON.parse(localStorage.getItem(WORK_TIME_LOG));    
  } else {
    logArray = new Array();
  }
}
