
var ALARM_SECOND;      // アラームの総秒数
var ALARM_INTERVAL_ID; // アラーム解除用のID

window.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(null, function(items) {
        var bgcolor   = "#" + items.selected_bgcolor;
        var fgcolor   = "#" + items.selected_fgcolor;
        var font_bold = items.selected_font_bold;

        // 全体の背景色,文字色,太字の変更
        var body = document.getElementsByTagName('body');
        body[0].style.cssText  = "background-color: " + bgcolor + " !important;";
        body[0].style.cssText += "color: " + fgcolor + " !important;";
        if(font_bold == true)
            body[0].style.cssText += "font-weight: bold !important;";

        // 全体の背景色以外の設定
        // TODO
        //var container = document.getElementById('container');
        //container.style.backgroundColor = '#E6E6E6';

        var mondai_info = document.getElementById('mondai_info');

        // 現在のURLの取得
        let tabURL = window.location.href;

        // 癒し画像の表示
        if(items.selected_disp_image == true && mondai_info) {
            let selected_image_right = items.selected_image_right;
            let selected_image_width = items.selected_image_width;
            mondai_info.insertAdjacentHTML('beforeend',
            "<img src='" + selected_image_right + "' width=" + selected_image_width + "% align='right'/>");
        }

        // タイマー(ストップウォッチ)の表示
        if(items.selected_disp_timer == true) {
            if(mondai_info) {
                mondai_info.insertAdjacentHTML('beforeend',
                    "<span id='timer' style='display: inline-block;'></span>");
            }
            timer();
            // 5秒毎に更新
            setInterval(timer, 5000);
        }

        // 時計用のタグを追加
        if(items.selected_disp_clock == true) {
            if(mondai_info) {
                mondai_info.insertAdjacentHTML('beforeend',
                    "<span id='clock' style='display: inline-block;'></span>");
            }
            clock();
            // 5秒毎に更新
            setInterval(clock, 5000);
        }

        // アラーム(キッチンタイマー)の表示
        if ((0 < items.selected_alarm_minutes) || (0 < items.selected_alarm_hours)) {
            if(mondai_info) {
                let hour = items.selected_alarm_hours;
                let min  = items.selected_alarm_minutes;
                // 秒数の初期化
                ALARM_SECOND = hour * 3600 + min * 60;
                mondai_info.insertAdjacentHTML('beforeend',
                    "<span id='alarm' style='display: inline-block;'></span>");
            }
            alarm();
            // 1秒毎に更新
            ALARM_INTERVAL_ID = setInterval(alarm, 1000);
        }

        // 共通メモの表示
        if(items.selected_disp_memo == true) {
            let col = items.selected_memo_col;
            let row = items.selected_memo_row;
            let font_size = items.selected_memo_font_size;
            let memo_value = items.selected_memo;

            if(mondai_info) {
                // 選択肢を 隠す/表す ボタン
                let hide_show = "";
                if(items.selected_hide_choice == true) {
                    hide_show = "<input type='button' id='hide_show' value='現す(k)' accesskey='k' />";
                }

                // [戻る]ボタンがある時のみ, 画面上部にも[戻る]ボタンを表示
                let prev = "";
                if(document.getElementsByName('back')[0]) {
                    prev = "<input type='button' id='ex_prev' value='戻る(p)' />";
                }

                mondai_info.insertAdjacentHTML('beforeend',
                    "<br />" +
                    "共通メモ:&nbsp;"+
                    "<textarea cols='" + col + "' rows='" + row + "' style='font-size: " + font_size + "px;' id='memo_area' placeholder='Alt+Enter to Save'>" +
                    memo_value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') +
                    "</textarea>"+
                    "<input type='button' id='memo_add' value='追記(j)' accesskey='j' />"+
                    "<input type='button' id='memo_save' value='保存' />"+
                    "<input type='button' id='memo_delete' value='削除' />"+
                    "<button id='html_save' accesskey='h'><u>H</u>tml</button>"+
                    hide_show +
                    "&nbsp;&nbsp;"+
                    prev +
                    "<input type='button' id='ex_next' value='次へ(n)' />"+
                    "<div id='memo_status'></div>"+
                    "<style>#memo_area { vertical-align: middle; }</style>");
                memo_set_cursor();
            }

            // リザルト画面
            if(tabURL.match(/https?:\/\/ping-t.com\/.*\/kakumon_histories/)
              || tabURL.match(/https?:\/\/ping-t.com\/.*\/view/)) {
                let kh; // kakumonHistories
                let button_html = "";
                let endtime = "";

                if(tabURL.match(/index/)) {
                    kh = document.getElementsByClassName('kakumonHistories');
                }
                else if(tabURL.match(/view/)) {
                    kh = document.getElementsByClassName('kakumonHistory');
                    button_html = "<button id='html_save' accesskey='h'><u>H</u>tml</button>";
                }

                if(items.selected_disp_timer == true) {
                    // 前のURLがpractice && 現在のURLがpracticeじゃない
                    // つまりリザルト画面の初回起動
                    // 現在時刻との差分を保存/表示
                    // TODO 模擬試験時, 最速タイム
                    let time;
                    if(items.selected_prev_URL.match(/practice/) && !tabURL.match(/practice/)) {
                        let start_time = items.selected_start_time;
                        let now        = new Date();
                        let diff = now.getTime() - start_time;
                        chrome.storage.local.set({
                            selected_time: diff
                        });
                        time = diff;
                    } else {
                        time = items.selected_time;
                    }

                    let min  = Math.floor(time / (1000 * 60));
                    let sec  = Math.floor(time / 1000) % 60;

                    endtime = "<span style='display: inline-block;'>"+
                    "&nbsp;&nbsp;" + min + "分&nbsp;" + sec + "秒&nbsp;&nbsp;</span>";
                }

                if(kh) {
                    kh[0].children[1].insertAdjacentHTML('afterbegin',
                        "<div id='exping-t'>"+
                        endtime +
                        "共有メモ:&nbsp;"+
                        "<textarea cols='" + col + "' rows='" + row + "' style='font-size: " + font_size + "px;' id='memo_area' placeholder='Alt+Enter to Save'>" + memo_value + "</textarea>"+
                        "<input type='button' id='memo_save' value='保存' />"+
                        "<input type='button' id='memo_delete' value='削除' />"+
                        button_html +
                        "<div id='memo_status'></div>"+
                        "<style>#memo_area { vertical-align: middle; }</style>"+
                        "<br />"+
                        "</div>");
                    memo_set_cursor();
                }
            }
        }

        // Historyの色分け/曜日
        if(items.selected_hist_coloring == true) {
            // この配色気に入ってしまった
            // 可変にするか未検討
            const Su = "#FFB2B2";
            const Mo = "#FFB2FF";
            const Tu = "#D8B2FF";
            const We = "#B2D8FF";
            const Th = "#B2FFD8";
            const Fr = "#FFFFB2";
            const Sa = "#FFD8B2";

            if(tabURL.match(/https?:\/\/ping-t.com\/.*\/study_histories/)) {
                var histories = document.getElementsByClassName('list_table');
                if(histories) {
                    for(let i=0, len=histories.length; i<len; ++i) {
                        if(histories[i].children[2].innerHTML.match(/日/))
                            histories[i].style.backgroundColor = Su;
                        else if(histories[i].children[2].innerHTML.match(/月/))
                            histories[i].style.backgroundColor = Mo;
                        else if(histories[i].children[2].innerHTML.match(/火/))
                            histories[i].style.backgroundColor = Tu;
                        else if(histories[i].children[2].innerHTML.match(/水/))
                            histories[i].style.backgroundColor = We;
                        else if(histories[i].children[2].innerHTML.match(/木/))
                            histories[i].style.backgroundColor = Th;
                        else if(histories[i].children[2].innerHTML.match(/金/))
                            histories[i].style.backgroundColor = Fr;
                        else if(histories[i].children[2].innerHTML.match(/土/))
                            histories[i].style.backgroundColor = Sa;
                    }
                }
            }
        }

        // 選択肢隠す
        if(items.selected_hide_choice == true) {
            if(mondai_info) {
                let tests = document.querySelectorAll("span[id*='test']");
                tests.forEach(function(test) {
                    test.style.visibility = 'hidden';
                });
            }
        }

        // 問題数指定
        if(items.selected_number_of_ques != "") {
            let sitei_cnt = document.getElementsByName("sitei_cnt")[0];
            if (sitei_cnt) {
                let number_of_ques = items.selected_number_of_ques;
                let option = document.createElement('option');
                option.value = number_of_ques;
                option.innerHTML = number_of_ques + "問";
                sitei_cnt.insertBefore(option, sitei_cnt.firstChild);
            }
        }


        // コマ問
        //if(tabURL.match(/comamon/)) {
        //    let leftcolumn = document.getElementById('leftcolumn');
        //    if(leftcolumn) {
        //        document.getElementById('restart').insertAdjacentHTML('afterend',
        //            "&nbsp;&nbsp;"+
        //            "<span id='next_failed'>"+
        //            "<input type='button' value='Next' />"+
        //            "</span>"
        //        );

        //        let next = document.getElementsByTagName('input');
        //        //console.log(next);
        //        for(let i=0; i<next.length; ++i) {
        //            if(next[i].value = "Next") {
        //                next[i].value = "Next(n)";
        //                next[i].accessKey = "n";
        //            }
        //        }
        //        //next.value = "Next(n)";
        //        //next.accessKey = "n";
        //    }
        //}

        // 現在のURLの保存
        chrome.storage.local.set({
            selected_prev_URL: tabURL
        });

    });
//};
});

// 共有メモクリック時, カーソルを最後に持ってくる
function memo_set_cursor() {
    let area = document.getElementById('memo_area');
    area.setSelectionRange(-1, -1);
}

// 0埋め
function zero_padding(num, len) {
    return (Array(len).join('0') + num).slice(-len);
}

// 追記ボタン押下時
// 指定した書式を共有メモに追記し, 保存
// %n 問題番号
// %i 問題ID
// %Y 年
// %M 月
// %D 日
// %w 曜日
// %H hour(24)
// %h hour(12)
// %m min
// %s sec
// %% %
// %[0-9]+[nYMDHhms] 桁数を指定して0埋め
function onclick_memo_add() {
    chrome.storage.local.get(['selected_memo_add_format'], function(items) {
        // 初期設定を読み込む
        let fmt = items.selected_memo_add_format;
        let str = '';
        let number_of_digits = 0;
        let after_num = false;

        // fmtが定義されていなければReturn
        if(fmt == '')
            return;

        // 問題番号, 問題ID取得用の情報
        var info = document.getElementById('mondai_info').innerHTML;

        let i = 0;
        for(let n = fmt.length; i < n; ++i) {
            let c = fmt[i];

            if(fmt[i] == '%' || after_num) {
                ++i;
                switch(fmt[i]) {
                    // '%%' を '%' に変換
                    case '%':
                        c = '%';
                        break;

                    // '%n' を 問題番号に変換
                    case 'n':
                        c = info.substring(info.indexOf('第')+1, info.indexOf('/'));
                        break;

                    // '%i' を 問題IDに変換
                    case 'i':
                        c = info.match(/問題ID\D+\d+/)[0].match(/\d+/);
                        break;

                    // '%Y' を年の数字に変換
                    case 'Y':
                        c = get_time('Y');
                        break;

                    // '%M' を月の数字に変換
                    case 'M':
                        c = get_time('M');
                        break;

                    // '%D' を日の数字に変換
                    case 'D':
                        c = get_time('D');
                        break;

                    // '%w' を曜日の1文字に変換
                    case 'w':
                        c = get_time('w');
                        break;

                    // '%H' を24時間表記の数字に変換
                    case 'H':
                        c = get_time('H');
                        break;

                    // '%h' を12時間表記の数字に変換
                    case 'h':
                        c = get_time('h');
                        break;

                    // '%m' を分の数字に変換
                    case 'm':
                        c = get_time('m');
                        break;

                    // '%s' を秒の数字に変換
                    case 's':
                        c = get_time('s');
                        break;

                    default:
                        // 数字なら桁数としてカウント
                        if ('0' <= fmt[i] && fmt[i] <= '9') {
                            number_of_digits = fmt[i].charCodeAt(0) - 48;
                            while ('0' <= fmt[i+1] && fmt[i+1] <= '9') {
                                ++i;
                                number_of_digits = number_of_digits * 10 + (fmt[i].charCodeAt(0) - 48);
                            }
                            --i;
                            after_num = true;
                            continue;
                        } else {
                            console.log('Invalid param: \'%' + fmt[i] + '\'');
                            c = '%' + fmt[i];
                        }
                }
            }

            if (0 < number_of_digits) {
                str += zero_padding(c, number_of_digits);
                number_of_digits = 0;
            } else {
                str += c;
            }
            after_num = false;
        }

        // 追記して保存
        document.getElementById('memo_area').value += str;
        onclick_memo_save();
    });
}

// 共有メモの保存ボタン押下時
function onclick_memo_save() {
    chrome.storage.local.set({
        selected_memo: document.getElementById('memo_area').value,
    }, function() {
        var status = document.getElementById('memo_status');
        status.textContent = 'saved';

        setTimeout(function() {
          status.textContent = '';
        }, 1000);
    });
}

// 共有メモの削除ボタン押下時
function onclick_memo_delete() {
    chrome.storage.local.set({
        selected_memo: ''
    }, function() {
        document.getElementById('memo_area').value = '';
    });
}

// HTMLボタン押下時
// TODO 模擬試験時等, 正答の表示
// 	$("#seikai").click(function()をごにょごにょする
function onclick_html_save() {
    chrome.storage.local.get(null, function(items) {

        let body;
        let id;
        let tabURL = window.location.href;

        // 問題を解き終わった後のリザルト画面や検索画面から推移できる問題
        if(tabURL.match(/view/)) {
            body = document.getElementsByClassName('kakumonHistory')[0].cloneNode(true);
            id   = body.innerHTML.match(/問題ID\D+\d+/)[0].match(/\d+/);
        }
        // 普通の問題
        else {
            let info = document.getElementById('mondai_info').innerHTML;
            body     = document.getElementById('ViewMondai').children[0].cloneNode(true);
            id       = info.match(/問題ID\D+\d+/)[0].match(/\d+/);
        }

        // ~~画像PathをBase64に変換~~
        //   => 画像はローカルには保存せず, インターネットから参照する
        var nodes = body.querySelectorAll('img');
        for(let i=0; i<nodes.length; ++i) {
            //fetch(nodes[i].src).then(function(response) {
            //    return response.blob();
            //}).then(function(blob) {
            //    let fileReader = new FileReader();
            //    fileReader.readAsDataURL(blob);
            //    fileReader.onload = function() {
            //        nodes[i].src = this.result;
            //    }
            //});
            let e = document.createElement('a');
            e.href = nodes[i].src;
            nodes[i].src = e.href;
        }

        if(!tabURL.match(/view/)) {
            // 解説の表示
            body.querySelectorAll('#kaisetu')[0].style.display = 'inline';
        }
        else {
            // 共有メモの削除
            body.querySelectorAll('#exping-t')[0].textContent = null;
            // 最後のチェックボックスの削除
            body.querySelectorAll('#form_view')[0].textContent = null;
        }

        var css = '';
        if(items.selected_color_for_html == true) {
            let bgcolor = items.selected_bgcolor;
            let fgcolor = items.selected_fgcolor;
            css = '<style>body{background-color:#' + bgcolor + ';color:#' + fgcolor + ';}</style>';
        }
        var head    = '<head><meta charset="UTF-8"><title>' + id + '</title>' + css + '</head>';
        var blob    = new Blob(['<!DOCTYPE HTML>\n<html lang="ja">\n', head, '\n', body.innerHTML, '\n</html>']);
        var url     = window.URL || window.webkitURL;
        var blobURL = url.createObjectURL(blob);

        var a = document.createElement('a');
        a.download = id + '.html';
        a.href = blobURL;
        a.click();
    });
}

// 隠す/現す ボタン押下時
function onclick_hide_show() {
    let tests = document.querySelectorAll("span[id*='test']");
    tests.forEach(function(test) {
        if(test.style.visibility == 'visible') {
            test.style.visibility = 'hidden';
            document.getElementById('hide_show').value = "現す(k)";
        }
        else {
            test.style.visibility = 'visible';
            document.getElementById('hide_show').value = "隠す(k)";
        }
    });
}

function get_time(time) {
    var now = new Date();

    if(time == 'Y') {
        return now.getFullYear();
    }
    else if(time == 'M') {
        return now.getMonth() + 1;
    }
    else if(time == 'D') {
        return now.getDate();
    }
    else if(time == 'w') {
        let week = ['日','月','火','水','木','金','土'];
        return week[now.getDay()];
    }
    else if(time == 'H') {
        return now.getHours();
    }
    else if(time == 'h') {
        return now.getHours() % 12;
    }
    else if(time == 'm') {
        return now.getMinutes();
    }
    else if(time == 's') {
        return now.getSeconds();
    }
    else {
        console.log('Invalid arguments: ' + time);
        return;
    }
}

//function onclick_next_failed() {
//    let seitouritu = document.getElementById('seitouritu').innerHTML;
//
//    console.log(seitouritu);
//    if(seitouritu != '') {
//        let mondai_no  = document.getElementById('mondai_no').innerHTML;
//        let mondai_all = document.getElementById('mondai_all').innerHTML;
//
//        let no  = mondai_no.substring(mondai_no.indexOf('第')+1);
//        let all = mondai_all.substring(mondai_all.indexOf('/')+1, mondai_all.indexOf('問'));
//
//        console.log("no:"+no+" all:"+all);
//    }
//}

window.addEventListener('click', function(e) {
    if(e.target.id == 'memo_area') {
        memo_set_cursor();
    }
    if(e.target.id == 'memo_add') {
        onclick_memo_add();
    }
    if(e.target.id == 'memo_save') {
        onclick_memo_save();
    }
    if(e.target.id == 'memo_delete') {
        onclick_memo_delete();
    }
    if(e.target.id == 'html_save') {
        onclick_html_save();
    }
    if(e.target.id == 'ex_prev') {
        document.getElementsByName('back')[0].click();
    }
    if(e.target.id == 'ex_next') {
        document.getElementById('next').click();
    }
    if(e.target.id == 'hide_show') {
        onclick_hide_show();
    }
    //if(e.target.id == 'next_failed') {
    //    onclick_next_failed();
    //}
}, false);

// Alt + Enter で共有メモを保存
window.addEventListener('keydown', function(e) {
    const key_enter = 13;
    if(e.altKey && e.keyCode == key_enter) {
        // TODO 共有メモ表示状態のみ下記を実行
        onclick_memo_save();
    }
});

function clock() {
    let c = document.getElementById('clock');
    if(c) {
        let now  = new Date();
        let hour = now.getHours();
        let min  = now.getMinutes();

        // 桁を揃える
        if(hour < 10) hour = "0" + hour;
        if(min  < 10) min  = "0" + min;

        c.innerHTML = "&nbsp;[" + hour + ":" + min + "]&nbsp;";
    }
}

function timer() {
    let t = document.getElementById('timer');
    if (t) {
        // 現在のURLの取得
        let tabURL = window.location.href;

        chrome.storage.local.get(null, function(items) {
            let start_time = items.selected_start_time;
            let prev_URL   = items.selected_prev_URL;
            let now        = new Date();
            let progress   = "0";

            // 前のURLがpracticeじゃない && 現在のURLがpractice
            //     タイマー開始
            //     現在時刻を書き込む
            if(!prev_URL.match(/practice/) && tabURL.match(/practice/)) {
                chrome.storage.local.set({
                    // エポックタイムに変換して保存
                    selected_start_time: now.getTime()
                });
            }

            // 前のURLがpractice && 現在のURLもpractice
            //     タイマー継続
            //     現在時刻との差分を表示
            if(prev_URL.match(/practice/) && tabURL.match(/practice/)) {
                let diff = now.getTime() - start_time;
                progress = Math.floor(diff / (1000 * 60));
            }

            t.innerHTML = "<span id='timer' style='display: inline-block;'>" +
                "&nbsp;&nbsp;" + progress + "分&nbsp;経過</span>";
        });
    }
}

function alarm() {
    let a = document.getElementById('alarm');
    if (a) {
        let hour = Math.floor(ALARM_SECOND / 3600);
        let min  = Math.floor(ALARM_SECOND / 60 % 60);
        let sec  = Math.floor(ALARM_SECOND % 60 % 60);

        a.innerText = "{" + hour + ":" + min + ":" + sec + "}";

        if (ALARM_SECOND <= 0) {
            alert("Time is up!");
            clearInterval(ALARM_INTERVAL_ID);
        }

        ALARM_SECOND--;
    }
}

