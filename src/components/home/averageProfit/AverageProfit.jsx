/**
 * Created by fuzhihong on 2017/7/5.
 * 首页-平均收益率
 */
import './averageProfit.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { indexNetAvgAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_NET_AVG_RETURN_RATE } = Services;

class AverageProfit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chartData: [], // 数据载体
            hasData: false // 是否有数据
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

    render() {
        const { previewInfo, industry } = this.props,
            { hasData, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="average-profit">
                <div className="head">
                    {/* <em className="iconfont icon-loufang"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}平均收益率</span>
                </div>
                {
                    hasData
                        ? <div className="v-center" id="averageProfit" style={{ width: '100%', height: '100%' }}></div>
                        : <NoData isNoData={!loading}/>

                }
            </div>
        );
    }

    /**
     * 获取平均收益率数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     */
    getData(nextProps) {
        let { isCountry, city, area, province } = nextProps || this.props;
        indexNetAvgAPI({
            type: INDEX_NET_AVG_RETURN_RATE,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            let content = (data !== '""') ? JSON.parse(JSON.parse(data)) : null, info;
            if (content) {
                let { value, date } = content;
                let legend = [];
                let series = [];
                for (let i in value) {
                    if (value.hasOwnProperty(i)) {
                        legend.push(i);
                        let seriesData = [];
                        for (let j = 0; j < value[i].length; j++) {
                            seriesData.push((value[i][j] * 100).toFixed(2));
                        }
                        series.push(seriesData);
                    }
                }
                info = {
                    hasData: true,
                    loading: false,
                    chartData: {
                        chartName: 'averageProfit',
                        colors: ['#74b9ee', '#037dde'],
                        gradientColor: [
                            [
                                { offset: 0, color: '#6cb5ec' },
                                { offset: 0.5, color: '#8fc9f2' },
                                { offset: 1, color: '#b0dbf8' }
                            ],
                            [
                                { offset: 0, color: '#0474dc' },
                                { offset: 0.5, color: '#0291e1' },
                                { offset: 1, color: '#00afe6' }
                            ]
                        ],
                        nameTextColor: '#cecece',
                        labelTextColor: '#cecece',
                        transformYAxis: 'percent',
                        showySplitLine: false,
                        axisLineColor: 'rgba(69,105,135,.6)',
                        splitLineColor: 'rgba(69,105,135,.6)',
                        legendIcon: 'rect',
                        legendRight: '10%',
                        specialFormatter: 'averageProfit',
                        smooth: false,
                        legend: legend,
                        series: series,
                        xAxis: date,
                        yAxisName: '平均收益率',
                        isCountry
                    }
                };
                // 配置chart数据
                this.setState(info, () => {
                    CHATBBD.bbdLine(this.state.chartData);
                });
            } else {
                $('#averageProfit').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }

        });
    }

}

export default AverageProfit;