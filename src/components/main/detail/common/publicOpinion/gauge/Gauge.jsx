/**
 * Created by fuzhihong on 2017/7/7.
 * Gauge 口碑值
 */
import './gauge.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { isEmpty } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;
export default class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoading: '数据加载中',
            loadingFlag: null
        };
    }

    /**
     * 获取口碑值数据
     */
    getGaugeData() {
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'dataapi_hongjing_yqkbz',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据。',
                loadingFlag: true
            }, () => {
                if (!isEmpty(data.data) && data.data) {
                    this.drawChart(data.data.evaluate);
                }
            });
        });
    }

    /**
     * 绘制图表
     * @param value
     */
    drawChart(value) {
        CHATBBD.bbdGauge({
            chartName: 'gaugeChart',
            data: [
                {
                    value: value,
                    name: '口碑值'
                }
            ]
        });
    }

    componentDidMount() {
        this.getGaugeData();
    }

    render() {
        return (
            <div className="gauge">
                {
                    this.state.loadingFlag ?
                        <div className="v-center" id="gaugeChart" style={{ width: '100%', height: '100%' }}>
                            <span>{this.state.listLoading}</span></div> : <LoadingBox type="loading2"/>
                }
            </div>
        );
    }
}