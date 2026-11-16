/**
 * Created by fuzhihong on 2017/7/6.
 * 首页- 私募 - 基金产品数量
 */
import './privateProductNumber.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { indexPrivateFundAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_PRIVATE_FUND_PRODUCT_NUM } = Services;

class PrivateProductNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chartData: [],
            hasData: false
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
        if (!isEqualArea) {
            this.getData(nextProps);
        }
    }

    render() {
        const { previewInfo, industry } = this.props,
            { hasData, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="private-product-number">
                <div className="head">
                    {/* <em className="iconfont icon-loufang"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}基金产品数量</span>
                </div>
                {
                    hasData
                        ? <div className="v-center" id="privateProductNumber"
                               style={{ width: '100%', height: 'calc(100% - 30px)' }}></div>
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
     */
    getData(nextProps) {
        let { isCountry, city, area, province } = nextProps || this.props;
        indexPrivateFundAPI({
            type: INDEX_PRIVATE_FUND_PRODUCT_NUM,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            let content = (data !== '""') ? JSON.parse(data) : null, info;
            if (content) {
                let { date, value } = content;
                let legend = [];
                let series = [];
                for (let i in value) {
                    if (value.hasOwnProperty(i)) {
                        
                        legend.push(i);
                        let seriesData = [];
                        for (let j = 0; j < value[i].length; j++) {
                            seriesData.push(value[i][j]);
                        }
                        series.push(seriesData);
                    }
                }
                this.setState({
                    hasData: true,
                    loading: false,
                    chartData: {
                        specialFormatter: true,
                        chartName: 'privateProductNumber',
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
                        isCountry,
                        showySplitLine: false,
                        graphic: true,
                        full: true,
                        labelTextColor: '#cecece',
                        axisLineColor: 'rgba(69,105,135,.6)',
                        splitLineColor: 'rgba(69,105,135,.6)',
                        legendShow: isCountry ? false : true,
                        legendIcon: 'rect',
                        legendRight: '10%',
                        left: '20%',
                        smooth: false,
                        legend: legend,
                        series: isCountry ? [value] : series,
                        xAxis: date,
                        unit: '个',
                        labelName: '基金产品数量'
                    }
                }, () => {
                    CHATBBD.bbdLine(this.state.chartData);
                });
            } else {
                $('#privateProductNumber').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }
        });
    }

}

export default PrivateProductNumber;