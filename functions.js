var itemList;
var maxItemNum = 1;
var logArray;
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";
const LOG_FILE = "work_time_log.json";

var $ = id => {
  return document.querySelector("#"+id);
}

function clear(id) {
  console.log(id);
  $(id).style.backgroundColor = 'transparent';
}

function addItem(_name = undefined) {
  let name;
  if (_name === undefined) {
    name = $("input_box").value;
    
    itemList.push(name);
    
    localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
  } else {
    name = _name;
  }

  let id = "item" + maxItemNum;

  $("items").insertAdjacentHTML('afterbegin','<div id="item'+maxItemNum+'" class="item" >'+name+'</div>');

  let e = $("item"+maxItemNum);
  
  if (window.ontouchstart !== undefined) {
    e.addEventListener('touchstart', () => {
      if (event.targetTouches.length == 1) {
        itemTouchWrite(id, name);
      } else {
        itemTouchDelete(id, name);      
      }
    }, false);
    
  } else {
    e.addEventListener('click', name => {
      e.style.backgroundColor = "#faa";
      writeLog(name);
      setTimeout("clear("+id+")", 500);
    }, false);
    
    e.addEventListener('dbclick', () => {
      deleteItemClick(id, name);
    }, false);    
  }
  
  maxItemNum++;
}

function deleteItem(id, name) {
  let elem = $(id);
  
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
  elem.parentNode.removeChild($(id));

  itemList.pop(name);
  localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
}

function deleteItemClick(id, name) {
  deleteItem(id, name);
}

function itemTouchWrite(id, name) {
  $(id).style.backgroundColor = "#faa";
  writeLog(name);
  setTimeout("clear('"+id+"')", 500);
}

function itemTouchDelete(id, name) {
  deleteItem(id, name);
}
    
function writeLog(text) {
  let now = new Date();
  let data = {};
  data[now.toLocaleTimeString()] = text; 
  logArray.push(data);
  localStorage.setItem(WORK_TIME_LOG, JSON.stringify(logArray));
}

function saveLog() {
//  var href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(localStorage));
//  location.href = href;
  //ファイルを作ってダウンロードします。
  let resultJson = JSON.stringify(localStorage.getItem(WORK_TIME_LOG));
  let downLoadLink = document.createElement("a");
  downLoadLink.download = LOG_FILE;
  downLoadLink.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
  downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
  downLoadLink.click();
}

function init() {
  if (localStorage.getItem(ITEM_LIST) !== undefined) {
    itemList = JSON.parse(localStorage.getItem(ITEM_LIST));

    if (itemList === null) itemList = new Array();
    
    for (let i in itemList) { 
      if (itemList[i] != "" ) addItem(itemList[i]);
    }
  } else {
    itemList = new Array();
  }

  if (localStorage.getItem(WORK_TIME_LOG) !== undefined) {
    logArray = JSON.parse(localStorage.getItem(WORK_TIME_LOG));    

    if (logArray === null) logArray = new Array();
  } else {
    logArray = new Array();
  }

  let id = "item0";
  let e = $(id);
  if (window.ontouchstart !== undefined) {
    e.addEventListener('touchstart', () => {
      itemTouchWrite(id, name)
    }, false);
    
  } else {
    e.addEventListener('click', name => {
      e.style.backgroundColor = "#faa";
      writeLog(name);
      setTimeout("clear("+id+")", 500);
    }, false);
  }
}
