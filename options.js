// 設定画面で保存ボタンを押されたら
function save_options() {

    // 設定値を変数に格納
    var bgcolor        = document.getElementById('bgcolor').value;

    //var image_right;
    //var file = document.getElementById('image_right').files[0];
    //var fr = new FileReader();

    //if(file) {
    //    fr.readAsDataURL(file);
    //}
    //fr.onload = function() {
    //    image_right = fr.result;
    //}

    var disp_memo      = document.getElementById('disp_memo').checked;
    var memo_col       = document.getElementById('memo_col').value;
    var memo_row       = document.getElementById('memo_row').value;
    var memo_font_size = document.getElementById('memo_font_size').value;

    // 背景色を指定色に変更
    document.getElementsByTagName('body')[0].style.backgroundColor = "#" + bgcolor;

    // chromeアカウントと紐づくストレージに保存
    chrome.storage.local.set({
        selected_bgcolor:        bgcolor,
        selected_disp_memo:      disp_memo,
        selected_memo_col:       memo_col,
        selected_memo_row:       memo_row,
        selected_memo_font_size: memo_font_size,

    }, function() {
        // 保存できたら、画面にメッセージを表示
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        //status.textContent = image_right;
        setTimeout(function() {
          status.textContent = '';
        }, 2000);
    });
}

// 設定画面で設定を表示する
function restore_options() {
    // デフォルト値は、ここで設定する
    chrome.storage.local.get({
        selected_bgcolor:        'F0F0F0',
        selected_image_right:    '',
        selected_memo:           '',
        selected_disp_memo:      'false',
        selected_memo_col:       '64',
        selected_memo_row:       '1',
        selected_memo_font_size: '',

    // 保存された値があったら、それを使う
    }, function(items) {
        document.getElementById('bgcolor').value        = items.selected_bgcolor;
        document.getElementById('image_right').checked  = items.selected_image_right;
        document.getElementById('disp_memo').checked    = items.selected_disp_memo;
        document.getElementById('memo_col').value       = items.selected_memo_col;
        document.getElementById('memo_row').value       = items.selected_memo_row;
        document.getElementById('memo_font_size').value = items.selected_memo_font_size;
    });
}

// 画面表示と保存ボタンのイベントを設定
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('image_right').addEventListener('change', function (e) {
    var file = e.target.files[0];
    var image_right;
    var fileReader = new FileReader();

    fileReader.onload = function() {
        image_right = this.result;
        chrome.storage.local.set({
            selected_image_right: image_right
        });
    }
    fileReader.readAsDataURL(file);
});
