chrome.storage.local.get(['selected_bgcolor', 'selected_image_right'], function(items) {
    let bgcolor     = items.selected_bgcolor;
    let image_right = items.selected_image_right;
    let image_width = 10;

    if(bgcolor) {
        document.getElementsByTagName('body')[0].style.backgroundColor = "#" + bgcolor;
    }

    if(image_right) {
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
});
