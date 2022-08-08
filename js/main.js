import __ from "./multilingualization.js";

/**
 * 定数
 */
const WORK_TIME_LOG = "worktimelog";
const ITEM_LIST = "itemList";

/**
 * セレクタを入れると DOM Element を返す
 * @param {string} selector DOMセレクタ
 * @return DOMElement
 */
var _$ = selector => {
    return document.querySelector(selector);
}

/**
 * localStorageにある項目リストをオブジェクトにパースする
 * @returns {array}
 */
function getItems() {
    const data = JSON.parse(localStorage.getItem(ITEM_LIST) || "[]");
    return data;
}

/**
 * localStorageにある作業ログをオブジェクトにパースする
 * @returns {array}
 */
function getLogs() {
    const data = localStorage.getItem(WORK_TIME_LOG);
    return data;
}

/**
 * 項目リストをlocalStorageにjsonとして保存する
 * @param {array} data データ配列
 */
function setItems(data) {
    localStorage.setItem(ITEM_LIST, JSON.stringify(data || "[]"));
}

/**
 * 作業ログをlocalStorageにjsonとして保存する
 * @param {string} data データ文字列
 */
function setLogs(data) {
    localStorage.setItem(WORK_TIME_LOG, data);
}

/**
 * 項目の追加
 */
function addItem() {
    // テキストボックスから追加
    const label = _$("#input_box").value;

    // 追加するが、重複する項目は削除する
    let arrItems = getItems();
    arrItems.push(label);
    arrItems = arrItems.filter((item, index, self) => self.indexOf(item) === index);
    setItems(arrItems);

    // テキストボックスのクリア
    _$("#input_box").value = '';

    const num = arrItems.length;

    addItemButton(num, label)
}

/**
 * 画面呼び出し時似だけ走る項目の追加
 */
function initItemList() {
    const arrItems = getItems();

    for (let i = 0; i < arrItems.length; i++) {
        let label = arrItems[i];
        let num = i + 1;  // num = 0 は「休憩」で予約されている
        addItemButton(num, label);
    }
}

/**
 * 項目ボタンを一つ追加する
 * @param {int} num 連番
 * @param {string} label 表示名
 */
function addItemButton(num, label) {
    // 画面に項目追加
    _$("#items").insertAdjacentHTML('afterbegin', `<div id="item${num}" class="item" data-item="${label}"><input type="radio" name="kind" id="radio${num}"><label for="radio${num}" id="label${num}" class="label">${label}</label><label for="radio${num}" id="delete${num}" class="delete">✖︎</label></div>`);

    // ラジオボタンイベントリスナの設定
    // 項目名クリック時の動作
    _$("#radio" + num).addEventListener('click', () => {
        writeLog(label);
    }, false);

    // ×ボタンクリック時の動作
    _$("#delete" + num).addEventListener('click', () => {
        deleteItem("#item" + num);
    }, false);
}

/**
 * 項目リストの項目削除
 * @param {string} selector DOMのIDセレクタ
 */
function deleteItem(selector) {
    const dom = _$(selector);
    setItems(getItems().filter(item => item != dom.dataset.item));
    dom.parentNode.removeChild(dom);
}

/**
 * ログソート
 * 同じ時刻のものは入れ替わる可能性がある
 * @param {string|array} data ログか作業項目リストの配列
 * @return array ログを配列にして日時順でソートしたもの
 */
function sort(data) {
    let array = (typeof data === 'string') ? data.split("\n") : data;

    // 空行は削除する
    array = array.filter(item => item.trim() != '');

    array.sort((a, b) => {
        return a < b ? -1 : 1;
    });

    return array;
}

/**
 * ログ表示
 */
function displayLog() {
    _$('#log').innerText = sort(getLogs()).join("\n");
}

/**
 * 集計表示
 * @return {object} 入力項目ごとに集計された分数のオブジェクト
 */
function displaySum() {
    // sort()すると文字列から配列に変換される
    const lines = sort(getLogs());

    // 時間集計
    let sum = {};
    let item;
    for (let i = 1; i < lines.length; i++) {
        item = lines[i - 1].slice(4);
        sum[item] = sum[item] ? sum[item] : 0;
        sum[item] += timestampToMinutes(lines[i]) - timestampToMinutes(lines[i - 1]);
    }

    const dom = _$('#sum_table');
    dom.innerHTML = "";
    for (let kind in sum) {
        // 最初の時刻を引くことで経過時間のみを取得
        dom.innerHTML += `<tr><td>${kind}</td><td data-unit="${__.translate("Minute")}">${sum[kind]}</td></tr>`;
    }

    return sum;
}

/**
 * 時分を述べ分数に変換する
 * @param {string} timestamp 時分"HHMM"
 * @return integer  述べ分数
 */
function timestampToMinutes(timestamp) {
    const hour = timestamp.slice(0, 2);
    const min = timestamp.slice(2, 4);
    return parseInt(hour) * 60 + parseInt(min);
}

/**
 * 打刻
 * @param {string} label ラベル名
 */
function writeLog(label) {
    const d = new Date();
    const text = _$("#log").innerText += "\n" + `0${d.getHours()}`.slice(-2)
        + `0${d.getMinutes()}`.slice(-2)
        + label;

    setLogs(text);
    displayLog();
    displaySum();
}

/**
 * ログファイルの削除
 */
function deleteLog() {
    setLogs("");
    displayLog([]);
    displaySum();
}

/**
 * 初期設定
 */
window.onload = () => {
    // 多言語化対応
    _$("#input_box").placeholder = __.translate("Enter item name");
    __.translateAll();

    /**
     * 「追加」テキストボックスでEnter押下時にaddItem()を実行
     */
    _$('#input_box').addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            addItem();
        }
    });

    /**
     *「休憩」項目にクリック時イベントのアクションを登録
    */
    // クリック時の動作
    _$("#radio0").addEventListener('click', () => {
        writeLog(_$('#label0').innerText);
    }, false);

    // ログ編集時の動作
    _$("#log").addEventListener('input', () => {
        setLogs(_$('#log').innerText);
        displaySum();
    }, false);

    _$('#add_item').addEventListener('click', () => {
        addItem();
    })

    _$('#copy_result').addEventListener('click', () => {
        copyResult();
    })

    _$('#delete_log').addEventListener('click', () => {
        deleteLog();
    })

    const arrLog = getLogs();
    displayLog();
    displaySum();
    writeVersion();

    initItemList();
}

/**
 * function.js、index.html、style.css のタイムスタンプを読み取り最も新しい
 * ものをバージョン番号とする
*/
async function writeVersion() {
    const target = ["functions.js", "index.html", "style.css"];
    const xhr = new XMLHttpRequest();
    let version = "";

    if (xhr) {
        for (let file of target) {
            //通信実行
            xhr.open("get", file, false);
            xhr.onreadystatechange = () => {
                //通信完了
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //読込後の処理
                    const d = new Date(xhr.getResponseHeader("last-modified"));
                    const strTime = d.getFullYear() +
                        `0${d.getMonth() + 1}`.slice(-2) +
                        `0${d.getDate()}`.slice(-2) + "." +
                        `0${d.getHours()}`.slice(-2) +
                        `0${d.getMinutes()}`.slice(-2);

                    version = version > strTime ? version : strTime;

                    _$("#delete0").innerText = "ver\n" + version;
                    console.log(version);
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
    const data = displaySum();

    let sum = 0, total = 0;
    let html =
`${__.translate("Table header")}
--- | --: | --:
`;

    for (let category in data) {
        html += `${category} | ${Math.floor(data[category] / 60)}:${("0" + data[category] % 60).slice(-2)} | ${data[category]}\n`;
        if (category.indexOf("#") != 0) sum += data[category];
        total += data[category];
    }

    html += `
${__.translate("Work hours total")} ${Math.floor(sum / 60)}:${("0" + (sum % 60)).slice(-2)}
${__.translate("Total")} ${Math.floor(total / 60)}:${("0" + (total % 60)).slice(-2)}`;

    navigator.clipboard?.writeText(html);
}
