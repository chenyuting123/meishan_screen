/*
   * @desc 环形图
   * @author 
   * @param radius 区别环形与饼图 eg：[0, '75%'] 内半径与外半径
   * @param roseType 南丁格尔玫瑰图专用，可选择两种模式 radius/area
   */
import React, { Component } from 'react';
import extend from './utils/extend';
import EchartBase from './base/EchartBase';

class PieHuan extends Component {
    constructor(props) {
        super(props);
    }
    setOption(parm) {
        const option = {
            title: {
                show: true,
                link: '',
                target: 'self',
                x: 'center',
                y: 'top',
                top: 20,
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bolder'
                }
            },
            legend: {
                show: true,
                orient: 'horizontal',
                itemHeight: 10,
                itemWidth: 10,
                bottom: 10,
                left: 'center',
                padding: 10,
                itemGap: 20,
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'normal',
                    fontFamily: 'Microsoft Yahei'
                }
            },
            series: []
        };

        let op = extend(true, {}, option, parm);
        return op;
    }
    render() {
        return (
            <EchartBase option={this.setOption(this.props.option)} style={this.props.style} />
        );
    }
}
export default PieHuan;