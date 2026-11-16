/**
 * Created by fuzhihong on 2017/7/5.
 * 首页 - 交易场所类型
 */
import './tradeType.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { indexTradePlaceAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_TRADE_PLACE_TYPE } = Services;

class TradeType extends Component {
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
        if (!isEqualArea) {
            this.getData(nextProps);
        }
    }

    render() {
        const { previewInfo, industry } = this.props,
            { hasData, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="trade-type">
                <div className="head">
                    {/* <em className="iconfont icon-loufang"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}交易场所类型</span>
                </div>
                {
                    hasData
                        ? <div className="v-center" id="tradeType" style={{ width: '100%', height: '90%' }}></div>
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
            type: INDEX_TRADE_PLACE_TYPE,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            let content = (data !== '""') ?  JSON.parse(JSON.parse(data)) : null, info;
            if (content) {
                let info = [];
                for (let i in content) {
                    if (content.hasOwnProperty(i)) {
                        info.push({
                            name: i,
                            value: content[i]
                        });
                    }
                }
                this.setState({
                    hasData: true,
                    loading: false,
                    chartData: {
                        color: ['rgb(113,200,244)', 'rgb(0,86,192)', 'rgb(2,115,220)', 'rgb(2,207,220)', 'rgb(2,53,220)'],
                        chartName: 'tradeType',
                        data: info,
                        labelFontSize: 16,
                        length2: 50,
                        radius: ['50%', '70%'],
                        center: ['45%', '45%'],
                        name: '交易场所数量',
                        unit: '家'
                    }
                }, () => {
                    CHATBBD.bbdPie(this.state.chartData);
                });
            } else {
                $('#tradeType').find('canvas').remove();
                this.setState({ hasData: false, loading: false });
            }

        });
    }
}

export default TradeType;