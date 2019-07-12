
// 時計 [HH:mm]
function clock() {
    if(true) {
        let mondai_info = document.getElementById('mondai_info');
        if(mondai_info) {
            let now  = new Date();
            let hour = now.getHours();
            let min  = now.getMinutes();

            // 桁を揃える
            if(hour < 10) hour = "0" + hour;
            if(min  < 10) min  = "0" + min;

            mondai_info.insertAdjacentHTML('beforeend',
                "<span style='display: inline-block;'>"+
                "&nbsp;[" + hour + ":" + min + "]&nbsp;</span>");
        }
    }
}

setInterval(clock, 1000);
