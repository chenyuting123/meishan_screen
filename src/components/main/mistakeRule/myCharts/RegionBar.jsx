
import React from 'react';
import BBDLineBar from '../../../common/echarts/BBDLineBar';
import echarts from 'echarts';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';
import { sortArrJson } from 'Utils/formatter';
let Immutable = require('immutable');
class RegionBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }
    componentDidMount() {
        let { area } = this.props;
        this.initChart(area);
    }
    
    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { area } = nextProps;
        let isArea = Immutable.is(area, this.props.area);
        if (!isArea ) {
            this.initChart(area);
        }
    }
   
    initChart(data){
        data = data.sort(sortArrJson('companNumber', ''));
        let xAxisData = [],
            seriesData = [];
        if(data.length > 0){
            for(let i = 0; i < data.length; i++ ){
                xAxisData.push(data[i].city);
                seriesData.push(data[i].companNumber);
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    show: true,
                    textStyle: {
                        color: 'rgba(102, 102, 102, 1)',
                        fontSize: 14
                    },
                    backgroundColor: 'rgba(255,255,255,.9)',
                    axisPointer: {
                        lineStyle: {
                            opacity: 0
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 1,
                        end: 80
                    }
                ],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    name: '',
                    boundaryGap: true,
                    axisTick: {
                        show: false
                    },
                    data: xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#DCDFE2'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        formatter: function(value)
                        {
                            return value.split('').join('\n');
                        },
                        textStyle: {
                            fontSize: 12,
                            color: '#333333'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#DCDFE2'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#F2F2F2'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: '#333333'
                        }
                    }
                },
                series: [{
                    name: '企业数量',
                    type: 'bar',
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#7FCCF3'
                                    },
                                    {
                                        offset: 1,
                                        color: '#1262C4'
                                    }
                                    ]
                                )
                        }
                    },
                    barWidth: 22,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                return params.value;
                            },
                            textStyle: {
                                color: '#333333',
                                fontSize: 12
                            }
                        },
                        emphasis: {
                            show: true,
                            formatter: function (params) {
                                return params.value;
                            }
                        }
                    }
                }
                ]
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
            return;
        }
        
    }
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2" />
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDLineBar option={this.state.option} style={{ height: '100%', width: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default RegionBar;