/**
 * Created by ashima on 2017/4/17.
 * Remark 易燃指数雷达图
 */
import './radar.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { radarTip } from 'Utils/formatter';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { companyDetailAPI } from 'Services/detail';
import Immutable from 'immutable';

const { COMPANY_DETAIL_RADAR } = Services;

export default class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsName: this.props.tabsName || '--',
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...',
            industry: this.props.params.industry // 行业名称
        };
    }

    componentDidMount() {
        this.radarData();
    }

    componentWillReceiveProps(nextProps, props) {
        let isEqualData = Immutable.is(nextProps.tabsName, this.props.tabsName);
        if (!isEqualData) {
            this.setState({ tabsName: nextProps.tabsName }, function () {
                this.radarData();
            });
        }
    }

    /**
     * 查询企业易燃指数雷达图
     */
    radarData() {
        let { companyId, tabsName, industry } = this.state;
        companyDetailAPI({
            type: COMPANY_DETAIL_RADAR,
            data: {
                companyId: companyId
            }
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据！'
            }, () => {
                if (data !== null) {
                    // let {
                    //     dynamicRelatedScore, // 动态关联方分数4
                    //     creditScore, // 企业诚信风险分数5
                    //     operationScore, // 经营行为风险分数2
                    //     overallStrength, // 综合实力风险分数1
                    //     staticReletedScore, // 静态关联方分数3
                    //     yuqingScore, // 舆情风险分数6
                    //     industryScore, // 行业风险分数8
                    //     featureScore, // 特征风险分数9
                    //     ruleBreakScore // 违规预警分数7
                    // } = data;
                    let {
                        riskIndex,
                        dynamicRelationRiskIndex, // 动态关联方分数4
                        creditRiskIndex, // 企业诚信风险分数5
                        manageRiskIndex, // 经营行为风险分数2
                        overallStrengthRiskIndex, // 综合实力风险分数1
                        staticRelationRiskIndex, // 静态关联方分数3
                        yuqingRiskIndex, // 舆情风险分数6
                        industryRiskIndex, // 行业风险分数8
                        featureRiskIndex, // 特征风险分数9
                        ruleBreakRiskIndex  // 违规预警分数7
                    } = data;
                    // let previewInfo = [
                    //     {
                    //         name: '综合实力风险',
                    //         value: overallStrength
                    //     },
                    //     {
                    //         name: '经营行为风险',
                    //         value: operationScore
                    //     },
                    //     {
                    //         name: '静态关联方风险',
                    //         value: staticReletedScore
                    //     },
                    //     {
                    //         name: '动态关联方风险',
                    //         value: dynamicRelatedScore
                    //     },
                    //     {
                    //         name: '企业诚信风险',
                    //         value: creditScore
                    //     },
                    //     {
                    //         name: '舆情风险',
                    //         value: yuqingScore
                    //     },
                    //     {
                    //         name: '违规风险',
                    //         value: ruleBreakScore
                    //     },
                    //     {
                    //         name: '企业诚信风险',
                    //         value: industryScore
                    //     },
                    //     {
                    //         name: '特征事件风险',
                    //         value: featureScore
                    //     }
                    // ];
                    let previewInfo = [
                        {
                            name: '综合实力风险',
                            value: overallStrengthRiskIndex 
                        },
                        {
                            name: '经营行为风险',
                            value: manageRiskIndex 
                        },
                        {
                            name: '静态关联方风险',
                            value: staticRelationRiskIndex 
                        },
                        {
                            name: '动态关联方风险',
                            value: dynamicRelationRiskIndex
                        },
                        {
                            name: '企业诚信风险',
                            value: creditRiskIndex 
                        },
                        {
                            name: '舆情风险',
                            value: yuqingRiskIndex 
                        },
                        {
                            name: '违规风险',
                            value: ruleBreakRiskIndex 
                        },
                        {
                            name: '行业风险',
                            value: industryRiskIndex
                        },
                        {
                            name: '特征事件风险',
                            value: featureRiskIndex
                        }
                    ];
                    let radarFormat = {
                            legend: [],
                            indicator: [],
                            series: []
                        }, totalScore = 0;

                    totalScore = riskIndex;

                    previewInfo.forEach((ite) => {
                        let { value, name } = ite;
                        // totalScore += value;
                        radarFormat.indicator.push({
                            name: name,
                            max: 100,
                            name2: name,
                            value: value.toFixed(1)
                        });
                        radarFormat.series.push(value);
                    });
                    CHATBBD.bbdRadar({
                        chartName: 'radar',
                        color: ['#fbc338', '#f76e44', '#79f2df'],
                        title: '',
                        radarRadius: 110,
                        legendShow: false,
                        indicator: radarFormat.indicator,
                        series: [radarFormat.series],
                        totalScore: totalScore,
                        tipsText: radarTip(industry)
                    });
                }
            });
        });
    }

    render() {
        return (
            <div className="item detail-radar">
                <div className="header"><em className="iconfont icon-redar-chart"></em>风险指数雷达图</div>
                <div className="content">
                    <div className="chart-box">
                        {/* 雷达图*/}
                        <div className="radar v-center" id="radar" style={{ width: '100%', height: '100%' }}>
                            {/* <LoadingBox info="数据载入中" type="loading2"/> */}
                        </div>
                        <div className="radar-lable-tip" id="radar-lable-tip"></div>
                    </div>
                </div>
            </div>
        );
    }
}