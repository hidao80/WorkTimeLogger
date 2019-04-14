/**
 * グローバル変数
 */
var arrItem;
var arrLog;
var maxItemNum = 1;

/**
 * 定数
 */
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";
const LOG_FILE = "work_time_log.json";
const WRITE_BG_COLOR = "#58D3F7";

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
function addItem(label = undefined) {
  // 引数がなければテキストボックスからラベルを取得
  let _label;
  if (label === undefined) {
    // テキストボックスから追加
    _label = $("input_box").value;
    
    // 重複する項目は登録させない
    for (let i in arrItem) {
      if (arrItem[i] == _label) return; 
    }
    
    arrItem.push(_label);
    
    localStorage.setItem(ITEM_LIST, JSON.stringify(arrItem));
  } else {
    // localStorage から読み込み
    _label = label;
  }

  const num = maxItemNum;
  
  // 画面に項目追加
  $("items").insertAdjacentHTML('afterbegin','<div id="item'+num+'" class="item"><input type="radio" name="kind" id="radio'+num+'"><label for="radio'+num+'" id="label'+num+'" class="label">'+_label+'</label><label for="radio'+num+'" id="delete'+num+'" class="delete">✖︎</label></div>');

  // ラジオボタンイベントリスナの設定
  const radio_id = "radio" + num;
  const radio_ev = $(radio_id);
    
  // クリック時の動作
  radio_ev.addEventListener('click', () => {
    timeStamp(label);
  }, false);
  
  // 削除ラベルイベントリスナの設定
  const delete_ev = $("delete" + num);
    
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
  const dom = $(id);
  dom.parentNode.removeChild(dom);

  arrItem.pop(label);
  localStorage.setItem(ITEM_LIST, JSON.stringify(arrItem));
}

/**
 * ログソート
 * 同じ時刻のものは入れ替わる可能性がある
 * @return array ログを配列にして日時順でソートしたもの
 */
function sortLog() {
  const arrLogs = JSON.parse(localStorage.getItem(WORK_TIME_LOG));
  
  arrLogs.sort((a,b) => {
    if (a.time < b.time) return 1;
    else return -1;
  });
  
  return arrLogs;
}

/**
 * ログ表示
 */
function displayLog(arrLogs) {
  const dom = $('log_table');
  
  dom.innerHTML = "";
  for (let entry of arrLogs) {
    dom.innerHTML += "<tr><td>" + entry.time + "</td><td>" + entry.kind + "</td></tr>";
  }
}

/**
 * 打刻
 * string label ラベル名
 */  
function writeLog(label) {
  const data = {};
  const d = new Date();
  const dow = ["日","月","火","水","木","金","土"];
  
  data.time = d.getFullYear() + "/" + 
    ('00' + (d.getMonth() + 1)).substr(-2) + "/" + 
    ('00' + d.getDate()).substr(-2) + 
    dow[d.getDay()] + " " + 
    ('00' + d.getHours()).substr(-2) + ":" +
    ('00' + d.getMinutes()).substr(-2);
  data.kind = label; 
  arrLog.push(data);
  localStorage.setItem(WORK_TIME_LOG, JSON.stringify(arrLog));
  
  displayLog(sortLog());
}

/**
 * ログファイルのダウンロード
 */
function saveLog() {
  //ファイルを作ってダウンロードします。
  const resultJson = JSON.stringify(localStorage.getItem(WORK_TIME_LOG));
  const downLoadLink = document.createElement("a");

  log = resultJson.replace(/\\/g, "").slice(1,-1); // 文字列を JSON に整形

  downLoadLink.download = LOG_FILE;
  downLoadLink.href = URL.createObjectURL(new Blob([log], {type: "application/octet-stream"}));
  downLoadLink.dataset.downloadurl = ["application/octet-stream", LOG_FILE, downLoadLink.href].join(":");
  downLoadLink.click();
}

/**
 * ログファイルの削除
 */
function deleteLog() {
  const empty = [];
  
  arrLog = empty;
  localStorage.setItem(WORK_TIME_LOG, JSON.stringify(empty));
  displayLog(empty);
}

/**
 * localStorage にログがあるかどうかチェック
 */
function validateAndGetLog() {
  let logs;
  
  // ログがなければ空の配列を用意する
  if (localStorage.getItem(WORK_TIME_LOG) !== undefined &&
      localStorage.getItem(WORK_TIME_LOG) !== null &&
      localStorage.getItem(WORK_TIME_LOG) !== "") {
    logs = JSON.parse(localStorage.getItem(WORK_TIME_LOG));    
  } else {
    logs = new Array();
  }
  
  return logs;
} 

/**
 * localStorage に項目リストがあるかどうかチェック
 */
function validateAndGetItems() {
  let items;
  
  // 項目リストがなければ空の配列を用意する
  if (localStorage.getItem(ITEM_LIST) !== undefined &&
      localStorage.getItem(ITEM_LIST) !== null &&
      localStorage.getItem(ITEM_LIST) !== "") {
    items = JSON.parse(localStorage.getItem(ITEM_LIST));
    
    for (let item of items) { 
      if (item != "") addItem(item);
    }
  } else {
    items = new Array();
  }
  
  return items;
}

/**
 * 初期設定
 */
function init() {
  arrLog = validateAndGetLog();
  arrItem = validateAndGetItems();

  /**
   *「終業」項目にクリック時イベントのアクションを登録
    */
  const dom = $("radio0");
  const label = $('label0').innerText;

  // クリック時の動作
  dom.addEventListener('click', () => {
    timeStamp(label);
  }, false);
  
  displayLog(sortLog());
  writeVersion();
}

/**
 * function.js、index.html、style.css のタイムスタンプを読み取り最も新しい
 * ものをバージョン番号とする
*/
function writeVersion() {
  const xhr = new XMLHttpRequest();
  const target = ["functions.js","index.html","style.css"];

  if (xhr) {
    for (let file of target) {
      //通信実行
      xhr.open("get",file, false);
      xhr.onreadystatechange = () => {
        //通信完了
        if (xhr.readyState == 4 && xhr.status == 200) {
          //読込後の処理
          const d = new Date(xhr.getResponseHeader("last-modified"));
          const strTime = d.getFullYear() + 
            ('00' + (d.getMonth() + 1)).substr(-2) + 
            ('00' + d.getDate()).substr(-2) + "." + 
            ('00' + d.getHours()).substr(-2) +
            ('00' + d.getMinutes()).substr(-2);
          const dom = $("delete0");
          if (dom.innerText < strTime) dom.innerText = "ver\n" + strTime;
          console.log(dom.innerText, strTime);
        }
      }
      xhr.send(null);
    }
  }
}