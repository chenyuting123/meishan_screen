
import React from 'react';
import BBDPie from '../../../common/echarts/BBDPie';
// import { getDistributionDatas } from '../../../../services/home';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';

class PieChart extends React.Component {
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
    initChart(datas){
        const { random, PI, cos, sin } = Math;
        // 随机生成占比数据
        const val = random() * 100;
        // 圆心角的一半
        const angle = PI * val / 50 / 2;
        // 渐变起点
        const pointStart = [
            0.5 - 0.5 * cos(angle) * sin(angle),
            0.5 + 0.5 * cos(angle) * cos(angle)
        ];
        // 渐变终点
        const pointEnd = [
            0.5 - 0.5 * sin(angle),
            0.5 + 0.5 * cos(angle)
        ];
        let option = {
            series: [{
                name: '占比',
                type: 'pie',
                startAngle: 90, // 环图起始位置
                radius: ['50%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: ({ data }) => `${data.value.toFixed(2)}%`
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [ {
                    name: '未满足率',
                    value: 100 - val,
                    label: {
                        normal: {
                            show: false,
                            fontSize: 0
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        },
                        emphasis: {
                            color: 'transparent'
                        }
                    },
                    hoverAnimation: false
                }, {
                    name: '满足率',
                    value: val,
                    label: {
                        normal: {
                            fontSize: 16,
                            color: '#0293DC',
                            fontWeight: 'bold',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: pointStart[0],
                                y: pointStart[1],
                                x2: pointEnd[0],
                                y2: pointEnd[1],
                                colorStops: [
                                    // !! 在此添加渐变过程色 !!
                                    { offset: 0, color: '#00B8E7' },
                                    { offset: 1, color: '#046ADB' }
                                ]
                            }
                            // shadowColor: 'rgba(34,192,245,0.8)',
                            // shadowBlur: 10
                        }
                    }
                }]
            }]
        };
        this.setState({
            option: option,
            isLoading: false
        });
    }
    componentDidMount() {
        // this.getDistributionDatas();
        this.initChart();
    }
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2" />
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDPie option={this.state.option} style={{ height: '100%', width: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default PieChart;