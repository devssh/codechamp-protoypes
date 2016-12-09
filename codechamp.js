var pre = ace.edit("pre");
pre.setTheme("ace/theme/monokai");
pre.getSession().setMode("ace/mode/javascript");
pre.setValue("var data = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90];");
pre.setReadOnly(true);

var post = ace.edit("post");
post.setTheme("ace/theme/monokai");
post.getSession().setMode("ace/mode/javascript");
post.setValue("binarySearch(data, 0, data.length, elementToBeSearched);");
post.setReadOnly(true);

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setValue("function binarySearch(list, low, high, key) {\n"+
"    var interval = setInterval(function() {\n"+
"        update(list.slice(low, high + 1))\n"+
"        console.log(low, high);\n"+
"        if (low < high) {\n"+
"            var mid = parseInt((low + high) / 2)\n"+
"            if (list[mid] < key) {\n"+
"                low = mid + 1;\n"+
"            } else if (list[mid] > key) {\n"+
"                high = mid - 1;\n"+
"            } else {\n"+
"                low = mid\n"+
"                high = mid\n"+
"                return mid\n"+
"            }\n"+
"        } else if (low == high && key == list[low]) {\n"+
"            clearInterval(interval)\n"+
"        } else {\n"+
"            update([\"Not Found\"])\n"+
"            clearInterval(interval)\n"+
"            return -1\n"+
"        }\n"+
"    }, 2000)\n"+
"}\n");

var data = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90];

var the_svg = d3.select("#visualize").append("svg").attr("width", 1000).attr("height", 100),
    width = +the_svg.attr("width"),
    height = +the_svg.attr("height"),
    g = the_svg.append("g").attr("transform", "translate(32," + (height / 2) + ")");


$('#search').click(function() {
  binarySearch = eval("("+editor.getValue()+")");
  binarySearchAPI(data, 99);
});
