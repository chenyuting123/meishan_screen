import React from 'react';
import BBDLineBar from '../../../../common/echarts/BBDLineBar';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../../common/indexComponent/mixins/mixins';
import { getLocal } from 'Utils/storage';
import { sortArrJson } from 'Utils/formatter';
import { isNotEmpty } from '../../../../../utils/util';

let Immutable = require('immutable');
import { indexDefaultAPI } from 'Services/home';
import { Services } from 'Constants/common';
import { NoData } from 'CommonComponents';
import { browserHistory } from 'react-router';
import { CROSS_REGION_PATH } from 'RouterPath';

const { INDEX_CROSS_REGION_TREND } = Services;

class CrossRegionTrendLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true,
            province: getLocal('user').province,  // 当前省份
            noData: false
        };
    }

    componentDidMount() {
        // this.initLineBar(this.props);
        this.getData(this.props);
    }

    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo, industry } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        let isEqualIndustry = Immutable.is(industry, this.props.industry);
        if (!isEqualArea || !isEqualIndustry) {
            // this.initLineBar(nextProps);
            this.getData(nextProps);
        }
    }
    getData = (info) =>{
        if(isNotEmpty(info)){
            let { isCountry, city, area, province, industry, previewInfo } = info;
            indexDefaultAPI({
                type: INDEX_CROSS_REGION_TREND,
                data: {
                    province: !isCountry ? province : '浙江省',
                    city: city,
                    area: area,
                    industry: industry === '综合监测' ? '' : industry
                }
            }).then(({ data }) => {
                this.setState({
                    noData: data.length === 0 || !data
                });
                this.initLineBar(data, info);
            });
        }

    }
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                {/* <LoadingBox info="数据载入中" type="loading2"/> */}
                <NoData isNoData={this.state.noData}/>
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDLineBar option={this.state.option} style={{ height: '100%', width: '100%' }} onEvents={{ 'click': this.onClick }}/>;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }

    onClick = (params) => {
        if(params.componentType === 'series' ){
            let { province, city, area, industry } = this.props;
            browserHistory.push(`${CROSS_REGION_PATH}/${industry}?province=${province || ''}&city=${city || ''}&area=${area || ''}&ym=${params.name}`);
        }
    }
    initLineBar(data, info) {
        let { isCountry, city, area, province, industry, previewInfo } = info;
        let infoData = [];
        let content = data;
        let xAxis = [],
            companyCountData = [],
            highRiskCompanyCountData = [],
            barName = ['在' + previewInfo + '经营外地' + (industry === '综合监测' ? '新金融' : industry) + '企业数', '在' + previewInfo + '经营外地高危企业数'];
        if (content.length > 0) {
            let info = content.map((item) => {
                item.num = new Date(item.month).getTime();
                return item;
            });
            info = info.sort(sortArrJson('num', 'sortArrJson'));
            infoData = info;
            for (let i = 0; i < info.length; i++) {
                companyCountData.push(info[i].companyCount);
                highRiskCompanyCountData.push(info[i].highRiskCompanyCount);
                xAxis.push(info[i].month);
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
                    let setBranchNum = null,
                        investNum = null;
                    infoData.map((item, key) => {
                        if (item.month === obj[0].name) {
                            return setBranchNum = item.byBranchCompanyCount,
                                investNum = item.bySubCompanyCount;
                        }
                    });
                    return (
                        '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px; color: #333; font-weight:bold;">'
                        + obj[0].name
                        + '</div>'
                        + '<lable style="color:#666666; font-size:14px; float:left;">' + obj[0].seriesName.replace('经营外地', '异地经营') + '共:' + '</lable>' + '<span style="font-size: 16px; color: #D16829; font-weight: bold">' + obj[0].value + '</span>' + '<span style="font-size:12px; color:#666666">家；</span>' + '<br>'
                        + '<div style="margin-left: 0px; font-size:12px;">'
                        + '<lable style="color:#666666; float:left;">外地分支机构:</lable>' + '<span style="font-size: 16px; color: #F4C300; font-weight: bold">' + setBranchNum + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                        + '<lable style="color:#666666; float:left;">外地投资子公司:</lable>' + '<span style="font-size: 16px; color: #49DEA4; font-weight: bold">' + investNum + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                        + '<lable style="color:#666666; float:left;">高危风险外地企业:</lable>' + '<span style="font-size: 16px; color: #0293DC; font-weight: bold">' + obj[1].value + '</span>' + '<span style="font-size:12px; color:#666666">家</span>' + '<br>'
                        + '</div>'
                    );
                }
            },
            grid: {
                top: '22%',
                bottom: '5%',
                containLabel: true
            },
            legend: {
                orient: 'vertical',
                // itemHeight: 10,
                // itemWidth: 10,
                top: -6,
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
                    name: '企业数量（家）',
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
                name: '在' + previewInfo + '经营外地' + (industry === '综合监测' ? '新金融' : industry) + '企业数',
                type: 'line',
                barWidth: 14,
                data: companyCountData,
                itemStyle: {
                    normal: {
                        color: '#0293DC'
                    },
                    emphasis: {}
                }
            }, {
                showSymbol: true,
                name: '在' + previewInfo + '经营外地高危企业数',
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
            isLoading: false
        });
    }

}

export default CrossRegionTrendLine;