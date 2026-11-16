/*
* @desc 中国地图数据分布图
* @author xuyao
*/
import React, { Component } from 'react';
import extend from './utils/extend';
import EchartBase from './base/EchartBase';

class BBDMapChinaScatter extends Component {
    constructor(props) {
        super(props);
    }
    setOption(param){
        let option = {
            title: {
                text: '',
                subtext: '',
                sublink: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                y: 'bottom',
                x: 'right',
                data: ['pm2.5']
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true
            },
            series: [
                {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: [],
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    }
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

export default BBDMapChinaScatter;