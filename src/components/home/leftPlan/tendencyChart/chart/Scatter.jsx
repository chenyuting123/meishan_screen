import React from 'react';
import echarts from 'echarts';
import BBDBubbleGradient from '../../../../common/echarts/BBDBubbleGradient';
import { Grid, LoadingBox, Tip } from 'mtui';
import { getLocal } from 'Utils/storage';
import { getMaximin } from 'Utils/formatter';
import { shouldComponentUpdateWithoutZoom } from '../../../../common/indexComponent/mixins/mixins';

let Immutable = require('immutable');

class Scatter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdateWithoutZoom = shouldComponentUpdateWithoutZoom.bind(this);
    }

    componentDidMount() {
        let { newEcoDevelopTrendData, province } = this.props;
        this.initChart(newEcoDevelopTrendData, province);
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { newEcoDevelopTrendData, province, industry } = nextProps;
        let isNewEcoDevelopTrendData = Immutable.is(newEcoDevelopTrendData, this.props.newEcoDevelopTrendData);
        let isIndustry = Immutable.is(industry, this.props.industry);
        let isProvince = Immutable.is(province, this.props.province);
        if (!isNewEcoDevelopTrendData || !isProvince || !isIndustry ) {
            this.initChart(newEcoDevelopTrendData, province);
        }
    }

    initChart(data, province) {
        let xAxisData = [];
        let companyData = [];
        let totalRegAmount = [];
        let ecdemicCompanyCount = [];
        let seriesArr = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                xAxisData.push(data[i].year);
                companyData.push(data[i].companyCount);
                totalRegAmount.push(data[i].totalRegAmount);
                ecdemicCompanyCount.push(data[i].ecdemicCompanyCount);
            }
            let maxNum = getMaximin(totalRegAmount, 'max');
            companyData = companyData.map((ite, index) => {
                return { value: ite, symbolSize: 30 + 60 * Math.sqrt(totalRegAmount[index] / (maxNum * 2)) };
            });
            let seriesArr1 = [{
                name: '企业总数',
                data: companyData,
                type: 'scatter',
                // symbolSize: function (params) {
                //     console.log(params);
                //     return 25 + 1000000 * num / maxNum;
                // },
                label: {
                    normal: {
                        show: true,
                        // position: 'top',
                        formatter: function (params) {
                            return params.value + '家';
                        },
                        textStyle: {
                            color: '#FFFFFF',
                            fontSize: 12
                        }
                    },
                    emphasis: {
                        show: true,
                        formatter: function (params) {
                            return params.value + '家';
                        }
                        // position: 'top'
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'RGBA(129, 192, 241, .7)'
                        }, {
                            offset: 1,
                            color: 'RGBA(129, 192, 241, .7)'
                        }])
                    }
                }
            }
            ];
            seriesArr = seriesArr1;
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
                        let total = null,
                            cdemicCompany = null;
                        data.length !== 0 && data.map((item, key) => {
                            if (item.year === obj[0].name) {
                                return total = item.totalRegAmount,
                                    cdemicCompany = item.ecdemicCompanyCount;
                            }
                        });
                        return (
                            province === '全国' ?
                                '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold;">'
                                + obj[0].name
                                + '年</div>'
                                + '<lable style="color:#666666; font-size:14px; float:left;">' + obj[0].seriesName + '：' + '</lable>' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + obj[0].value + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                                + '<lable style="color:#666666; font-size:14px; float:left;"> 注册资本总额：' + '</lable>' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + Math.round((total / 100000000) * 100) / 100 + '</span>' + '<span style="font-size:12px; color:#666666">亿元</span>' + '<br>'
                                :
                                '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold;">'
                                + obj[0].name
                                + '年</div>'
                                + '<lable style="color:#666666; font-size:14px; float:left;">' + obj[0].seriesName + '：' + '</lable>' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + obj[0].value + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                                + '<lable style="color:#666666; font-size:14px; float:left;"> 注册资本总额：' + '</lable>' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + Math.round((total / 100000000) * 100) / 100 + '</span>' + '<span style="font-size:12px; color:#666666">亿元</span>' + '<br>'
                                // + '<lable style="color:#666666; font-size:14px; float:left;">外省市投资本区域企业：' + '</lable>' + '<span style="font-size: 16px; color: #74EFDE; font-weight: bold">' + cdemicCompany + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                        );
                    }
                },
                grid: {
                    top: '15%',
                    bottom: '5%',
                    containLabel: true
                },
    
                xAxis: [
                    {
                        name: '',
                        axisLabel: {
                            textStyle: {
                                fontSize: 12,
                                color: '#C4C4C4',
                                fontWeight: 'bold'
                            },
                            rotate: 0
                        },
                        type: 'category',
                        data: xAxisData,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(232,232,232,.05)'
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '单位（家）',
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 10
                        },
                        // splitNumber: 7,
                        splitLine: {
                            show: false,
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
                        },
                        axisLabel: {
                            // formatter: function(value) {
                            //     return (value / 1000000) * 2 + 'M';
                            // },
                            textStyle: {
                                fontSize: 12,
                                color: '#c5c5c5'
                            }
                        }
                    }
                ],
                series: seriesArr
            };
            this.setState({
                option: option,
                isLoading: false
            });
        } else {
            this.setState({
                option: null,
                isLoading: true
            });
        }
    }

    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2" />
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDBubbleGradient option={this.state.option} style={{ width: '100%', height: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default Scatter;