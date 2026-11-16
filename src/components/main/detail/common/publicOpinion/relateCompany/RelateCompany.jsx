/**
 * Created by fuzhihong on 2017/7/7.
 * RelateCompany 相关公司
 */
import './relateCompany.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { sortArrJson } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_YU_QING_COMPANYID } = Services;

export default class RelateCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoading: '数据加载中...',
            chartData: [] // 图表数据
        };
    }

    componentDidMount() {
        let { relationData } = this.props;
        let companyList = relationData.company_list;
        let data = companyList === undefined ? [] : companyList.sort(sortArrJson('relation_count', 'isAsc'));
        let percentArr = [], yAxisArr = [];
        if (data.length > 0) {
            data.map(function (item, index) {
                percentArr.push((item.relation_pct * 100).toFixed(2));
                yAxisArr.push(item.relation_name_company);
            });

            this.drawChart(percentArr, yAxisArr);
        } else {
            this.setState({
                listLoading: '暂无相关数据。'
            });
        }
    }

    /**
     * 描绘图表
     * @param series
     * @param yAxis
     */
    drawChart(series, yAxis) {
        this.setState({
            chartData: {
                legendShow: false,
                row: true,
                chartName: 'relateCompanyChart',
                graphic: false,
                gradientColors: [
                    [{ offset: 0, color: '#1060c4' }, { offset: 1, color: '#80cdf4' }],
                    [{ offset: 0, color: '#10bbc5' }, { offset: 1, color: '#7ff4e1' }]
                ],
                axisLineColor: '#ccc',
                axisLineShow: false,
                ysplitLineShow: false,
                xaxisLabelShow: false,
                labelTextSize: 14,
                seriesLabelShow: true,
                gridLeft: '20%',
                barWidth: '16',
                unit: '%',
                containLabel: true,
                specialFormatter: 'bangdan',
                series: [
                    series
                ],
                yAxis: yAxis,
                legend: yAxis
            }
        }, () => {
            CHATBBD.bbdBar(this.state.chartData, (data) => {
                this.props.onRelatedClick(data.name, 1);
            });
        });
    }

    render() {
        return (
            <div className="relate-company">
                <div className="v-center" id="relateCompanyChart"
                     style={{ width: '100%', height: '100%', marginRight: '5%' }}><span>{this.state.listLoading}</span>
                </div>
            </div>
        );
    }
}