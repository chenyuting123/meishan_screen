/**
 * Created by fuzhihong on 2017/7/7.
 * GaugeTend 口碑走势图
 */
import './gaugeTend.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { isEmpty } from 'Utils/util';
import { sortArrJson } from 'Utils/formatter';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;

export default class GaugeTend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoading: '数据加载中',
            loadingFlag: null
        };
    }

    /**
     * 获取口碑走势数据
     */
    getGaugeTendData() {
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'dataapi_hongjing_yqzst',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据。',
                loadingFlag: true
            }, () => {
                if (!isEmpty(data.data) && data.data.length > 0) {
                    let evaluate = [], pubdate = [];
                    let info = data.data.sort(sortArrJson('pubdate', 'isDes'));
                    info.map((item) => {
                        evaluate.push(item.evaluate);
                        pubdate.push(item.pubdate);
                    });
                    this.drawChart([evaluate], pubdate);
                }
            });
        });
    }

    /**
     * 绘制图表
     * @param series
     * @param xAxis
     */
    drawChart(series, xAxis) {
        // 配置图表属性
        CHATBBD.bbdLine({
            chartName: 'gaugeTendChart',
            legend: ['口碑值'],
            colors: ['#04a8ff'],
            stack: 'common',
            labelTextColor: '#999',
            series: series,
            xAxis: xAxis,
            gradientColor: [[{ offset: 0, color: 'rgb(129, 211, 255)' }, { offset: 1, color: 'rgb(251, 251, 251)' }]],
            lineStyleColor: ['rgb(1,166,255)'],
            lineStyleOpacity: '0.8',
            symbolSize: 8,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                borderType: 'solid',
                opacity: '0.8'
            },
            specialFormatter: 'gaugeTendChart',
            smooth: false,
            symbol: 'circle',
            lineStyleWidth: 4,
            xName: '',
            xBoundaryGap: false,
            legendShow: false,
            max: 100,
            min: -100
        });
    }

    componentDidMount() {
        this.getGaugeTendData();
    }

    render() {
        return (
            <div className="gauge-tend">
                {this.state.loadingFlag ?
                    <div className="v-center" id="gaugeTendChart" style={{ width: '94%', height: '100%' }}>
                        <span>{this.state.listLoading}</span></div> : <LoadingBox type="loading2"/>
                }
            </div>
        );
    }
}