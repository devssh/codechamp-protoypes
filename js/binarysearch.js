function binarySearchAPI(dataSet, elementToBeSearched) {
    return binarySearch(dataSet, 0, dataSet.length, elementToBeSearched)
}
function binarySearch(list, low, high, key) {
    var interval = setInterval(function() {
        update(list.slice(low, high + 1))
        var mid = parseInt(low + (high - low) / 2)
        highlightMid(list, mid)
        if (low < high) {
            if (list[mid] < key) {
                low = mid + 1;
            }
            else if (list[mid] > key) {
                high = mid - 1;
            }
            else {
                low = mid
                high = mid
                return mid
            }
        }
        else if (low == high && key == list[low]) {
            clearInterval(interval)
        }
        else {
            update([":("])
            clearInterval(interval)
            return - 1
        }
    }, 3000)
}

function highlightMid(list, index) {
    var elements = g.selectAll("text")
    var text = g.select("text:nth-child(" + (index + 1) + ")")
    console.log(elements.size());
    console.log(index);
    console.log(text.size());
    text.attr("class", "update")
        .style("fill-opacity", 1)
}

function update(data) {
    // console.log(data);
    var t = d3.transition()
        .duration(750);

    // JOIN new data with old elements.
    var text = g.selectAll("text")
        .data(data, function(d) { return d; });

    // EXIT old elements not present in new data.
    text.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("y", 60)
        .style("fill-opacity", 1e-6)
        .remove();

    // ENTER new elements present in new data.
    text.enter().append("text")
        .attr("class", "enter")
        .attr("dy", ".35em")
        .attr("y", -60)
        .attr("x", function(d, i) {
            return i * 50;
        })
        .style("fill-opacity", 1e-6)
        .text(function(d) {
            return d;
        })
        .transition(t)
        .attr("y", 0)
        .style("fill-opacity", 1);
}
