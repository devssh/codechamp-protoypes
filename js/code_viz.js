/* jshint esversion:6 */

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

    function visualizeTrace(trace) {
        svg.append("g").attr("id", "global_vars").attr("transform", "translate(20, 20)");
        svg.append("g").attr("id", "heap").attr("transform", "translate(300, 20)");
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
        drawLines();
        highlightLine(currentStep.line);
    }

    var linePointsMap = {};

    svg.append("marker").attr("id", "arrow-head").attr("viewBox", "0 0 10 10").attr("refX", "0").attr("refY", "5").attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "8")
        .attr("markerHeight", "6")
        .attr("orient", "auto")
        .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");

    // type here is if the point is being added from stack/ global frame or heap
    // type can be "heap" or "frame"
    function addPointsToMap(heapKey, type, xValue, yValue) {
        if (!(heapKey in linePointsMap)) {
            linePointsMap[heapKey] = {};
        }
        if (type === "heap") {
            linePointsMap[heapKey].x2 = xValue;
            linePointsMap[heapKey].y2 = parseInt(yValue) + 15;
        }
        else if (type === "frame") {
            linePointsMap[heapKey].x1 = xValue;
            linePointsMap[heapKey].y1 = parseInt(yValue) + 15;
        }
    }

    function drawLines() {
        // Only For now
        var linePointKeys = Object.keys(linePointsMap).filter(function (d) {
            return "x1" in linePointsMap[d];
        });

        var lines = svg.selectAll("line")
            .data(linePointKeys);

        lines.enter()
            .append("line")
            .attr("x1", function (d) {
                return parseInt(linePointsMap[d].x1);
            })
            .attr("y1", function (d) {
                return parseInt(linePointsMap[d].y1) + 20;
            })
            .attr("x2", function (d) {
                return parseInt(linePointsMap[d].x2) - 8;
            })
            .attr("y2", function (d) {
                return parseInt(linePointsMap[d].y2) + 20;
            })
            .attr("stroke-width", "2")
            .attr("stroke", "blue")
            .attr("marker-end", "url(#arrow-head)");
    }

    function renderHeap(heap, orderedHeap) {

        function getSortedHeapKeys() {
            return Object.keys(heap).sort((a, b) => parseInt(a) < parseInt(b) ? -1 : 1);
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
                    }).join(", ") + "}";
            }
        }

        var filteredHeapKeys = getSortedHeapKeys().filter(function (d) {
            return orderedHeap.indexOf(d) < 0;
        });
        orderedHeap = orderedHeap.concat(filteredHeapKeys);

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
                var yPosition = i * 40;
                addPointsToMap(d, "heap", 300, yPosition);
                return yPosition;
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
            .selectAll("rect.global_var_rect")
            .data(globalKeys);


        rects.enter()
            .append("rect")
            .attr("class", "global_var_rect")
            .attr("x", function (d) {
                if (typeof globalFrame[d] == "object") {
                    return 30 + 10 * d.length;
                }
                return 15 + 10 * ((d + " ").length + 0.5);
            })
            .attr("y", function (d, i) {
                return i * 40;
            })
            .attr("width", function (d, i) {
                if (typeof globalFrame[d] == "object") {
                    var width = 30 + 10 * d.length;
                    addPointsToMap(globalFrame[d][1], "frame", 20 + width, i * 40);
                    return width / 2;
                }
                return 30 + 10 * (" " + globalFrame[d]).length - (15 + 10 * ((d + " ").length + 0.5));
            })
            .attr("height", "30");

        var nameRectangles = d3.select("#global_vars")
            .selectAll("rect.global_var_name_rect")
            .data(globalKeys);

        nameRectangles
            .enter()
            .append("rect")
            .attr("class", "global_var_name_rect")
            .attr("x", "0")
            .attr("y", function (d, i) {
                return i * 40;
            })
            .attr("width", function (d, i) {
                console.log("hey" + d);
                if (typeof globalFrame[d] == "object") {
                    return 30 + 10 * d.length;
                }
                return 15 + 10 * ((d + " ").length + 0.5);
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
