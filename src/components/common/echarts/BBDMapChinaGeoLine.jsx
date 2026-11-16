/*
* @type 中国地图迁徙图
* @author xuyao
*/
import React, {Component} from 'react';
import extend from './utils/extend';
import EchartBase from './base/EchartBase';

class BBDMapChinaGeoLine extends Component {
    constructor(props) {
        super(props);
    }

    setOption(parm) {
        let option = {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['北京'],
                selectedMode: 'single'
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
                { // 线
                    name: '北京',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: '#a6c84c',
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: []
                },
                { // 线上移动的图标
                    name: '北京',
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: false,
                        period: 6,
                        trailLength: 0,
                        symbol: '',
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: '#a6c84c',
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: []
                },
                { // 圆点
                    name: '',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    data: ''
                },
                {   // 圆点
                    name: '',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 10,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return 20;
                    },
                    data: [{
                        name: '北京',
                        value: [116.4551, 40.2539]
                    }]
                }
            ]
        };
        let op = extend(true, {}, option, parm);

        return op;
    }

    render() {
        return (
            <EchartBase option={this.setOption(this.props.option)} style={this.props.style}/>
        );
    }
}

export default BBDMapChinaGeoLine;