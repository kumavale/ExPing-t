window.onload = function() {
    chrome.storage.sync.get(null, function(items) {
        var selected_bgcolor = items.selected_bgcolor;
        var bgcolor = "#" + selected_bgcolor;

        var body = document.getElementsByTagName('body');
        //body[0].style.backgroundColor = bgcolor;
        body[0].style.cssText = "background-color: " + bgcolor + " !important;";
        //var container = document.getElementById('container');
        //container.style.backgroundColor = '#E6E6E6';
    });
};

