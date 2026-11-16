import React from 'react';
import BBDLineBar from '../../../../common/echarts/BBDLineBar';
import emitter from 'Utils/emitter';
import { getRiskTrendLine } from '../../../../../services/home';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../../common/indexComponent/mixins/mixins';
import { sortArrJson } from 'Utils/formatter';
import { isEmpty } from 'Utils/util';
import { NoData } from 'CommonComponents';
let Immutable = require('immutable');

class RiskTrendLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true,
            industryName: '',
            noData: false
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }

    componentDidMount() {
        this.setMonitorIndustry(this.props.industry);
        emitter.on('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
    }

    setMonitorIndustry = (industry) => {
        let industryName = (industry === undefined || industry === '综合监测') ? '' : industry;
        this.setState({
            industryName: industryName
        }, () => {
            this.getRiskTrendLine(this.state.industryName);
        });
    };

    getRiskTrendLine = (name) => {
        getRiskTrendLine({
            industry: name
        }).then(({ data }) => {
            let content = data.map((item) => {
                item.num = new Date(item.month).getTime();
                return item;
            });
            content = content.sort(sortArrJson('num', 'sortArrJson'));
            this.initLineBar(content);
        });
    };

    initLineBar(data) {
        let xAxis = [],
            avgRiskIndexData = [],
            highRiskCompanyCountData = [],
            barName = ['风险指数', '高危企业数量'];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                avgRiskIndexData.push(Math.round(data[i].avgRiskIndex * 100) / 100);
                highRiskCompanyCountData.push(data[i].highRiskCompanyCount);
                xAxis.push(data[i].month);
            }
        } else {
            this.setState({
                option: null,
                isLoading: true
            });
            return;
        }
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,.9)',
                padding: 10,
                axisPointer: {
                    lineStyle: {
                        opacity: 0
                    }
                },
                formatter: function (obj) {
                    return (
                        '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold">'
                        + obj[0].name
                        + '</div>'
                        + '<label style="color:#666666; font-size:14px; float:left;">' + '全国' + obj[0].seriesName + '：' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + obj[0].value + '</span>' + '</label>' + '<br>'
                        + '<label style="color:#666666; font-size:14px; float:left;">' + obj[1].seriesName + '：' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + obj[1].value + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '</label>' + '<br>'
                    );
                }
            },
            grid: {
                top: '20%',
                bottom: '5%',
                containLabel: true
            },
            legend: {
                // orient: 'vertical',
                // itemHeight: 10,
                // itemWidth: 10,
                // top: -5,
                right: 10,
                // itemGap: 20,
                data: barName,
                textStyle: {
                    color: '#C4C4C4',
                    fontSize: 12
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '风险分值',
                    nameTextStyle: {
                        color: '#c5c5c5',
                        fontSize: 10
                    },
                    splitNumber: 8,

                    axisLabel: {
                        // formatter: function(value) {
                        //     return (value / 1000000) * 2 + 'M';
                        // },
                        textStyle: {
                            fontSize: 12,
                            color: '#c5c5c5'
                        }
                    },
                    splitLine: {
                        show: true,
                        interval: 'auto',
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    }
                }, {
                    type: 'value',
                    name: '高危企业数量（家）',
                    nameTextStyle: {
                        color: '#c5c5c5',
                        fontSize: 10
                    },
                    splitNumber: 8,
                    splitLine: {
                        show: true,
                        interval: 'auto',
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        // formatter: function(value) {
                        //     return (value / 1000000) * 2 + 'M';
                        // },
                        textStyle: {
                            fontSize: 12,
                            color: '#c5c5c5'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    }
                }
            ],
            xAxis: [
                {
                    name: '',
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: '#C4C4C4'
                        },
                        rotate: 0
                    },
                    type: 'category',
                    data: xAxis,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    }
                }
            ],
            series: [{
                showSymbol: true,
                name: '风险指数',
                type: 'line',
                barWidth: 14,
                data: avgRiskIndexData,
                itemStyle: {
                    normal: {
                        color: '#0293DC'
                    },
                    emphasis: {}
                }
            }, {
                showSymbol: true,
                name: '高危企业数量',
                yAxisIndex: 1,
                type: 'line',
                barWidth: 14,
                data: highRiskCompanyCountData,
                itemStyle: {
                    normal: {
                        color: '#D16829'
                    },
                    emphasis: {}
                }
            }]
        };
        this.setState({
            option: option,
            isLoading: false,
            noData: false
        });
    }

    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                {/* <LoadingBox info="数据载入中" type="loading2"/> */}
                <NoData isNoData={this.state.noData}/>
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDLineBar option={this.state.option} style={{ height: '100%', width: '100%' }}/>;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default RiskTrendLine;