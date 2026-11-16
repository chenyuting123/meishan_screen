/*
 * @desc 风险走势折线图
 * @author lijing
 */
import './riskTrend.scss';
import React, { Component } from 'react';
import RiskTrendLine from './chart/RiskTrendLine';
import LocalRiskTrendLine from './chart/LocalRiskTrendLine';
import { getLocal } from 'Utils/storage';
import { findLocalRiskTrend } from '../../../../services/home';
import { Tip } from 'mtui';
import { isEmpty } from 'Utils/util';
import { NoData } from 'CommonComponents';
import emitter from 'Utils/emitter';

export default class RiskTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewInfo: getLocal('user').province,  // 当前省份
            localRiskTrendData: null,
            noData: false,
            industry: '综合监测'
        };
    }

    render() {
        let { previewInfo, localRiskTrendData, noData, industry } = this.state;
        return (
            <div className="riskTrend_root">
                <p className="chart-title">{industry === '综合监测' ? previewInfo + '-新金融风险走势' : previewInfo + '-' + industry + '-风险走势'}</p>
                <div className="chart-box">
                    {
                        previewInfo === '全国' ? <RiskTrendLine industy={industry}/> :
                            !isEmpty(localRiskTrendData) ?
                                <LocalRiskTrendLine LocalRiskTrendData={localRiskTrendData} province={previewInfo}/>
                                : <NoData isNoData={noData}/>
                    }
                </div>
            </div>
        );
    }

    getArea = ({ area, previewInfo, city, industry, province, type, isCountry }) => {
        // 查询当地和全国风险指
        // previewInfo !== '全国' &&
        this.setState({ localRiskTrendData: null, noData: false }, () => {
            findLocalRiskTrend({
                province: !isCountry ? province : '',
                city: city,
                area: area,
                industry: industry === '综合监测' ? '' : industry
            }).then(({ data }) => {
                this.setState({
                    previewInfo,
                    localRiskTrendData: data,
                    noData: data.length === 0 || !data,
                    industry
                });
            }, (error) => {
                console.error(error.message);
            });
        });

    };
}