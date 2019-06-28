// 設定画面で保存ボタンを押されたら
function save_options() {

  // 設定値を変数に格納
  var bgcolor = document.getElementById('bgcolor').value;
  document.getElementsByTagName('body')[0].style.backgroundColor = "#" + bgcolor;

  // chromeアカウントと紐づくストレージに保存
  chrome.storage.sync.set({
    selected_bgcolor: bgcolor,

  }, function() {
    // 保存できたら、画面にメッセージを表示
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
    //fadeout(status);
  });
}

function fadeout(element) {
    var op = 1;
    var timer = setInterval(function() {
        if(op <= 0.1) {
            clearInterval(timer);
            element.textContent = '';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ')';
        op -= op * 0.05;
    }, 50);
}

// 設定画面で設定を表示する
function restore_options() {
  // デフォルト値は、ここで設定する
  chrome.storage.sync.get({
    selected_bgcolor: 'F0F0F0',

  // 保存された値があったら、それを使う
  }, function(items) {
    document.getElementById('bgcolor').value = items.selected_bgcolor;
  });
}

// 画面表示と保存ボタンのイベントを設定
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
