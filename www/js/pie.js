app.pieChart = function (data,domID) {
    var labelName = [];
    for(i in data){
        labelName.push(data[i].name);
    };
    var legLabel = []
    for(var i = 0 ; i < labelName.length ; i++){
        var leg = {};
        leg.name = labelName[i];
        leg.icon = "bar";
        leg.textStyle = {fontSize : 12};
        legLabel.push(leg);     
    };
    var myChart = echarts.init(document.getElementById(domID),'infographic'); 
    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b}:{c}",
            textStyle : {
                fontSize : '12'
            }
        },
        legend: {
            orient : 'horizontal',
            x : 'left',
            y : '54%',
            data: legLabel
        },
        series : [
            {
                type:'pie',
                radius : '50%',
                center: ['50%', '28%'],
                data:data,
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }               
                }
            }
        ]
    };
    myChart.setOption(option);
}

