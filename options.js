// 設定画面で保存ボタンを押されたら
function save_options() {

    // 設定値を変数に格納
    var bgcolor         = document.getElementById('bgcolor').value;
    var fgcolor         = document.getElementById('fgcolor').value;
    var color_for_html  = document.getElementById('color_for_html').checked;
    var font_bold       = document.getElementById('font_bold').checked;
    var disp_image      = document.getElementById('disp_image').checked;
    var image_width     = document.getElementById('image_size').value;
    var disp_memo       = document.getElementById('disp_memo').checked;
    var memo_col        = document.getElementById('memo_col').value;
    var memo_row        = document.getElementById('memo_row').value;
    var memo_font_size  = document.getElementById('memo_font_size').value;
    var memo_add_format = document.getElementById('memo_add_format').value;
    var hist_coloring   = document.getElementById('hist_coloring').checked;
    var disp_timer      = document.getElementById('disp_timer').checked;

    // 背景色,文字色を指定色に変更
    document.getElementsByTagName('body')[0].style.backgroundColor = "#" + bgcolor;
    document.getElementsByTagName('body')[0].style.color = "#" + fgcolor;

    // chromeアカウントと紐づくストレージに保存
    chrome.storage.local.set({
        selected_bgcolor:         bgcolor,
        selected_fgcolor:         fgcolor,
        selected_color_for_html:  color_for_html,
        selected_font_bold:       font_bold,
        selected_disp_image:      disp_image,
        selected_image_width:     image_width,
        selected_disp_memo:       disp_memo,
        selected_memo_col:        memo_col,
        selected_memo_row:        memo_row,
        selected_memo_font_size:  memo_font_size,
        selected_memo_add_format: memo_add_format,
        selected_hist_coloring:   hist_coloring,
        selected_disp_timer:      disp_timer,

    }, function() {
        // 保存できたら、画面にメッセージを表示
        var status = document.getElementById('status');
        status.style.visibility = "visible";
        setTimeout(function() {
            status.style.visibility = "hidden";
        }, 2000);
    });
}

// 設定画面で設定を表示する
function restore_options() {
    // デフォルト値は、ここで設定する
    chrome.storage.local.get({
        selected_bgcolor:         'F0F0F0',
        selected_fgcolor:         '000000',
        selected_color_for_html:  'false',
        selected_font_bold:       'false',
        //selected_image_right:     '',
        selected_disp_image:      'false',
        selected_image_width:     '10',
        selected_memo:            '',
        selected_disp_memo:       'false',
        selected_memo_col:        '50',
        selected_memo_row:        '1',
        selected_memo_font_size:  '',
        selected_memo_add_format: '%n:',
        selected_hist_coloring:   'true',
        selected_disp_timer:      'true',

    // 保存された値があったら、それを使う
    }, function(items) {
        document.getElementById('bgcolor').value          = items.selected_bgcolor;
        document.getElementById('fgcolor').value          = items.selected_fgcolor;
        document.getElementById('color_for_html').checked = items.selected_color_for_html;
        document.getElementById('font_bold').checked      = items.selected_font_bold;
        document.getElementById('disp_image').checked     = items.selected_disp_image;
        //document.getElementById('image_right').         = items.selected_image_right;
        document.getElementById('image_size').value       = items.selected_image_width;
        document.getElementById('disp_memo').checked      = items.selected_disp_memo;
        document.getElementById('memo_col').value         = items.selected_memo_col;
        document.getElementById('memo_row').value         = items.selected_memo_row;
        document.getElementById('memo_font_size').value   = items.selected_memo_font_size;
        document.getElementById('memo_add_format').value  = items.selected_memo_add_format;
        document.getElementById('hist_coloring').checked  = items.selected_hist_coloring;
        document.getElementById('disp_timer').checked     = items.selected_disp_timer;
    });
}

// 画面表示と保存ボタンのイベントを設定
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

// 書式一覧の表示/非表示
// Not working
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button_format').addEventListener('change', function() {
        var fmt = document.getElementById('button_format');
        if(fmt.value == false) {
            document.getElementById('format_list').style.display = 'block';
        } else {
            document.getElementById('format_list').style.display = 'none';
        }
    });
}, false);

// 画像の自動保存
document.getElementById('image_right').addEventListener('change', function (e) {
    var file = e.target.files[0];
    var image_right;
    var fileReader = new FileReader();

    fileReader.onload = function() {
        image_right = this.result;
        chrome.storage.local.set({
            selected_image_right: image_right
        });
        // TODO ここ良くなさそう
        document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend',
            "<style>"+
            "body {"+
                "background-image: url(" + image_right + ");"+
                "background-position: right bottom;"+
                "background-repeat: no-repeat;"+
                "background-size: 25%;"+
            "}"+
            "</style>");
    }
    fileReader.readAsDataURL(file);
});
