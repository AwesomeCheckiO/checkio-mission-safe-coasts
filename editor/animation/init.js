//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'finish_map';

            var checkioInput = data.in;
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput).replace("[", "(").replace("]", ")") + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new MapSvg($content.find(".explanation")[0]);
            svg.prepare(checkioInput);

            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];

                setTimeout(function() {
                    svg.animate(rightResult);
                }, 1000);


                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });
        function MapSvg(dom) {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var p = 5;
            var cell = 40;

            var map = [];
            var paper;

            var sizeX, sizeY;

            var attrCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};


            this.prepare = function (data) {
                sizeX = p * 2 + cell * data[0].length;
                sizeY = p * 2 + cell * data.length;
                paper = Raphael(dom, sizeX, sizeY);

                for (var row = 0; row < data.length; row++) {
                    var temp = [];
                    for (var col = 0; col < data[row].length; col++) {
                        var c = paper.rect(
                            p + cell * col,
                            p + cell * row,
                            cell, cell).attr(attrCell);
                        if (data[row][col] == "X") {
                            c.attr("fill", colorGrey4);
                        }
                        else if (data[row][col] == "D") {
                            c.attr("fill", colorOrange1);
                        }
                        temp.push(c);
                    }
                    map.push(temp);
                }
            };

            this.animate = function(newData) {
                var step = 500;
                for (var row = 0; row < newData.length; row++) {
                    for (var col = 0; col < newData[row].length; col++) {
                        var c = map[row][col];
                        var symb = newData[row][col];
                        if (symb == "S") {
                            c.animate({"fill": colorBlue2}, step);
                        }
                        else if (symb == "D") {
                            c.animate({"fill": colorOrange1}, step);
                        }
                    }
                }
            }
        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
