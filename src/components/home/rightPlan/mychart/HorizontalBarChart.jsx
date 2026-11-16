
import React from 'react';
import echarts from 'echarts';
import BBDHorizontalBar from '../../../common/echarts/BBDHorizontalBar';
import { getDistributionDatas } from '../../../../services/home';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';

class HorizontalBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }
    
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.dataType !== this.props.dataType) {
    //         this.setState({
    //             dataType: nextProps.dataType
    //         }, () => {
    //             this.getDistributionDatas(this.state.dataType);
    //         });
    //     }
    // }
    // getDistributionDatas = () => {
    //     getDistributionDatas().then((data) => {
    //         if (data.code === 200) {
    //             this.initChart(data.content);
    //         }
    //     }, (error) => {
    //         console.log(error.message);
    //     });
    // }
    initChart(){
        let option = {
            title: {
                left: 0,
                padding: 12,
                textStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 18
                },
                text: '四川省-区域高危企业Top3'
            },
            legend: {
                bottom: 20,
                textStyle: {
                    color: '#fff'
                },
                data: ['钥匙量', '有效房源量'],
                show: false
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '15%',
                containLabel: true
            },
            
            tooltip: {
                show: 'true',
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'value',
                axisTick: { show: false },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    show: false
                },
                show: false
            },
            yAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    data: ['成都', '甘孜藏族自治州', '凉山彝族自治州']
                }
                    
            ],
            series: [
                {
                    name: '有效房源量',
                    type: 'bar',
                    // yAxisIndex:1,
                    
                    itemStyle: {
                        normal: {
                            show: true,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#046ADB'
                            }, {
                                offset: 1,
                                color: '#00B8E7'
                            }], false),
                            barBorderRadius: 50,
                            borderWidth: 0,
                            borderColor: '#333'
                        }
                    },
                    barGap: '0%',
                    barCategoryGap: '50%',
                    data: [120, 132, 101],
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: function(params) {
                                return params.data.name;
                            },
                            textStyle: {
                                color: '#bcbfff' // color of value
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
    }
    componentDidMount() {
        this.initChart();
    }
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2" />
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDHorizontalBar option={this.state.option} style={{ height: '100%', width: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default HorizontalBarChart;