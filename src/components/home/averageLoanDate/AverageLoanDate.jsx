/**
 * Created by fuzhihong on 2017/7/5.
 * 首页-平均借贷期限
 */
import './averageLoanDate.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { indexNetAvgAPI } from 'Services/home';
import { Services } from 'Constants/common';
import { NoData } from 'CommonComponents';
import Immutable from 'immutable';

const { INDEX_NET_AVG_LOAN_DATE } = Services;

class AverageLoanDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // 没有数据展示的信息
            chartData: [], // 数据载体
            hasData: false // 时候有数据
        };
    }

    /**
     * 页面渲染成功处理
     */
    componentDidMount() {
        this.getData();
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        if (!isEqualArea) {
            this.getData(nextProps);
        }
    }

    /**
     * 获取平均借贷期限数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     */
    getData(nextProps) {
        let { isCountry, city, area, province } = nextProps || this.props;
        indexNetAvgAPI({
            type: INDEX_NET_AVG_LOAN_DATE,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            let content = (data !== '""') ?  JSON.parse(JSON.parse(data)) : null, info;
            if (content) {
                let { value, date } = content;
                let legend = [];
                let series = [];
                for (let i in value) {
                    if (value.hasOwnProperty(i)) {
                        legend.push(i);
                        series.push(value[i]);
                    }
                }
                // 配置chart数据
                this.setState({
                    hasData: true,
                    loading: false,
                    chartData: {
                        chartName: 'averageLoanDate',
                        graphic: false,
                        ysplitLineShow: false,
                        labelTextColor: '#cecece',
                        yAxisName: '平均借款期限',
                        splitLineColor: 'rgba(69,105,135,.6)',
                        axisLineColor: 'rgba(69,105,135,.6)',
                        legend: legend,
                        legendIcon: 'rect',
                        isCountry,
                        legendRight: '10%',
                        series: series,
                        xAxis: date,
                        tooltipBackgroundColor: 'rgba(255,255,255,1)',
                        specialFormatter: 'averageLoanDateFormatter',
                        gradientColors: [
                            [{ offset: 0, color: '#6cb5ec' }, { offset: 0.5, color: '#8fc9f2' }, {
                                offset: 1,
                                color: '#b0dbf8'
                            }],
                            [{ offset: 0, color: '#0474dc' }, { offset: 0.5, color: '#0291e1' }, {
                                offset: 1,
                                color: '#00afe6'
                            }]
                        ]
                    }
                }, () => {
                    CHATBBD.bbdBar(this.state.chartData);
                });
            } else {
                $('#averageLoanDate').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }

        });
    }

    render() {
        const { previewInfo, industry } = this.props,
            { hasData, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="average-loan-date">
                <div className="head">
                    {/* <em className="iconfont icon-xingyexinxihua"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}平均借贷期限</span>
                </div>
                {
                    hasData ?
                        <div className="v-center" id="averageLoanDate" style={{ width: '100%', height: '100%' }}></div>
                        : <NoData isNoData={!loading}/>
                }
            </div>
        );
    }

}

export default AverageLoanDate;