/*globals ace:true*/

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/python");

function visualize() {
    'use strict';

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
        visualizeTrace(codeResponse.trace);
    });

    d3.select("#visualize").selectAll("svg").remove();
    var svg = d3.select("#visualize")
                .append("svg")
                .style("width", "46em")
                .style("height", "43em")
                .style("background", "#eee");
    svg.append("g").attr("id", "global_vars").attr("transform", "translate(20, 20)");


    function visualizeTrace(trace) {
        var index = 0;
        var renderInterval = setInterval(function () {
            if (index == trace.length - 1) {
                clearInterval(renderInterval);
            }
            renderCurrentStep(trace[index]);
            index += 1;
        }, 2000);
    }

    function renderCurrentStep(currentStep) {
        renderGlobalFrame(currentStep.globals, currentStep.ordered_globals);

        // Heap

        highlightLine(currentStep.line);
    }

    function renderGlobalFrame(globalFrame, globalKeys) {
        console.log(globalFrame);
        var text = d3.select("#global_vars")
                      .selectAll("text")
                      .data(globalKeys);
        var rects = d3.select("#global_vars")
                      .selectAll("rect")
                      .data(globalKeys);
        rects.enter()
             .append("rect")
             .attr("class", "global_var_rect")
             .attr("x", "0")
             .attr("y", function(d,i) { return i * 40; })
             .attr("width", function(d) { return 30 + 10 * (d+" = "+globalFrame[d]).length;})
             .attr("height", "30");
        text.enter()
            .append("text")
            .attr("class", "global_var_text")
            .attr("dx", "17")
            .attr("dy", function(d,i) { return 19 + i * 40; })
            .text(function(d) { return d + " = " + globalFrame[d]; });
    }

    function highlightLine(lineNumber) {
        $(".ace_line").removeClass("mark-line");
        $(".ace_gutter-cell").removeClass("mark-line");
        $(".ace_line:nth-child(" + lineNumber + ")").addClass("mark-line");
        $(".ace_gutter-cell:nth-child(" + lineNumber + ")").addClass("mark-line");
    }


}
