function binarySearchAPI(dataSet, elementToBeSearched) {
    return binarySearch(dataSet, 0, dataSet.length, elementToBeSearched)
}

function update(data) {
    var t = d3.transition()
        .duration(750);

    // JOIN new data with old elements.
    var text = g.selectAll("text")
        .data(data, function(d) {
            return d;
        });

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
