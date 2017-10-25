app.roseChart = function (data,domID) {
    var labelName = [];
    for(i in data){
        labelName.push(data[i].name);
    };
    var legLabel = []
    for(var i = 0 ; i < labelName.length ; i++){
        var leg = {};
        leg.name = labelName[i];
        leg.textStyle = {fontSize : 12};
        legLabel.push(leg);     
    };
    var myChart = echarts.init(document.getElementById(domID),'infographic'); 
    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b}:{c}"
        },
        legend: {
            orient : 'horizontal',
            x : 'left',
            y : 'bottom',
            data:legLabel
        },
        series : [
            {
                type:'pie',
                radius : [20, 75],
                center : ['50%', '35%'],
                roseType : 'radius',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                data:data
            }
        ]
    };
    myChart.setOption(option);
    myChart.on("click",function(data){
        $(".Pointplot").empty();
        var proName = data.name;
        var proData = [];
        var proArray = [];
        if(app.idx == "low"){
            var subPieData = app.lowData;
        }else if(app.idx == "high"){
            var subPieData = app.highData;
        }else{
            var subPieData = app.safeData;
        };
        var val = $('input:radio[name="globalRadio"]').val();
        for(var i = 0 ; i < subPieData.length; i++){
            if(subPieData[i].CATEGORY[0] == val && subPieData[i].SAMPLECATEGORY[0] == proName){
                proData.push(subPieData[i])
            }
        };
        var sampleName = [];
        var newObj = {};
        for(var i = 0 ; i < proData.length ; i++){
            var newArray = [];
            var subNewObj = {};
            subNewObj.DETECTIONITEM = proData[i].DETECTIONITEM;
            subNewObj.TOXICITY = proData[i].TOXICITY;
            subNewObj.DETECTIONRESULTS = proData[i].DETECTIONRESULTS
            newObj[proData[i].SAMPLENAME[0] + (i+1)] = subNewObj;
        }
        var labels_x = _.keys(newObj);
        var labels_y = [];
        for(var i in newObj){
            for(var j = 0 ; j < newObj[i].DETECTIONITEM.length ; j++){
                labels_y.push(newObj[i].DETECTIONITEM[j]);
            }
        }
        labels_y = _.uniq(labels_y);
        var tempD2 = [];
        for(var i = 0 ; i < labels_x.length ; i++){
            for(var j = 0 ; j < labels_y.length; j++){
                var tempD = [];
                tempD.push(i,j);
                var detectItem = newObj[labels_x[i]].DETECTIONITEM;
                var detectResults = newObj[labels_x[i]].DETECTIONRESULTS;
                var count = 0;
                for(var k = 0 ; k < detectItem.length ; k++){
                    if(detectItem[k] == labels_y[j]){
                        tempD.push(+detectResults[k]);
                        break;
                    }else{
                        count++;
                    }
                };
                if(count == detectItem.length){
                    tempD.push(0);
                }
                tempD2.push(tempD);
            }
        };
        var adsad = []
        for(var i = 0 ; i < tempD2.length;i++){
            adsad.push(tempD2[i][2]);
        };
        var barCol = [];
        for(var i = 0 ; i < labels_y.length ; i++){
            var num = 0 ;
            for(var j = 0 ; j < labels_x.length ; j++){
                var detectItem = newObj[labels_x[j]].DETECTIONITEM;
                if(_.contains(detectItem, labels_y[i])){
                    num++;
                }
            }
            barCol.push(num);
        };
        var barRow = [];
        for(var i = 0 ; i < labels_x.length ; i++){
            barRow.push(newObj[labels_x[i]].DETECTIONITEM.length)
        };
        app.pointChart({
            "cols" : labels_y,
            "rows" : labels_x,
            "id" : "Pointplot",
            "data" : tempD2,
            "min"  : _.min(adsad),
            "max" : _.max(adsad),
            "barCol" : barCol,
            "barRow" : barRow
        });
        app.sidebars.point.toggle()
    })
}
