/*
 * @desc 发展趋势气泡图
 * @author lijing
 */
import './tendencyChart.scss';
import React, { Component } from 'react';
import Scatter from './chart/Scatter';
import { getLocal } from 'Utils/storage';
import { findNewEcoDevelopTrend } from 'Services/home';
import { Tip } from 'mtui';
import { isEmpty } from 'Utils/util';
import { NoData } from 'CommonComponents';

export default class TendencyChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewInfo: getLocal('user').province,  // 当前省份
            newEcoDevelopTrendData: null,
            noData: false,
            industry: ''
        };
    }

    render() {
        let { previewInfo, newEcoDevelopTrendData, noData, industry } = this.state;
        return (
            <div className="TendencyChart_root">
                <p className="chart-title">{industry === '综合监测' ? previewInfo + '-新金融发展趋势' : previewInfo + '-' + industry + '-' + '发展趋势'}</p>
                <div className="chart-box">
                    {!isEmpty(newEcoDevelopTrendData)
                        ? <Scatter newEcoDevelopTrendData={newEcoDevelopTrendData} province={previewInfo}
                                   industry={industry}/>
                        : <NoData isNoData={noData}/>
                    }

                </div>
            </div>
        );
    }

    getArea = ({ area, previewInfo, city, industry, province, type, isCountry }) => {
        // 新金融发展趋势
        this.setState({ newEcoDevelopTrendData: null, noData: false }, () => {
            findNewEcoDevelopTrend({
                province: !isCountry ? province : '',
                city: city,
                area: area,
                industry: industry === '综合监测' ? '' : industry
            }).then(({ data }) => {
                this.setState({
                    previewInfo,
                    newEcoDevelopTrendData: data,
                    noData: data.length === 0 || !data,
                    industry
                });
            }, (error) => {
                console.error(error.message);
            });
        });
    };
}