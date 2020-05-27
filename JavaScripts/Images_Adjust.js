// waterfall
function waterfallHandler() {
    // get the width of image
    let imgWidth = $(window).outerWidth() * 0.25 * 0.5; // 200
    console.log($('#imagegallery img').length)
    // set the number of column
    let column = 2;

    // height array
    let heightArr = [];
    for (let i = 0; i < column; i++) {
        heightArr[i] = 0;
    }

    // iterating and positioning
    $.each($('#imagegallery img'), function (index, item) {
        // current heiight
        let itemHeight = $(item).outerHeight();
        // minimum height
        let minHeight = Math.min(...heightArr);
        // the index of which has the minimum height
        let minIndex = heightArr.indexOf(minHeight);

        $(item).css({
            position: 'absolute',
            width: imgWidth,
            top: minHeight + 'px',
            left: minIndex * imgWidth + 'px'
        });
        
        heightArr[minIndex] += itemHeight;
    });
}
// window size change
$(window).resize(function () {
    waterfallHandler();
});
