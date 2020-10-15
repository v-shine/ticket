import echarts from 'echarts'

export const saleOptions = (data, date) => {
    let total = 0;
    data.map((v,k)=>{
        total += +v.value;
    })
    let option = {
        title: {
            text: `${date}总销售额：{num|${total}}`,
            left: 235,
            top: 60,
            textStyle: {
                fontSize: 14,
                color: '#3D3D3D',
                rich: {
                    num: {
                        fontSize: 24
                    }
                }
            },
            
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        color: ['#FF4C23', '#4557FF', '#9C54E5'],
        legend: {
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            orient: 'vertical',
            left: 235,
            top: 114,
            data: ['体彩总销售', '福彩总销售', '高频彩总销售']
        },
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center: [130,140],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: data,
                itemStyle: {
                    borderWidth: 5,
                    borderColor: '#fff'
                }
            }
        ]
    }
    return option;
}

export const saleDayOptions = (data,date) => {
    let option = {
        title: {
          text: `${date}总销售额`,
          left: 'center',
          top: 10,
          textStyle: {
              fontSize: 16
          },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '7%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: [],
            axisLine:{ 
                show:false
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '0%'],
            axisTick: {
                show: false
            },
            splitLine :{    
                lineStyle:{
                    type:'dashed' 
                },
                show:true 
            },
            axisLine:{ 
                show:false
            },
            axisLabel: {
                // formatter: function (val) {
                //     var txt = [];
                //     if(val >= 10000){
                //         txt.push((val/10000).toFixed(1) + '万');
                //     }else{
                //         txt.push(val);
                //     }
                //     return txt;
                // }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        series: [
            {
                type: 'line',
                smooth: true,
                symbol: 'none',
                itemStyle : {
                        normal : {
                            areaStyle : {
                                type : 'default',
                                //渐变色实现
                                color : new echarts.graphic.LinearGradient(0,0,0, 1,//变化度
                                    //三种由深及浅的颜色
                                [ {
                                    offset : 1,
                                    color : 'rgba(69, 87, 255, 0)'
                                }, {
                                    offset : 0.5,
                                    color : 'rgba(69, 87, 255, 0.1)'
                                }, {
                                    offset : 0,
                                    color : 'rgba(69, 87, 255, 0.1)'
                                } ]),
                            },
                            lineStyle : {  //线的颜色
                                color : '#3569FD'
                            },
                            //以及在折线图每个日期点顶端显示数字
                            label: {      
                                  show: true,
                                  position: 'top',
                                  textStyle: {
                                    color: 'white'
                              }
                           }
                        },
                    },
                data: data
            }
        ]
    };
    return option;
}

export const saleTypeOption = (data) => {
    let option = {
        color: ['#4557FF'],
        tooltip: {
            trigger: 'axis',
            
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '7%',
            top: '15%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine:{ 
                    show:false
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: {
                    show: false
                },
                splitLine :{    
                    lineStyle:{
                        type:'dashed' 
                    },
                    show:true 
                },
                axisLine:{ 
                    show:false
                },
            }
        ],
        series: [
            {
                name: '销售额',
                type: 'bar',
                barWidth: '5',
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 2
                    },
                    normal: {
                        barBorderRadius: [2,2,0,0]
                    }
                },
                data: data
            }
        ]
    }
    return option;
}