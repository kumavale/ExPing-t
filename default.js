chrome.storage.local.get([
    'selected_bgcolor',
    'selected_fgcolor',
    'selected_image_right'], function(items) {

    let bgcolor     = items.selected_bgcolor;
    let fgcolor     = items.selected_fgcolor;
    let image_right = items.selected_image_right;
    let image_width = 10;

    if(bgcolor) {
        document.getElementsByTagName('body')[0].style.backgroundColor = "#" + bgcolor;
    }

    if(fgcolor) {
        document.getElementsByTagName('body')[0].style.color = "#" + fgcolor;
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
