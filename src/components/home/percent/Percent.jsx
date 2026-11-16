/**
 * Created by Administrator on 2017/4/17.
 * Remark 百分比圈
 */
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';

class Percent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 组件加载完成
     */
    componentDidMount() {
        this._drawChart();
    }

    /**
     * 绘制chart
     * @param nextProps
     * @private
     */
    _drawChart(nextProps) {
        let data = nextProps || this.props;
        CHATBBD.bbdPercent({
            obj: this._percent,
            percent: data.percent
        });
    }

    /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.percent !== this.props.percent) {
            this._drawChart(nextProps);
        }
    }

    render() {
        return (
            <div ref={refs => this._percent = refs}
                 style={{ width: '55px', height: '55px' }}>

            </div>
        );
    }
}

export default Percent;