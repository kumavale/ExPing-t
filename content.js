window.onload = function() {
    chrome.storage.sync.get(null, function(items) {
        var selected_bgcolor = items.selected_bgcolor;
        var bgcolor = "#" + selected_bgcolor;

        // 背景色の変更
        var body = document.getElementsByTagName('body');
        body[0].style.cssText = "background-color: " + bgcolor + " !important;";
        //var container = document.getElementById('container');
        //container.style.backgroundColor = '#E6E6E6';

        // 共通メモの表示
        // 機能ボタンへ変更する...
        if(items.selected_disp_memo == true) {
            var mondai_info = document.getElementById('mondai_info');
            var col = items.selected_memo_col;
            var row = items.selected_memo_row;
            var font_size = items.selected_memo_font_size;
            mondai_info.insertAdjacentHTML('beforeend',
                "<br />" +
                "共通メモ:&nbsp;"+
                "<textarea cols='" + col + "' rows='" + row + "' style='font-size: " + font_size + "px;' id='memo_area'>" + items.selected_memo + "</textarea>"+
                "<input type='button' value='保存' onclick='onclick_memo_save();'/>"+
                "<input type='button' value='削除' onclick='onclick_memo_delete();'/>"+
                "<script>"+
                "function onclick_memo_save() {"+
                    "chrome.storage.sync.set({"+
                        "selected_memo: document.getElementById('memo_area').value,"+
                    "});"+
                "}"+
                "function onclick_memo_delete() {"+
                    "chrome.storage.sync.set({"+
                        "selected_memo: '',"+
                    "}, function() {"+
                        "alert(1);"+
                        "document.getElementById('memo_area').value = '';"+
                    "});"+
                "}"+
                "</script>"+
                "<style>#memo_area { vertical-align: middle; }</style>");
        }
    });
};

function onclick_memo_save() {
   chrome.storage.sync.set({
       selected_memo: document.getElementById('memo_area').value,
   });
}

function onclick_memo_delete() {
   chrome.storage.sync.set({
       selected_memo: '',
   }, function() {
       alert(1);
       document.getElementById('memo_area').value = '';
   });
}
