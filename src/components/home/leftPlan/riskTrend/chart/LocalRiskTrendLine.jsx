import React from 'react';
import BBDLineBar from '../../../../common/echarts/BBDLineBar';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../../common/indexComponent/mixins/mixins';
import { sortArrJson } from 'Utils/formatter';
let Immutable = require('immutable');

class LocalRiskTrendLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }

    componentDidMount() {
        let { LocalRiskTrendData, province } = this.props;
        this.initLineBar(LocalRiskTrendData, province);
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { LocalRiskTrendData, province } = nextProps;
        let isLocalRiskTrendData = Immutable.is(LocalRiskTrendData, this.props.LocalRiskTrendData);
        let isProvince = Immutable.is(province, this.props.province);
        if (!isLocalRiskTrendData || !isProvince) {
            this.initLineBar(LocalRiskTrendData, province);
        }
    }

    render() {
        let chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2"/>
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

    initLineBar(content, province) {
        let data = content.map((item) => {
            item.num = new Date(item.month).getTime();
            return item;
        });
        data = data.sort(sortArrJson('num', 'sortArrJson'));
        let xAxis = [],
            countryAvgRiskIndexData = [],
            localAvgRiskIndexData = [],
            barName = [];
        if ( province === '浙江省' ) {
            barName = [province];
        } else {    
            barName = ['全省', province];
        }
        if(data.length > 0){
            for(let i = 0; i < data.length; i++){
                if( province === '浙江省' ) {
                    countryAvgRiskIndexData.push(Math.round(data[i].localAvgRiskIndex * 100) / 100);
                } else {
                    countryAvgRiskIndexData.push(Math.round(data[i].countryAvgRiskIndex * 100) / 100);
                }
                localAvgRiskIndexData.push(Math.round(data[i].localAvgRiskIndex * 100) / 100);
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
                        province === '浙江省' ?
                        `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold">
                            ${obj[0].name}
                        </div>
                        <lable style="color:#666666; font-size:14px;float:left;"> 浙江省新金融风险指数： </lable> <span style="font-size: 16px; color: #81C0F1; font-weight: bold"> ${obj[1].value} </span> <br>`
                        :
                        `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold">
                          ${obj[0].name}
                        </div>
                        <lable style="color:#666666; font-size:14px; float:left;"> ${obj[0].seriesName} 新金融风险指数： </lable> <span style="font-size: 16px; color: #F4C300; font-weight: bold"> ${obj[0].value} </span> <br>
                        <lable style="color:#666666; font-size:14px;float:left;"> ${obj[1].seriesName} 新金融风险指数： </lable> <span style="font-size: 16px; color: #81C0F1; font-weight: bold"> ${obj[1].value} </span> <br>`
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
                name: '全省',
                type: 'line',
                barWidth: 14,
                data: countryAvgRiskIndexData,
                itemStyle: {
                    normal: {
                        color: '#0293DC'
                    },
                    emphasis: {}
                }
            }, {
                showSymbol: true,
                name: province,
                type: 'line',
                barWidth: 14,
                data: localAvgRiskIndexData,
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
            isLoading: false
        });
    }

}

export default LocalRiskTrendLine;