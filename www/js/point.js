app.pointChart = function (options) {
    var cols = options.cols;
    var rows = options.rows;
    var id = options.id;
    var data = options.data;
    var min = options.min;
    var max = options.max;
    var barCol = options.barCol;
    var barRow = options.barCol
    data = data.map(function (item) {
        return [item[1], item[0], item[2]];
    });
    var myChart = echarts.init(document.getElementById(id)); 
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {top: 10};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            },
            extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        grid: [
            {
                left: 60,
                right: 10,
                height:60,
                top: 0
            },
            {
                left: 2,
                right: 10,
                top:60,
                containLabel: true
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: cols,
                boundaryGap : false,
                splitLine: {show: false},
                axisLabel: {show: false},
                axisTick: {show: false}
            },
            {
                type: 'category',
                data: cols,
                gridIndex: 1,
                boundaryGap: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#999',
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: true
                },
                 axisLabel :{  
                    interval:0,
                    rotate : 25 
                }
            }
        ],
        yAxis: [
            {
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            },
            {
                type: 'category',
                gridIndex: 1,
                data: rows,
                axisLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: 'Volumn',
                type: 'bar', 
                data: barCol,
                itemStyle: {
                    normal: {
                        color: '#7fbe9e'
                    },
                    emphasis: {
                        color: '#140'
                    }
                }
            },
            {
                name: 'DetectItems',
                type: 'scatter',
                xAxisIndex: 1,
                yAxisIndex: 1,
                symbolSize: function (val) {
                    if(val[2] == 0){
                        return 0;
                    }else{
                        var a = 20 / (max - min);
                        var b = 10 - a * min;
                        var c = a*val[2] + b;
                        return c; 
                    }
                },
                data: data,
                animationDelay: function (idx) {
                    return idx * 5;
                },
                tooltip: {
                    formatter: function (param) {
                        param = param[0];
                        return param.data[2];
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}

