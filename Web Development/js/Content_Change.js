var CoverSL = ["#F1", "#F2", "#F3"];
var FeaNum = ["1", "2", "3"];
// 1. Click on Cover

// 1.1 Change Cover
$(document).ready(function () {
    $.each(CoverSL, function (i1, v1) {
        $(v1)[0].addEventListener('click', function () {   // mind the difference of jquery object and dom object
            if(i1 == 1){ CollaborationPlotting()};
            
            // the selected
            $(v1).css({ "background": "linear-gradient(to right, #454a6400, #f1ece4 50%, #454a6400)", "color": "#454a64" });


            // the rest
            $.each($.grep(CoverSL, function (temp) {
                return temp != v1;
            }), function (i2, v2) {
                $(v2).css({ "background": "transparent", "color": "#f1ece4" });
            });
        });
    });
});



// 1.2 Change Trans
$(document).ready(function () {
    $.each(FeaNum, function (i1, v1) {
        $("#F" + v1)[0].addEventListener('click', function () {
            // the selected
            $(".S" + v1).css("color", "#a55407");

            // the rest
            $.each($.grep(FeaNum, function (temp) {
                return temp != v1;
            }), function (i2, v2) {
                $(".S" + v2).css("color", "#454a64");
            });
        });
    });
});



// 1.3 change Content
$(document).ready(function () {
    $.each(FeaNum, function (i1, v1) {
        $("#F" + v1)[0].addEventListener('click', function () {
            // the selected
            if (v1 == "3") { setTimeout(waterfallHandler, 300); };
            $("#Feature" + v1).css("display", "block");
            $("#Text" + v1).css("display", "block");
            // the rest
            $.each($.grep(FeaNum, function (temp) {
                return temp != v1;
            }), function (i2, v2) {
                $("#Feature" + v2).css("display", "none");
                $("#Text" + v2).css("display", "none");
            });
        });
    });
});



// // 1.4 change analysis
// $(document).ready(function () {
//     $.each(FeaNum, function (i1, v1) {
//         $("#F" + v1)[0].addEventListener('click', function () {
//             // the selected
//             $("#Me" + v1).css("display", "block");
//             $("#Cht" + v1).css("display", "block");
//             // the rest
//             $.each($.grep(FeaNum, function (temp) {
//                 return temp != v1;
//             }), function (i2, v2) {
//                 $("#Me" + v2).css("display", "none");
//                 $("#Cht" + v2).css("display", "none");
//             });
//         });
//     });
// });







// Click on Trans 1

// 2.1 change itself and Cover
$(document).ready(function () {
    for (var i = 0; i < 1; i++) {
        $.each(FeaNum, function (i1, v1) {
            document.getElementsByClassName("S" + v1)[i].addEventListener('click', function () {
                // the selected
                if(i1 == 1){ CollaborationPlotting()};
                $(".S" + v1).css("color", "#a55407");
                $("#F" + v1).css({ "background": "linear-gradient(to right, #454a6400, #f1ece4 50%, #454a6400)", "color": "#454a64" });

                // the rest
                $.each($.grep(FeaNum, function (temp) {
                    return temp != v1;
                }), function (i2, v2) {
                    $(".S" + v2).css("color", "#454a64");
                    $("#F" + v2).css({ "background": "transparent", "color": "#f1ece4" });
                });
            });
        });
    };
});


// 2.2 change Content
$(document).ready(function () {
    for (var i = 0; i < 1; i++) {
        $.each(FeaNum, function (i1, v1) {
            document.getElementsByClassName("S" + v1)[i].addEventListener('click', function () {
                // the selected
                if (v1 == "3") { setTimeout(waterfallHandler, 300); };
                $("#Feature" + v1).css("display", "block");
                $("#Text" + v1).css("display", "block");
                // the rest
                $.each($.grep(FeaNum, function (temp) {
                    return temp != v1;
                }), function (i2, v2) {
                    $("#Feature" + v2).css("display", "none");
                    $("#Text" + v2).css("display", "none");
                });
            });
        });
    };
});


// Click on Trans 2
// 3.1 change itself
$(document).ready(function () {
    for (var i = 0; i < 1; i++) {
        $.each(FeaNum, function (i1, v1) {
            document.getElementsByClassName("C" + v1)[i].addEventListener('click', function () {
                // the selected
                $(".C" + v1).css("color", "#a55407");
                $("#Me" + v1).css("display", "block");
                $("#Cht" + v1).css("display", "block");
                // the rest
                $.each($.grep(FeaNum, function (temp) {
                    return temp != v1;
                }), function (i2, v2) {
                    $(".C" + v2).css("color", "#454a64")
                    $("#Me" + v2).css("display", "none");
                    $("#Cht" + v2).css("display", "none");
                });
            });
        });
    };
});







