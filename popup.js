
function html_store() {
    //var html = document.getElementById('mondai_info').nextElementSibling;
    var html = document.getElementsByTagName('body')[0];
    console.log(html);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('store').addEventListener('click', html_store);
});

