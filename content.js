
window.onload = function() {
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
        let tabURL = window.location.href;

        // 癒し画像の表示
        if(items.selected_disp_image == true && mondai_info) {
            let selected_image_right = items.selected_image_right;
            let selected_image_width = items.selected_image_width;
            mondai_info.insertAdjacentHTML('beforeend',
            "<img src='" + selected_image_right + "' width=" + selected_image_width + "% align='right'/>");
        }

        // タイマー(ストップウォッチ)の表示
        // TODO
        if(items.selected_disp_timer == true) {
            if(mondai_info) {
                mondai_info.insertAdjacentHTML('beforeend',
                    "&nbsp;&nbsp;XX分&nbsp;経過");
            }
        }

        // 共通メモの表示
        if(items.selected_disp_memo == true) {
            let col = items.selected_memo_col;
            let row = items.selected_memo_row;
            let font_size = items.selected_memo_font_size;
            let memo_value = items.selected_memo;

            if(mondai_info) {
                mondai_info.insertAdjacentHTML('beforeend',
                    "<br />" +
                    "共通メモ:&nbsp;"+
                    "<textarea cols='" + col + "' rows='" + row + "' style='font-size: " + font_size + "px;' id='memo_area' placeholder='Alt+Enter to Save'>" + memo_value + "</textarea>"+
                    "<input type='button' id='memo_add' value='追記' />"+
                    "<input type='button' id='memo_save' value='保存' />"+
                    "<input type='button' id='memo_delete' value='削除' />"+
                    "<input type='button' id='html_save' value='HTML' />"+
                    "&nbsp;&nbsp;"+
                    "<input type='button' id='ex_prev' value='戻る(p)' />"+
                    "<input type='button' id='ex_next' value='次へ(n)' />"+
                    "<div id='memo_status'></div>"+
                    "<style>#memo_area { vertical-align: middle; }</style>");
                memo_set_cursor();
            }

            // リザルト画面
            if(tabURL.match(/https?:\/\/ping-t.com\/.*\/kakumon_histories/)
              || tabURL.match(/https?:\/\/ping-t.com\/.*\/view/)) {
                let kh;
                let button_html = "";

                if(tabURL.match(/index/)) {
                    kh = document.getElementsByClassName('kakumonHistories');
                }
                else if(tabURL.match(/view/)) {
                    kh = document.getElementsByClassName('kakumonHistory');
                    button_html = "<input type='button' id='html_save' value='HTML' />";
                }

                if(kh) {
                    kh[0].children[1].insertAdjacentHTML('afterbegin',
                        "<div id='exping-t'>"+
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
    });
};

// 共有メモクリック時, カーソルを最後に持ってくる
function memo_set_cursor() {
    let area = document.getElementById('memo_area');
    area.setSelectionRange(-1, -1);
}

// 追記ボタン押下時
// 指定した書式を共有メモに追記し, 保存
// %d 問題番号
// %i 問題ID
// 先頭が'\'はエスケープ => TODO
function onclick_memo_add() {
    chrome.storage.local.get(['selected_memo_add_format'], function(items) {
        // 初期設定を読み込む
        fmt = items.selected_memo_add_format;

        // fmtが定義されていなければReturn
        if(fmt == '')
            return;

        // 問題番号, 問題ID取得用の情報
        var info = document.getElementById('mondai_info').innerHTML;

        // '%d' を 問題番号に変換
        if(fmt.match(/%d/)) {
            let num = info.substring(info.indexOf('第')+1, info.indexOf('/'));
            fmt = fmt.replace(/%d/g, num);
        }

        // '%i' を 問題IDに変換
        if(fmt.match(/%i/)) {
            let id = info.match(/問題ID\D+\d+/)[0].match(/\d+/);
            fmt = fmt.replace(/%i/g, id);
        }

        // 追記して保存
        document.getElementById('memo_area').value += fmt;
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
// TODO
function onclick_html_save() {
    chrome.storage.local.get(null, function(items) {

        let body;
        let id;
        let tabURL = window.location.href;

        if(tabURL.match(/view/)) {
            body = document.getElementsByClassName('kakumonHistory')[0].cloneNode(true);
            id   = body.innerHTML.match(/問題ID\D+\d+/)[0].match(/\d+/);
        }
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
}, false);

// Alt + Enter で共有メモを保存
window.addEventListener('keydown', function(e) {
    const key_enter = 13;
    if(e.altKey && e.keyCode == key_enter) {
        onclick_memo_save();
    }
});

