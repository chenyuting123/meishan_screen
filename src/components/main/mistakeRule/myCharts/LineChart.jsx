
import React from 'react';
import BBDLineBar from '../../../common/echarts/BBDLineBar';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';
import { sortArrJson } from 'Utils/formatter';
let Immutable = require('immutable');
class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }
    componentDidMount() {
        let { lineData } = this.props;
        this.initChart(lineData);
    }
    
    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { lineData } = nextProps;
        let isLineData = Immutable.is(lineData, this.props.lineData);
        if (!isLineData) {
            this.initChart(lineData);
        }
    }
   
    initChart(content){
        let data = content.map((item) => {
            item.num = new Date(item.startTime).getTime();
            return item;
        });
        data = data.sort(sortArrJson('num', 'sortArrJson'));
        let xAxisData = [],
            seriesData = [];
        if(data.length > 0){
            for(let i = 0; i < data.length; i++ ){
                xAxisData.push(data[i].startTime);
                seriesData.push(data[i].companNumber);
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    show: false
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
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
                    type: 'line',
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            color: '#31B8F3'
                        }
                    },
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
                    },
                    cursor: 'default'
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

export default LineChart;