import extend from './utils/extend';
import EchartBase from './base/EchartBase';
import React, { Component, PropTypes } from 'react';
class BBDGauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currIndex: -1
        };
    }
    setOption(param){
        const option = {
            title:
            {
                top: 20,
                text: '2017年1月-10月累计销量',
                x: 'center',
                y: 'top',
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bolder'
                }
            },
            series: [
                {
                    name: param.series[0].data.name,
                    type: 'gauge',
                    min: param.series[0].min,
                    max: param.series[0].max,
                    splitNumber: param.series[0].splitNumber,
                    radius: '65%',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#77efd8'
                            }, {
                                offset: 1,
                                color: '#22b8b4'
                            }], false),
                            shadowBlur: 12,
                            shadowColor: 'rgba(119,238,239,0.6)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 2
                        }  
                    },
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            shadowColor: '#1cb1b0', // 默认透明
                            shadowBlur: 10,      // 属性lineStyle控制线条样式
                            width: 4,
                            color: [[param.color.colorArea[0], param.color.colorCode[0]],
                            [param.color.colorArea[1], param.color.colorCode[1]],
                            [param.color.colorArea[2], param.color.colorCode[2]]
                            ]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 10,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 16,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: '#fff',
                            width: 3,
                            shadowColor: '#1cb1b0', // 默认透明
                            shadowBlur: 10
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        padding: 3,
                        formatter: function(value) {
                            return Math.round(value / 1000);
                        }
                    },
                    title: {
                        // show: false,
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontSize: 14,
                            fontStyle: 'italic',
                            color: '#fff'
                        }
                    },
                    detail: {
                        width: 110,
                        height: 30,
                        borderColor: '#1CB1B0',
                        borderWidth: 1,
                        borderRadius: 1,
                        fontSize: 18,
                        fontWeight: 'bolder',
                        color: '#21BDBC',
                        lineHeight: 30,
                        offsetCenter: ['0', '98%'],
                        formatter: function (value) {
                            value = (value + '辆');
                            return value;
                        },
                        rich: {
                            value: {  
                            }
                        }
                    },
                    data: [param.series[0].data]
                }
            ]
        };
        let op = extend(true, {}, option, param);
        return op;
    }
    render() {
        return ( 
            <EchartBase option={this.setOption(this.props.option)} style = {this.props.style} />
        );
    }
}
export default BBDGauge;