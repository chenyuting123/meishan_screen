/*
 * @desc 首页右侧面板
 * @author lijing
 */
import './rightPlan.scss';
import React, { Component } from 'react';
import { shouldUpdate } from 'Utils/util';
import CrossRegionTrendLine from '../leftPlan/riskTrend/chart/CrossRegionTrendLine';
import RegionView from './mychart/RegionView';

export default class RightPlan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monitorArea: props.previewInfo,
            province: props.province
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.props, nextProps);
    }

    render() {
        let { industry, previewInfo, comType } = this.props;

        return (
            <div className="rightPlan_root">         
                <div className="risk-analysis-box">
                    <p className="chart-title">{previewInfo === '全国' ? '浙江省' : previewInfo}-跨区域风险分析</p>
                    <div className="chart-box">
                        <CrossRegionTrendLine {...this.props} />
                    </div>
                </div>          
            </div>
        );
    }

}