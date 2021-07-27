"use strict"
/**
 * グローバル変数
 */
var arrItem;
var arrLog;
var maxItemNum = 3;

/**
 * 定数
 */
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";
const LOG_FILE = "work_time_log.json";
const WRITE_BG_COLOR = "#58D3F7";
const ASC = true;
const DESC = false;

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

        // テキストボックスのクリア
        $("input_box").value = '';
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

    // 項目名クリック時の動作
    radio_ev.addEventListener('click', () => {
        timeStamp(_label);
    }, false);

    // 削除ラベルイベントリスナの設定
    const delete_ev = $("delete" + num);

    // ×ボタンクリック時の動作
    delete_ev.addEventListener('click', () => {
        deleteItem("item"+num,_label);
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
function sortLog(asc = true) {
    const arrLogs = localStorage.getItem(WORK_TIME_LOG).split("\n");

    if (asc === true) {
        arrLogs.sort((a,b) => {
            return a.time < b.time ? -1 : 1;
        });
    } else { // desc
        arrLogs.sort((a,b) => {
            return a.time < b.time ? 1 : -1;
        });
    }

    return arrLogs;
}

/**
 * ログ表示
 * json arrLogs ログ配列
 */
function displayLog(arrLogs) {
    const dom = $('log');

    dom.innerText = arrLogs.join("\n");
}

/**
 * 集計表示
 */
function displaySum(arrLogs) {
    const dom = $('sum_table');

    // 時間集計
    let sum = {};
    for (let i = 1; i < arrLogs.length; i++) {
        if (arrLogs[i].substr(4).trim() === "") continue;
        if (sum[arrLogs[i-1].substr(4)] === undefined) sum[arrLogs[i-1].substr(4)] = 0;
        sum[arrLogs[i-1].substr(4)] += timestampToMinutes(arrLogs[i]) - timestampToMinutes(arrLogs[i-1]);
    }

  console.log(sum);

    dom.innerHTML = "";
    for (let kind in sum) {
        // 最初の時刻を引くことで経過時間のみを取得
        dom.innerHTML += "<tr><td>" + kind + "</td><td>" + sum[kind] + "</td><td>分</td></tr>";
    }

    return sum;
}

/**
 * 時分を述べ分数に変換する
 * string timestamp 時分"HH:mm:SS"
 * @return integer  述べ分数
 */
function timestampToMinutes(timestamp) {
    const hour = timestamp.substr(0, 2);
    const min = timestamp.substr(2, 2);
    return parseInt(hour, 10) * 60 + parseInt(min, 10);
}

/**
 * 打刻
 * string label ラベル名
 */
function writeLog(label) {
    const d = new Date();
    const dom = $("log");

    dom.innerText +=
            ('00' + d.getHours()).substr(-2)
        + ('00' + d.getMinutes()).substr(-2)
        + label + "\n";
    localStorage.setItem(WORK_TIME_LOG, dom.innerText);

    displayLog(sortLog(ASC));
    displaySum(sortLog(ASC));
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
    localStorage.setItem(WORK_TIME_LOG, "");
    displayLog(empty);
    displaySum(empty);
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
        logs = localStorage.getItem(WORK_TIME_LOG);
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
     * 「追加」テキストボックスでEnter押下時にaddItem()を実行
     */
    const dom_input = $('input_box');
    dom_input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        addItem();
    }
    });

    /**
     *「終業」項目にクリック時イベントのアクションを登録
    */
    const dom = $("radio0");
    const label = $('label0').innerText;

    // クリック時の動作
    dom.addEventListener('click', () => {
        timeStamp(label);
    }, false);

    // ログ編集時の動作
    $("log").addEventListener('input', () => {
        localStorage.setItem(WORK_TIME_LOG, $('log').innerText);
        displaySum(sortLog(ASC));
    }, false);

    displayLog(sortLog(ASC));
    displaySum(sortLog(ASC));
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

/**
 * 入力された文字列を読み込んで結果を Markdown のテーブル形式でクリップボードにコピーする
 */
function copyResult() {
    const data = displaySum(sortLog(ASC));

    let sum = 0, total = 0;
    let html =
`業務名 | 作業時間[時] | 作業時間[分]
--- | --: | --:
`;

    for (let category in data) {
        html += `${category} | ${Math.floor(data[category] / 60)}:${data[category] % 60} | ${data[category]}\n`;
        if (category.indexOf("　") != 0) sum += data[category];
        total += data[category];
    }

    html += `
実働計： ${Math.floor(sum / 60)}:${sum % 60}
総計： ${Math.floor(total / 60)}:${total % 60}`;

    if(navigator.clipboard){
        navigator.clipboard.writeText(html);
    }
}

/**
 *
 * @param {*} min
 */
function minutesToHour(min) {
    return Math.floor(min / 60) + Math.round(min % 60);
}
