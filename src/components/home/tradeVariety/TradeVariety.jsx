/**
 * Created by fuzhihong on 2017/7/5.
 * 首页 - 交易场所交易品种
 */
import './tradeVariety.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { sortArrJson } from 'Utils/formatter';
import { indexTradePlaceAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_TRADE_PLACE_TRADE_TYPE } = Services;

class TradeVariety extends Component {
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
     * 组件将接收新的参数
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
            <div className="trade-variety">
                <div className="head">
                    {/* <em className="iconfont icon-xingyexinxihua"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}交易品种</span>
                </div>
                {
                    hasData
                        ? <div className="v-center" id="tradeVariety" style={{ width: '90%', height: '90%' }}></div>
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
        indexTradePlaceAPI({
            type: INDEX_TRADE_PLACE_TRADE_TYPE,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            let dataBase = data ? JSON.parse(data) : null;
            if (dataBase) {
                let setDateBase = [];
                for (let item in dataBase) {
                    if (dataBase.hasOwnProperty(item)) {
                        setDateBase.push({
                            name: item,
                            value: dataBase[item]
                        });
                    }
                }
                let responseContent = setDateBase.sort(sortArrJson('value', 'isAsc'));
                let data = [[]];
                let yAxis = [];
                for (let i = 0; i < responseContent.length; i++) {
                    yAxis.push(responseContent[i].name);
                    data[0].push(responseContent[i].value);
                }
                this.setState({
                    hasData: true,
                    loading: false,
                    chartData: {
                        specialFormatter: true,
                        legendShow: false,
                        row: true,
                        chartName: 'tradeVariety',
                        graphic: false,
                        labelTextColor: '#cecece',
                        splitLineColor: 'rgba(69,105,135,.9)',
                        axisLineColor: 'rgba(69,105,135,.9)',
                        axisLineShow: false,
                        ysplitLineShow: false,
                        xsplitLineShow: true,
                        barWidth: '16',
                        gridLeft: '20%',
                        gridTop: '15%',
                        series: data,
                        yAxis: yAxis,
                        legend: yAxis,
                        tooltipBackgroundColor: 'rgba(255,255,255,1)',
                        yAxisName: '交易场所数量',
                        unit: '家',
                        labelName: '交易场所数量'
                    }
                }, () => {
                    CHATBBD.bbdBar(this.state.chartData);
                });
            } else {
                $('#tradeVariety').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }
        });
    }
}

export default TradeVariety;