window.onload = function() {
    chrome.storage.local.get(null, function(items) {
        var selected_bgcolor = items.selected_bgcolor;
        var bgcolor = "#" + selected_bgcolor;

        // 背景色の変更
        var body = document.getElementsByTagName('body');
        body[0].style.cssText = "background-color: " + bgcolor + " !important;";
        //var container = document.getElementById('container');
        //container.style.backgroundColor = '#E6E6E6';

        var mondai_info = document.getElementById('mondai_info');

        // 癒し画像の表示
        if(items.selected_disp_image == true) {
            var selected_image_right = items.selected_image_right;
            var selected_image_width = items.selected_image_width;
            mondai_info.insertAdjacentHTML('beforeend',
            "<img src=" + selected_image_right + " width=" + selected_image_width + "% align='right'/>");
        }

        // 共通メモの表示
        if(items.selected_disp_memo == true) {
            var col = items.selected_memo_col;
            var row = items.selected_memo_row;
            var font_size = items.selected_memo_font_size;
            var memo_value = items.selected_memo;
            mondai_info.insertAdjacentHTML('beforeend',
                "<br />" +
                "共通メモ:&nbsp;"+
                "<textarea cols='" + col + "' rows='" + row + "' style='font-size: " + font_size + "px;' id='memo_area' placeholder='Alt+Enter to Save'>" + memo_value + "</textarea>"+
                "<input type='button' id='memo_save' value='保存' />"+
                "<input type='button' id='memo_delete' value='削除' />"+
                "<input type='button' id='html_save' value='HTML' />"+
                "<style>#memo_area { vertical-align: middle; }</style>");
        }
    });
};

function delete_element(id) {
    var obj = document.getElementById(id);
    var obj_parent = obj.parentNode;
    obj_parent.removeChild(obj);
}

function onclick_memo_save() {
    chrome.storage.local.set({
        selected_memo: document.getElementById('memo_area').value,
    });
}

function onclick_memo_delete() {
    chrome.storage.local.set({
        selected_memo: ''
    }, function() {
        document.getElementById('memo_area').value = '';
    });
}

function onclick_html_save() {
    var body = document.getElementById('ViewMondai').children[0].cloneNode(true);
    var info = document.getElementById('mondai_info').innerHTML;
    var id   = info.substr(info.indexOf('問題ID')+6, 5);
    body.querySelectorAll('#kaisetu')[0].style.display = 'inline';
    var head   = '<head><meta charset="UTF-8"><title>' + id + '</title></head>';
    var blob    = new Blob(['<!DOCTYPE HTML>\n<html lang="ja">\n', head, '\n', body.innerHTML, '\n</html>']);
    var url     = window.URL || window.webkitURL;
    var blobURL = url.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = id + '.html';
    a.href = blobURL;
    a.click();
}

window.addEventListener('click', function(e) {
    if(e.target.id == 'memo_save') {
        onclick_memo_save();
    }
    if(e.target.id == 'memo_delete') {
        onclick_memo_delete();
    }
    if(e.target.id == 'html_save') {
        onclick_html_save();
    }
}, false)

window.addEventListener('keydown', function(e) {
    const key_enter = 13;
    if(e.altKey && e.keyCode == key_enter) {
        onclick_memo_save();
    }
})
