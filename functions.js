/**
 * グローバル変数
 */
var itemList;
var maxItemNum = 1;
var logArray;
var dblClicking = false;
var timeoutId;

/**
 * 定数
 */
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";
const LOG_FILE = "work_time_log.json";
const WRITE_BG_COLOR = "#58D3F7";
const DELETE_BG_COLOR = "#F6CEE3";
const WAIT_TIME = 300;

/**
 * ID を入れると DOM Element を返す
 */
var $ = id => {
  return document.querySelector("#"+id);
}

/**
 * クリック時の動作
 * 打刻する
 */
function timeStamp(label) {
  writeLog(label);
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

  let num = maxItemNum;
  
  // 画面に項目追加
  $("items").insertAdjacentHTML('afterbegin','<div id="item'+num+'" class="item"><input type="radio" name="kind" id="radio'+num+'"><label for="radio'+num+'" id="label'+num+'" class="label">'+label+'</label><label for="radio'+num+'" id="delete'+num+'" class="delete">✖︎</label></div>');

  // ラジオボタンイベントリスナの設定
  let radio_id = "radio" + num;
  let radio_ev = $(radio_id);
    
  // クリック時の動作
  radio_ev.addEventListener('click', () => {
    timeStamp(label);
  }, false);
  
  // 削除ラベルイベントリスナの設定
  let delete_ev = $("delete" + num);
    
  // クリック時の動作
  delete_ev.addEventListener('click', () => {
    deleteItem("item"+num,label);
  }, false);
  
  // 項目管理番号を1増やす。プログラムを実行するたびに
  // 項目管理番号は変わり、保存されない。
  maxItemNum++;
}

/**
 * 項目リストの項目削除
 * string id   DOM の ID
 * string label ラベル名
 */
function deleteItem(id, label) {
  let dom = $(id);
console.log(id,label);
  dom.parentNode.removeChild(dom);

  itemList.pop(label);
  localStorage.setItem(ITEM_LIST, JSON.stringify(itemList));
}

/**
 * ログソート
 * @return array ログを配列にして日時順でソートしたもの
 */
function sortLog() {
  let arrLogs = JSON.parse(localStorage.getItem(WORK_TIME_LOG));
  
  arrLogs.sort((a,b) => {
    if (a.time < b.time) return 1;
    else return -1;
  });
  
  //console.log(arrLogs);
  return arrLogs;
}

/**
 * ログ表示
 */
function displayLog(arrLogs) {
  let dom = $('log_table');
  
  dom.innerHTML = "";
  for (let idx in arrLogs) {
    dom.innerHTML += "<tr><td>" + arrLogs[idx].time + "</td><td>" + arrLogs[idx].kind + "</td></tr>";
  }
}

/**
 * 打刻
 * string label ラベル名
 */  
function writeLog(label) {
  let now = new Date();
  let data = {};
  let d = new Date();
  let dow = ["日","月","火","水","木","金","土"];
  
  data.time = d.getFullYear() + "/" + 
    ('00' + d.getMonth() + 1).substr(-2) + "/" + 
    ('00' + d.getDate()).substr(-2) + 
    dow[d.getDay()] + " " + 
    ('00' + d.getHours()).substr(-2) + ":" +
    ('00' + d.getMinutes()).substr(-2);
  data.kind = label; 
  logArray.push(data);
  localStorage.setItem(WORK_TIME_LOG, JSON.stringify(logArray));
  
  displayLog(sortLog());
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
  if (localStorage.getItem(ITEM_LIST) !== undefined &&
      localStorage.getItem(ITEM_LIST) !== null &&
      localStorage.getItem(ITEM_LIST) !== "") {
    itemList = JSON.parse(localStorage.getItem(ITEM_LIST));
    
    for (let i in itemList) { 
      if (itemList[i] != "" ) addItem(itemList[i]);
    }
  } else {
    itemList = new Array();
  }

  // ログがなければ空の配列を用意する
  if (localStorage.getItem(WORK_TIME_LOG) !== undefined &&
      localStorage.getItem(WORK_TIME_LOG) !== null &&
      localStorage.getItem(WORK_TIME_LOG) !== "") {
    logArray = JSON.parse(localStorage.getItem(WORK_TIME_LOG));    
  } else {
    logArray = new Array();
  }

  /**
   *「終業」項目にクリック時イベントのアクションを登録
    */
  let id = "radio0";
  let e = $(id);
  let label = $('label0').innerText;

  // クリック時の動作
  e.addEventListener('click', () => {
    timeStamp(label);
  }, false);
  
  displayLog(sortLog());
}
