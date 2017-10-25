app.d3Chart = {};
app.d3Chart.color_function = function (d){
	return d3.rgb(d[5]);
}
app.d3Chart.sunbusrt_plot = function (id,data,color){
	var plot = document.getElementById(id);
	while(plot.hasChildNodes()){
		plot.removeChild(plot.firstChild);
	}
	var width = plot.offsetWidth ;
	var height = plot.offsetHeight;
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
    var thickness = width / 10;
    var arc = d3.svg.arc()
	    .startAngle(function(d) {;return d[0]})
	    .endAngle(function(d) {return d[1]})
	    .innerRadius(function(d) {if(d[3] == 0 || d[3] == 1 || d[2] == "Border"){return 0;};return (d[3]-2) * 15 + thickness; })
	    .outerRadius(function(d) {if(d[3] == 0){return 0;}else if(d[2] == "Border"){return 6 * 15 + thickness};return (d[3]-1) * 15 + thickness; });
    var tip = d3.tip()
    	.attr('class', 'd3-tip')
		.html(function(d) {
			return "<strong>" + d[2] + ":</strong> <span>" + d[4] + "</span>";
		});
	svg.call(tip);
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
        		return id+i
        	}})
        .style("fill", function(d) { return color(d);})
        .style("stroke",function(d){if(d[2] == "Border"){return "Black"}})
        .attr("class","form")
        .on('mouseover', tip.show)
  		.on('mouseout', tip.hide)
    	var low = svg.select("#plotSunLow");
    	var high = svg.select("#plotSunHigh");
    	var safe = svg.select("#plotSunSafe");
    	low.on("click", function(){
    		app.sidebars.subPie.toggle();
    		$('input:radio[name="globalRadio"]').val("");
    		var obj = typeF(app.lowData);  
    		app.lowObj = obj.typeList;
    		tplF(app.lowObj);
    		radioChange(app.lowData);
    		$(".safe circle").css("display","block");
    		$(".safe rect").css("display","none");
    		$(".low circle").css("display","none");
    		$(".low rect").css("display","block");
    		$(".high circle").css("display","block");
    		$(".high rect").css("display","none");
    		app.idx = "low";
    	});
    	high.on("click" , function () {
    		app.sidebars.subPie.toggle();
    		$('input:radio[name="globalRadio"]').val("");
    		var obj = typeF(app.highData);  
    		app.highObj = obj.typeList;
    		tplF(app.highData);
    		radioChange(app.highData);
    		$(".safe circle").css("display","block");
    		$(".safe rect").css("display","none");
    		$(".low circle").css("display","block");
    		$(".low rect").css("display","none");
    		$(".high circle").css("display","none");
    		$(".high rect").css("display","block");
    		app.idx = "high";
    	});
    	safe.on("click" , function () {
    		app.sidebars.subPie.toggle();
    		$('input:radio[name="globalRadio"]').val("");
    		var obj = typeF(app.safeData);  
    		app.safeObj = obj.typeList;
    		tplF(app.safeData);
    		radioChange(app.safeData);
    		$(".safe circle").css("display","none");
    		$(".safe rect").css("display","block");
    		$(".low circle").css("display","block");
    		$(".low rect").css("display","none");
    		$(".high circle").css("display","block");
    		$(".high rect").css("display","none");
    		app.idx = "safe";
    	})
}
app.d3Chart.init_plot = function (data){
    var color = d3.scale.category20c();
    d3.select(self.frameElement).style("height", "800px");
    app.d3Chart.sunbusrt_plot("plotSun",data,app.d3Chart.color_function)
}
function typeF(data){
	var type = [];
    var subtype = [];
	for(var i = 0 ; i < data.length ; i++){
		type.push(data[i].CATEGORY[0]);
		subtype.push(data[i].SAMPLECATEGORY[0])
	};
	typeList = _.uniq(type);
	subTypeList = _.uniq(subtype);
	return({"typeList" : typeList , "subTypeList" : subTypeList});
}
function tplF(appobj){  
    $('.chart').empty();
	$('.chart').html(_.template($('#radioTPL').html(),appobj));
}
function radioChange(data){
	$('input:radio[name="globalRadio"]').change( function(){
		var value = $(this).val();
		var category = [];
		for(var i = 0 ; i < data.length ; i++){
			if(data[i].CATEGORY[0] == value){
				category.push(data[i].SAMPLECATEGORY[0])
			}
		};
		var category_2 = _.uniq(category);
		var categoryArry = [];
		for(var i = 0 ; i < category_2.length ; i++){
			var count = 1 ;
			var categoryJson = {};
			for(var j = 0 ; j < category.length ; j++){
				if(category_2[i] == category[j]){
					count++;
				}
			}
			categoryJson.value = count-1;
			categoryJson.name = category_2[i];
			categoryArry.push(categoryJson)
		}
		$("#pieB").empty();
		$("#pieB").css({
			"height" : 237
		})
		app.roseChart(categoryArry,"pieB")
	})
}
