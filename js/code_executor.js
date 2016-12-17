'use strict'

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/python");

function visualized() {

    var send = {
        "user_script": editor.getValue(),
        "user_uuid": "39a54027-8a29-4ec8-9859-a8f14ca0d9f2",
        "session_uuid": "",
        "diffs_json": "{}",
        "raw_input_json": "",
        "options_json": '{"cumulative_mode":false,"heap_primitives":false,"show_only_outputs":false,"origin":"opt-frontend.js"}'
    }

    $.post("/cgi-bin/web_exec_py2.py", send, function (data) {
        var codeResponse = JSON.parse(data);
        visualizeTrace(codeResponse["trace"]);
    });


    d3.select("#visualize").selectAll("svg").remove();
    var svg = d3.select("#visualize").append("svg").attr("width", 1000).attr("height", 100),
        global = svg.append("g")

    function visualizeTrace(trace) {
        var globalData = trace.map(function (element) {
            return element["globals"]
        });
        globalFrameRender(globalData);
    }

    function globalFrameRender(data) {
        var element = 0
        var intervalD3 = setInterval(function () {
            console.log(element == data.length, data.length, element);
            if (element == data.length - 1) {
                clearInterval(intervalD3);
            }
            var globalObject = data[element];
            var text = global.selectAll("text")
                             .data([globalObject], function (d) {
                                 return JSON.stringify(d["a"]);
                             });

            text.exit()
                .attr("class", "exit")
                .attr("y", 60)
                .remove();

            text.enter()
                .append("text")
                .attr("y", 60)
                .attr("x", function(d, i) { return i * 100; })
                .text(function(d) {
                    return JSON.stringify(d);
                });

            element = element + 1;
        }, 1000);
    }


}