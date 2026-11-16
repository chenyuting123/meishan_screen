import React from 'react';
import echarts from 'echarts';
import BBDBubbleGradient from '../../../../common/echarts/BBDBubbleGradient';
import { Grid, LoadingBox } from 'mtui';
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
        // let { newEcoDevelopTrendData, province } = this.props;
        // this.initChart(newEcoDevelopTrendData, province);
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        // let { newEcoDevelopTrendData, province } = nextProps;
        // let isNewEcoDevelopTrendData = Immutable.is(newEcoDevelopTrendData, this.props.newEcoDevelopTrendData);
        // let isProvince = Immutable.is(province, this.props.province);
        // if (!isNewEcoDevelopTrendData || !isProvince) {
        //     this.initChart(newEcoDevelopTrendData, province);
        // }
    }

    initChart() {
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,.9)',
                padding: 10,
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
                            + '<lable style="color:#666666; font-size:14px; float:left;"> 注册资本总额：' + '</lable>' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + total + '</span>' + '<span style="font-size:12px; color:#666666">元</span>' + '<br>'
                            :
                            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold;">'
                            + obj[0].name
                            + '年</div>'
                            + '<lable style="color:#666666; font-size:14px; float:left;">' + obj[0].seriesName + '：' + '</lable>' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + obj[0].value + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                            + '<lable style="color:#666666; font-size:14px; float:left;"> 注册资本总额：' + '</lable>' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + total + '</span>' + '<span style="font-size:12px; color:#666666">元</span>' + '<br>'
                            + '<lable style="color:#666666; font-size:14px; float:left;">外省市投资本区域企业：' + '</lable>' + '<span style="font-size: 16px; color: #74EFDE; font-weight: bold">' + cdemicCompany + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
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