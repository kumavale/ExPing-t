document.getElementById('memo_save').onclick = function() {
    alert(1);
}
document.getElementById('memo_save').addEventListener('click', function() {
    alert(2);
}, false);
