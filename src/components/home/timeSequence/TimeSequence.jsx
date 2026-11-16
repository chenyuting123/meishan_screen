/**
 * Created by fuzhihong on 2017/7/6.
 * 首页- 公用 - 时序图
 */
import './timeSequence.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { sortArrJson } from 'Utils/formatter.js';
import { LoadingBox } from 'mtui/index';
import { indexTradePlaceAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_TRADE_PLACE_SORT } = Services;

class TimeSequence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chartData: [], // 数据源载体
            hasData: false // 判断是否有数据
        };
    }

    /**
     * 组件加载完成
     */
    componentDidMount() {
        this.getData();
    }

    /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        let isIndustry = Immutable.is(nextProps.industry, this.props.industry);
        if (!isEqualArea || isIndustry) {
            this.getData(nextProps);
        }
    }

    render() {
        const { previewInfo, industry } = this.props,
            { hasData, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="time-sequence">
                <div className="head">
                    {/* <em className="iconfont icon-xingyexinxihua"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}区域高危企业时序图</span>
                </div>
                {
                    hasData
                        ? <div className="v-center" id="timeSequence" style={{ width: '100%', height: '100%' }}></div>
                        : <NoData isNoData={!loading}/>
                }
            </div>
        );
    }

    /**
     * 获取数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     * @param industry
     */
    getData(nextProps) {
        let { isCountry, city, area, province, industry } = nextProps || this.props;
        indexTradePlaceAPI({
            type: INDEX_TRADE_PLACE_SORT,
            data: {
                province: '浙江省',
                city: city,
                area: area,
                industry: industry === '综合监测' ? '' : industry
            }
        }).then(({ data }) => {
            let content = data;
            if (content.length > 0) {
                let date = [], value = [];
                content = content.map((item) => {
                    item.num = new Date(item.month).getTime();
                    return item;
                }).sort(sortArrJson('num', 'isAsc'));
                content.forEach(({ month, highRiskCompanyCount }) => {
                    date.push(month);
                    value.push(highRiskCompanyCount);
                });
                this.setState({
                    hasData: true,
                    loading: false,
                    chartData: {
                        specialFormatter: true,
                        lineType: 'timeSequence',
                        chartName: 'timeSequence',
                        showySplitLine: false,
                        isCountry: true,
                        // gradientColor: [[{offset: 0, color: '#0376d5'}, {offset: 1, color: '#00aee6'}]],
                        graphic: true,
                        full: true,
                        yAxisName: '高危企业数',
                        labelTextColor: '#cecece',
                        axisLineColor: 'rgba(69,105,135,.6)',
                        splitLineColor: 'rgba(69,105,135,.6)',
                        legendShow: false,
                        smooth: false,
                        legend: date,
                        left: '15%',
                        series: [
                            value
                        ],
                        gradientColor: [
                            [{ offset: 0, color: '#027ddd' }, { offset: 0.5, color: '#0294e1' }, {
                                offset: 1,
                                color: '#02ade5'
                            }]
                        ],
                        xAxis: date,
                        unit: '家',
                        labelName: '高危企业数'
                    }
                }, () => {
                    CHATBBD.bbdLine(this.state.chartData);
                });
            } else {
                $('#timeSequence').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }
        });
    }
}

export default TimeSequence;