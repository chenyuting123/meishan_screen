/**
 * Created by ashima on 2017/4/17.
 * Remark 易燃指数时序图
 */
import './line.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { getLocal } from 'Utils/storage';
import { formatDateShort, sortArrJson } from 'Utils/formatter';
import { monthPlus } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { companyDetailAPI, detailBaseDataAPI } from 'Services/detail';
import Immutable from 'immutable';

const { DETAIL_BASE_DATA_OVERVIEW, COMPANY_DETAIL_TIME_SQUE, COMPANY_DETAIL_SORT } = Services;

export default class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsName: this.props.tabsName || '--',
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            companyIndustry: getLocal('industry') || '',
            listLoading: '数据载入中...'
        };
    }

    componentDidMount() {
        this.lineData();
    }

    componentWillReceiveProps(nextProps, props) {
        let isEqualData = Immutable.is(nextProps.tabsName, this.props.tabsName);
        if (!isEqualData) {
            this.setState({ tabsName: nextProps.tabsName }, () => {
                this.lineData();
            });
        }
    }

    getBaseDataOverview() {
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_OVERVIEW,
            data: {
                companyId: this.state.companyId
            }
        }).then(({ data }) => {
            let { industry } = data.content;
            this.getSortInfoByCompanyId(industry);
        });
    }

    getSortInfoByCompanyId(industry) {
        let { companyId, tabsName } = this.state;
        companyDetailAPI({
            type: COMPANY_DETAIL_SORT,
            data: {
                companyId,
                industry
            }
        }).then(({ data }) => {
            let content = data;
            let lineFormat = {
                legend: ['企业风险指数', '行业中位数', '行业平均值'],
                xAxis: [],
                series: []
            };
            if (content !== null) {
                let { dataJson } = content;
                let indexSortSoureData = dataJson === null ? {} : dataJson;
                let line = JSON.parse(indexSortSoureData);
                // debugger;
                let sortSeries = [], newData = [], xAxis = [];
                for (let items in line) {
                    if (line.hasOwnProperty(items)) {
                        newData.push({ time: items, value: line[items].toFixed(1), num: new Date(items).getTime() });
                        // sortSeries.push(line[items].toFixed(1));
                    }
                }
                newData.sort(sortArrJson('num', 'isAsc')).forEach(({ value, time }) => {
                    sortSeries.push(value);
                    xAxis.push(time);
                });
                lineFormat.xAxis = xAxis;
                lineFormat.series.push(sortSeries);
            }
            this.getTimeSque(industry, lineFormat);
        });
    }

    // 时序图行业平均数和行业中位数
    getTimeSque(industry, lineFormat) {
        companyDetailAPI({
            type: COMPANY_DETAIL_TIME_SQUE,
            data: {
                industry: industry
            }
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据！'
            }, () => {
                let dataSort = lineFormat; // 易燃指数数据
                let dataSoure = data;
                for (let i = 0; i < dataSoure.length; i++) {
                    // dataSort.legend.push(dataSoure[i].dataType);
                    let series = [], newData = [];
                    let timeSque = JSON.parse(dataSoure[i].dataJson);
                    for (let item in timeSque) {
                        if (timeSque.hasOwnProperty(item)) {
                            newData.push({ time: item, value: timeSque[item], num: new Date(item).getTime() });
                        }
                    }
                    newData.sort(sortArrJson('num', 'isAsc')).forEach(({ value }) => {
                        series.push(value);
                    });
                    dataSort.series.push(series);
                }

                CHATBBD.bbdLine({
                    chartName: 'line',
                    legend: dataSort.legend,
                    colors: ['rgb(38,188,213)', 'rgb(101,147,74)', 'rgb(244,208,0)'],
                    lineStyleColor: ['rgb(38,188,213)', 'rgb(101,147,74)', 'rgb(244,208,0)'],
                    xAxis: dataSort.xAxis,
                    labelTextColor: '#999',
                    series: dataSort.series,
                    graphic: false,
                    max: 100,
                    specialFormatter: 'detailTrend',
                    regionLegend: true,
                    legendRight: '5%'
                });
            });
        });
    }

    /**
     * 易燃指数时序图
     * ps：由于这个三组数据是分两个接口请求的所以需要两个接口组装数据
     */
    lineData() {
        this.getBaseDataOverview();
    }

    render() {
        return (
            <div className="item">
                <div className="header"><em className="iconfont icon-line"></em>风险指数时序图</div>
                <div className="content">
                    <div className="chart-box">
                        {/* 折线图*/}
                        <div className="line v-center u-loading-box" id="line" style={{ width: '100%', height: '100%' }}>
                            <LoadingBox info="数据载入中" type="loading2"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}