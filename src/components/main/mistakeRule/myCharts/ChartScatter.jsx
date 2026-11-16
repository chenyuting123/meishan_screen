import React from 'react';
import echarts from 'echarts';
import BBDBubbleGradient from '../../../common/echarts/BBDBubbleGradient';
import { Grid, LoadingBox } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';
import { getMaximin } from 'Utils/formatter';

let Immutable = require('immutable');

class ChartScatter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdateWithoutZoom = shouldComponentUpdateWithoutZoom.bind(this);
    }

    componentDidMount() {
        let { dataList } = this.props;
        this.initChart(dataList);
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { dataList } = nextProps;
        let isDataList = Immutable.is(dataList, this.props.dataList);
        if (!isDataList) {
            this.initChart(dataList);
        }
    }

    shouldComponentUpdate() {
        let { isLoading } = this.state;
        return isLoading;
    }

    initChart(data) {
        if (data.length > 0) {
            let plantCap = data;
            var datalist = [{
                offset: [20, 65],
                symbolSize: 80,
                opacity: .95,
                color: 'rgba(49, 184, 243, 1)'
            }, {
                offset: [50, 80],
                symbolSize: 80,
                opacity: .88,
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(24, 103, 198, 1)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(120, 197, 240, 1)'
                    }
                    ]
                )
            }, {
                offset: [75, 70],
                symbolSize: 70,
                opacity: .84,
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(41, 190, 246, 1)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(89, 219, 235, 1)'
                    }
                    ]
                )
            }, {
                offset: [60, 30],
                symbolSize: 65,
                opacity: .8,
                color: 'rgba(49, 184, 243, 1)'
            }, {
                offset: [30, 20],
                symbolSize: 90,
                opacity: .75,
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(41, 190, 246, 1)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(89, 219, 235, 1)'
                    }
                    ]
                )
            }];
            var datas = [];
            let numberArr = [];
            let keyArr = [];
            let key = null;
            for (let i = 0; i < plantCap.length; i++) {
                var item = plantCap[i];
                var itemToStyle = datalist[i];
                numberArr.push(item.number);
                datas.push({
                    name: item.name,
                    value: itemToStyle.offset,
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: 11,
                                color: '#333'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: itemToStyle.color,
                            opacity: itemToStyle.opacity
                        }
                    }
                });
                keyArr.push(i);
            }
            let maxNum = getMaximin(numberArr, 'max');
            let minNum = getMaximin(numberArr, 'min');
            let sizeArr = [];
            keyArr.map((ite) => {
                // sizeArr.push(60 * Math.sqrt(numberArr[ite] / (minNum * 2)) - 100 + 60 * Math.sqrt(numberArr[ite] / (maxNum * 2)));
                sizeArr.push(50 + 80 * Math.sqrt(numberArr[ite] / (maxNum * 2)));
                datas[ite].symbolSize = sizeArr[ite];
            });

            let option = {
                grid: {
                    show: false,
                    top: 10,
                    bottom: 10
                },
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
                            val = null;
                        plantCap.length !== 0 && plantCap.map((item, key) => {
                            if (item.name === obj[0].name) {
                                return total = item.number,
                                    val = item.scales;
                            }
                        });
                        return (
                            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold;">'
                            + obj[0].name
                            + '</div>'
                            + '<lable style="color:#666666; font-size:14px; float:left;">总数：' + '：' + '</lable>' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + total + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                            + '<lable style="color:#666666; font-size:14px; float:left;"> 所占比率：' + '</lable>' + '<span style="font-size: 16px; color: #81C0F1; font-weight: bold">' + Number(val * 100).toFixed(2) + '%</span>' + '<br>'

                        );
                    }
                },
                xAxis: [{
                    gridIndex: 0,
                    type: 'value',
                    show: false,
                    min: 0,
                    max: 100,
                    nameLocation: 'middle',
                    nameGap: 5
                }],
                yAxis: [{
                    gridIndex: 0,
                    min: 0,
                    show: false,
                    max: 100,
                    nameLocation: 'middle',
                    nameGap: 30
                }],
                series: [{
                    type: 'scatter',
                    symbol: 'circle',
                    // symbolSize: 120,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            color: '#fff',
                            textStyle: {
                                fontSize: '20'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#00acea'
                        }
                    },
                    data: datas
                }]
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

    clickEvent(data) {
        this.props.callback(data.name);
    }

    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2"/>
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDBubbleGradient option={this.state.option} style={{ width: '100%', height: '100%' }}
                                          callback={this.clickEvent.bind(this)}/>;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default ChartScatter;