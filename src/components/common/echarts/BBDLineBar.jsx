/*
* @type 折线柱状组合图
* @author xuyao
*/
import React, { Component } from 'react';
import extend from './utils/extend';
import EchartBase from './base/EchartBase';
class BBDLineBar extends Component {
    constructor(props) {
        super(props);
    }
    setOption(param){
        let series = param.series;
        let seriesItem = '';
        let seriesLength = series.length;
        let seriesData = [];
        for (let i = 0; i < seriesLength; i++) {  
            let seriesItem = {
                'type': series[i].type,
                'symbolSize': 5
            };
            seriesData.push(seriesItem);
        }
        const option = {
            title: {
                show: true,
                link: '',
                target: 'self',
                x: 'center',
                y: 'top',
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                // trigger: 'axis',
                // padding: [10, 10, 10, 10],
                // axisPointer: {
                //     type: 'none'
                // }
            },
            legend: {
                // padding: [15, 0, 0, 0],
                itemGap: 5,
                // itemWidth: 20,
                // itemHeight: 5,
                width: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto',
                top: 'auto',
                data: [],
                textStyle: {
                    fontSize: 12,
                    fontFamily: 'Microsoft Yahei'
                }
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: [{
                name: '',
                type: 'category',
                data: [],
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        fontFamily: 'Microsoft Yahei'
                    },
                    rotate: 40
                }
            }],
            yAxis: [{
                type: 'value',
                data: [],
                name: '(单位:辆)',
                nameTextStyle: {
                    color: '#c5c5c5'
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        fontFamily: 'Microsoft Yahei',
                        color: '#c5c5c5'
                    }
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(232,232,232,.26)'
                    }
                }
            }
            ],
            series: []
        };
        // let op = {...option, ...param};

        let op = extend(true, {}, option, param);
        return op;
    }
    render() {
        return ( 
            <EchartBase option={this.setOption(this.props.option)} style = {this.props.style} onEvents={this.props.onEvents}/>
        );
    }
}
export default BBDLineBar;