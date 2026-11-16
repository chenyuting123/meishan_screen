import React from 'react';
import echarts from 'echarts';
import BBDLineArea from '../../../common/echarts/BBDLineArea';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';
import { findCompanyCountGroupByRegion } from '../../../../services/home';
import { NoData } from 'CommonComponents';
import { sortArrJson } from 'Utils/formatter';
let Immutable = require('immutable');
class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true,
            dataList: []
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }

     /**
     * 组件加载完成
     */
    componentDidMount() {
        this.getData(this.props);
    }
    /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo, industry } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        let isEqualIndustry = Immutable.is(industry, this.props.industry);
        if (!isEqualArea || !isEqualIndustry) {
            this.getData(nextProps);
        }
    }

    /**
     * 获取数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     */
    getData(nextProps) {
        let { isCountry, city, province, industry } = nextProps || this.props;
        let obj = {
            province: '浙江省',
            city: city,
            industry: industry === '综合监测' ? '' : industry,
            riskLevel: '高危预警'
        };
        findCompanyCountGroupByRegion(obj).then(({ data }) => {
            this.setState({
                dataList: data.sort(sortArrJson('highCompany', 'sortArrJson')),
                noData: data.length === 0 || !data
            }, ()=>{
                this.initChart(this.state.dataList); 
            });
        }, (error) => {
            console.error(error.message);
        });
    }
   
    initChart(data){
        let yAxisData = [],
            seriesData = [];
        if(data.length > 0){
            for(let i = 0; i < data.length; i++){
                yAxisData.push(data[i].region);
                seriesData.push(data[i].highCompany);
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#E8E8E8',
                            opacity: 0
                        }
                    },
                    backgroundColor: 'rgba(255,255,255,.9)',
                    padding: 5,
                    textStyle: {
                        color: 'rgba(102, 102, 102, 1)',
                        fontSize: 14
                    },
                    formatter: function (obj) {
                        return (
                             '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold">'
                             + obj[0].name
                             + '</div>'
                             + '<label style="color:#666666; font-size:14px; float:left;">' + obj[0].seriesName + '：' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + obj[0].value + '</span>' + '</label>' + '<br>'
                        );
                    }
                },
                grid: {
                    top: '0',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 12,
                            color: '#c5c5c5'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(232,232,232,.05)'
                        }
                    }
                }],
                yAxis: [
                    {
                        type: 'category',
                        data: yAxisData,
                        axisLabel: {
                             // formatter: function(value) {
                             //     return (value / 1000) * 2 + 'k';
                             // },
                            textStyle: {
                                fontSize: 12,
                                color: '#c5c5c5'
                            },
                            show: true
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(232,232,232,.05)'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '企业数量',
                        type: 'bar',
                        data: seriesData,
                        barWidth: '40',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
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
                        }
                    }
                ]
            };
             
            this.setState({
                option: option,
                isLoading: false
            });
        }else{
            this.setState({ option: null,
                isLoading: true }); 
            return;
        }
    }
    
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <NoData isNoData={true}/>
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDLineArea  option={this.state.option} style={{ height: '100%', width: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default BarChart;