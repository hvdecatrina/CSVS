app.d3Chart.matrixSun = function (id,data,color,thickness,r){
	var plot = document.getElementById(id);
	while(plot.hasChildNodes()){
		plot.removeChild(plot.firstChild);
	}
	var width = plot.offsetWidth ;
	console.log(width);
	var height = plot.offsetHeight;
	console.log(height);
	var margin_x = 40;
	var margin_y = 40;
	var max_level = 6;
	var dataAarry = [];
	var svg = d3.select("#" + id).append("svg")
			.attr("width" , width)
			.attr("height" , height)
			.append("g")
			.attr("transform" , "translate(" + width / 2 + "," + height / 2 + ")");
	function process_data(data,level,start,stop){
		var name = data[0];
		var total = data[1];
		var children = data[2];
		var current = start;
		var rgb = data[3]
		if(level > max_level){
			return;
		}	
		if(start == stop){
			return;
		}
		if(name == "LOW"){
			dataAarry.push([start,stop,name,level,data[1],data[3]]);
			for(key in children){
				var child = children[key][2];
				var angel = (stop - start) * (children[key][1] / total);
				var child_start = current;
				var child_stop = current + angel;
				var span = child_stop - child_start;
				var idx = child_start;
				for(i in child){
					var child_c = child[i];
					var name = child_c[0]
					var angel = (child_stop-child_start) * (child_c[1] / children[key][1]);
					var child_c_start = idx;
					idx = child_c_start + angel;
					var child_c_stop = idx;
					dataAarry.push([child_c_start,child_c_stop,name,level+1,child_c[1],child_c[3]])
				}
				level = level + 1;
			}
			if(level >= 6){
				return;
			}
		}else{
			dataAarry.push([start,stop,name,level,data[1],data[3]]);
			for(key in children){
				var child = children[key];
				var angel = (stop - start) * (child[1] / total);
				if(key == "Border"){
					var cst = current;
					var csp = cst + angel;
					process_data(child,level+1,cst,csp)
				}else{
					var child_start = current;
					current += angel;
					var child_stop = current;
					var span = child_stop - child_start;
					if(key == "LOW"){
						sObj = child_start;
						eObj = child_stop;
					};
					process_data(child,level+1,child_start,child_stop);
				}
			}
		}
		
	};
	process_data(data,0,0,360 / 180 * Math.PI);
    var arc = d3.svg.arc()
	    .startAngle(function(d) {;return d[0]})
	    .endAngle(function(d) {return d[1]})
	    .innerRadius(function(d) {if(d[3] == 0 || d[3] == 1 || d[2] == "Border"){return 0;};return (d[3]-2) * thickness + r; })
	    .outerRadius(function(d) {if(d[3] == 0){return 0;};if(d[2] == "Border"){return 6 * thickness + r};return (d[3]-1) * thickness + r; });
    var tip = d3.tip()
    	.attr('class', 'd3-tip')
		.html(function(d) {
			return "<strong>" + d[2] + ":</strong> <span>" + d[4] + "</span>";
		});
	svg.call(tip);
	console.log(1);
    var slices = svg.selectAll(".form")
        .data(function(d) { return dataAarry; })
        .enter()
        .append("g");
        slices.append("path")
        .attr("d", arc)
        .attr("id",function(d,i){
        	if(d[2] == "LOW"){
        		return id + "Low"
        	}else if(d[2] == "HIGH"){
        		return id + "High"
        	}else if(d[2] == "SAFE"){
        		return id + "Safe"
        	}else{
        		return d[2]
        	}})
        .style("fill", function(d) { return color(d);})
        .style("stroke",function(d){if(d[2] == "Border"){return "Black"}})
        .attr("class","form")
        .on('mouseover', tip.show)
  		.on('mouseout', tip.hide)
}
app.d3Chart.matrixSun_plot = function (id,data,thickness,r){
    var color = d3.scale.category20c();
    d3.select(self.frameElement).style("height", "800px");
    app.d3Chart.matrixSun(id,data,app.d3Chart.color_function,thickness,r)
}
