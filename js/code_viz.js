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
        .append("svg");

    // TODO: Change height of svg based on number of elements

    svg.append("g").attr("id", "global_vars").attr("transform", "translate(20, 20)");
    svg.append("g").attr("id", "heap").attr("transform", "translate(300, 20)");

    function visualizeTrace(trace) {
        var index = 0;
        var renderInterval = setInterval(function () {
            if (index == trace.length - 1) {
                clearInterval(renderInterval);
            }
            renderCurrentStep(trace[index]);
            index += 1;
        }, 500);
    }

    function renderCurrentStep(currentStep) {
        var orderedHeap = renderGlobalFrame(currentStep.globals, currentStep.ordered_globals);

        renderHeap(currentStep.heap, orderedHeap);

        highlightLine(currentStep.line);
    }

    function renderHeap(heap, orderedHeap) {

        function getSortedHeapKeys() {
            return Object.keys(heap).map(function (d) {
                return parseInt(d);
            }).sort().map(function(d) {return d.toString();})
        }


        function stringify(type, arr) {
            if (type == "LIST") {
                return "LIST => [" + arr.join(", ") + "]";
            } else if (type == "SET") {
                return "SET => {" + arr.join(", ") + "}";
            } else if (type == "TUPLE") {
                return "TUPLE => (" + arr.join(", ") + ")";
            } else if (type == "DICT") {
                return "DICT => {" + arr.map(function (data) {
                        return data[0] + ":" + data[1];
                    }).join(", ") + "}"
            }
        }

        var filteredHeapKeys = getSortedHeapKeys().filter(function (d) {
            return orderedHeap.indexOf(d) < 0;
        });
        var orderedHeap = orderedHeap.concat(filteredHeapKeys);

        var text = d3.select("#heap")
            .selectAll("text")
            .data(orderedHeap);
        var rects = d3.select("#heap")
            .selectAll("rect")
            .data(orderedHeap);

        rects.enter()
            .append("rect")
            .attr("class", "heap_rect")
            .attr("x", "0")
            .attr("y", function (d, i) {
                return i * 40;
            })
            .attr("width", function (d) {
                return 30 + 10 * stringify(heap[d][0], heap[d].slice(1)).length;
            })
            .attr("height", "30");

        text.enter()
            .append("text")
            .attr("class", "heap_text")
            .attr("dx", "17")
            .attr("dy", function (d, i) {
                return 19 + i * 40;
            })
            .text(function (d) {
                return stringify(heap[d][0], heap[d].slice(1));
            });

        rects.attr("width", function (d) {
            return 30 + 10 * stringify(heap[d][0], heap[d].slice(1)).length;
        });

        text.text(function (d) {
            return stringify(heap[d][0], heap[d].slice(1));
        });
    }

    function renderGlobalFrame(globalFrame, globalKeys) {
        var orderedHeapKeys = [];
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
            .attr("y", function (d, i) {
                return i * 40;
            })
            .attr("width", function (d) {
                if (typeof globalFrame[d] == "object")
                    return 30 + 10 * d.length;
                return 30 + 10 * (d + " = " + globalFrame[d]).length;
            })
            .attr("height", "30");

        text.enter()
            .append("text")
            .attr("class", "global_var_text")
            .attr("dx", "17")
            .attr("dy", function (d, i) {
                return 19 + i * 40;
            })
            .text(function (d) {
                if (typeof globalFrame[d] == "object")
                    return d;
                return d + " = " + globalFrame[d];
            });

        rects.attr("width", function (d) {
            if (typeof globalFrame[d] == "object") {
                orderedHeapKeys.push("" + globalFrame[d][1]);
                return 30 + 10 * d.length;
            }
            return 30 + 10 * (d + " = " + globalFrame[d]).length;
        });
        text.text(function (d) {
            if (typeof globalFrame[d] == "object")
                return d;
            return d + " = " + globalFrame[d];
        });

        return orderedHeapKeys;
    }

    function highlightLine(lineNumber) {
        $(".ace_line").removeClass("mark-line");
        $(".ace_gutter-cell").removeClass("mark-line");
        $(".ace_line:nth-child(" + lineNumber + ")").addClass("mark-line");
        $(".ace_gutter-cell:nth-child(" + lineNumber + ")").addClass("mark-line");
    }


}
