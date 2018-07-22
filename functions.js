/**
 * グローバル変数
 */
var itemList;
var maxItemNum = 1;
var logArray;

/**
 * 定数
 */
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";
const LOG_FILE = "work_time_log.json";
const WRITE_BG_COLOR = "#58D3F7";
const DELETE_BG_COLOR = "#F6CEE3";

/**
 * ID を入れると DOM Element を返す
 */
var $ = id => {
  return document.querySelector("#"+id);
}

/**
 * string id DOM の ID
 */
function clear(id) {
  console.log(id);
  $(id).style.backgroundColor = 'transparent';
}

/**
 * 項目の追加
 * string _label option ラベル（あれば優先）
 */
function addItem(_label = undefined) {
  // 引数がなければテキストボックスからラベルを取得
  let label;
  if (_label === undefined) {
    label = $("input_box").value;
    
    itemList.push(label);
    
    localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
  } else {
    label = _label;
  }

  // 画面に項目追加
  let id = "item" + maxItemNum;

  $("items").insertAdjacentHTML('afterbegin','<div id="'+id+'" class="item" >'+label+'</div>');

  // イベントリスナの設定
  let e = $(id);
  
  // ダブルクリック時の動作
  // 項目を削除する
  e.addEventListener('dblclick', () => {
    e.style.backgroundColor = DELETE_BG_COLOR;
    setTimeout("deleteItem('"+id+"','"+label+"')", 500);
  }, false);    

  // タッチ時の動作
  let flag = false;
  if (window.ontouchstart !== undefined) {
    e.addEventListener('touchstart', () => {
      flag = true;
      
      if (event.targetTouches.length > 1) {      
        // 2点以上同時タップの場合
        // 項目を削除する
        e.style.backgroundColor = DELETE_BG_COLOR;
        setTimeout("deleteItem('"+id+"','"+label+"')", 500);
      } else {
        // 1点タップの場合
        // 打刻する
        e.style.backgroundColor = WRITE_BG_COLOR;
        writeLog(label);
        setTimeout("clear('"+id+"')", 500);
      }
    }, false);
  } 
  
  // クリック時の動作
  // 打刻する。ただし、タッチ操作された時は無効  
  e.addEventListener('click', () => {
    if (!flag) {
      e.style.backgroundColor = WRITE_BG_COLOR;
      writeLog(label);
      setTimeout("clear('"+id+"')", 500);
    }
  }, false);
    
  // 項目管理番号を1増やす。プログラムを実行するたびに
  // 項目管理番号は変わり、保存されない。
  maxItemNum++;
}

/**
 * 項目リストの項目削除
 * string id   DOM の ID
 * string name ラベル名
 */
function deleteItem(id, name) {
  let elem = $(id);
  
  elem.parentNode.removeChild(elem);

  itemList.pop(name);
  localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
}

/**
 * 打刻
 * string text ラベル名
 */  
function writeLog(text) {
  let now = new Date();
  let data = {};
  
  data[now.toLocaleTimeString()] = text; 
  logArray.push(data);
  localStorage.setItem(WORK_TIME_LOG, JSON.stringify(logArray));
}

/**
 * ログファイルのダウンロード
 *
 * 同時にlocalStorage 内のログも削除します
 */
function saveLog() {
  //ファイルを作ってダウンロードします。
  let resultJson = JSON.stringify(localStorage.getItem(WORK_TIME_LOG));
  let downLoadLink = document.createElement("a");
  downLoadLink.download = LOG_FILE;
  downLoadLink.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
  downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
  downLoadLink.click();

  // ログの消去
  localStorage.setItem(WORK_TIME_LOG, "");
}

/**
 * 初期設定
 */
function init() {
  // 項目リストがなければ空の配列を用意する
  if (localStorage.getItem(ITEM_LIST) !== undefined) {
    itemList = JSON.parse(localStorage.getItem(ITEM_LIST));

    if (itemList === null) itemList = new Array();
    
    for (let i in itemList) { 
      if (itemList[i] != "" ) addItem(itemList[i]);
    }
  } else {
    itemList = new Array();
  }

  // ログがなければ空の配列を用意する
  if (localStorage.getItem(WORK_TIME_LOG) !== undefined) {
    logArray = JSON.parse(localStorage.getItem(WORK_TIME_LOG));    

    if (logArray === null) logArray = new Array();
  } else {
    logArray = new Array();
  }

  // 「終業」項目にクリック時イベントのアクションを登録
  let id = "item0";
  let e = $(id);
  let name = e.innerHTML;
  e.addEventListener('click', () => {
    e.style.backgroundColor = WRITE_BG_COLOR;
    writeLog(name);
    setTimeout("clear('"+id+"')", 500);
  }, false);
}
