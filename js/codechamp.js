
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

var data = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90];

var the_svg = d3.select("#visualize").append("svg").attr("width", 1000).attr("height", 100),
    width = +the_svg.attr("width"),
    height = +the_svg.attr("height"),
    g = the_svg.append("g").attr("transform", "translate(32," + (height / 2) + ")");
