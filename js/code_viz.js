'use strict'

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/python");

function visualize() {

    var send = {
        "user_script": editor.getValue(),
        "user_uuid": "39a54027-8a29-4ec8-9859-a8f14ca0d9f2",
        "session_uuid": "",
        "diffs_json": "{}",
        "raw_input_json": "",
        "options_json": '{"cumulative_mode":false,"heap_primitives":false,"show_only_outputs":false,"origin":"opt-frontend.js"}'
    };

    $.post("/cgi-bin/web_exec_py2.py", send, function (data) {
        var codeResponse = JSON.parse(data);
        visualizeTrace(codeResponse["trace"]);
    });

    d3.select("#visualize").selectAll("svg").remove();
    var svg = d3.select("#visualize").append("svg").style("width", "46em").style("height", "43em").style("background", "#eee");
    var all_frames = svg.append("g").attr("id", "main_group");
    var global_frame = all_frames.append("g").attr("id", "global_frame_group");
    var elements_in_global_frame = global_frame.append("g").attr("class", "elements_group");

    global_frame.append("circle").attr("cx", 300).attr("cy", 300).attr("r", 250);
    function visualizeTrace(trace) {
        var index = 0;
        var renderInterval = setInterval(function () {
            if (index == trace.length - 1) {
                clearInterval(renderInterval);
            }
            renderCurrentStep(trace[index]);
            index += 1;
        }, 2000)
    }

    function renderCurrentStep(currentStep) {

        renderGlobalFrame(currentStep["globals"]);

        // Heap
        highlightLine(currentStep["line"]);
    }

    function renderGlobalFrame(globalFrame) {
        var previous_cx = 0;

        elements_in_global_frame.selectAll("circle")
            .data(Object.keys(globalFrame), function (d) {
                return d;
            })
            .enter()
            .append("circle")
            .attr("r", function (d) {
                return d.length * 10;
            })
            .attr("cx", function (d, i) {
                previous_cx+=1;
                return 150 * (2 *(i + 1)) + 2 * d.length * 10;
            })
            .attr("cy", 50)
            .attr("class", "variable_circle");

        console.log(Object.keys(globalFrame));

        elements_in_global_frame.selectAll("text")
            .data(Object.keys(globalFrame), function(d) {return d;})
            .enter()
            .append("text")
            .attr("class", "variable_text")
            .attr("x", function (d, i) {
                return 150 * (i + 1) + d.length * 10 + 150;
            })
            .attr("y", 50)
            .attr("fill", "red")
            .text(function (d) {
                console.log(d);
                return d;
            })

    }

    function highlightLine(lineNumber) {
        $(".ace_line").removeClass("mark-line");
        $(".ace_gutter-cell").removeClass("mark-line");
        $(".ace_line:nth-child(" + lineNumber + ")").addClass("mark-line");
        $(".ace_gutter-cell:nth-child(" + lineNumber + ")").addClass("mark-line");
    }


}