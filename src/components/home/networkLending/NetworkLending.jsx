/**
 * Created by fuzhihong on 2017/7/5.
 * 首页 - 交易场所交易品种
 */
import './networkLending.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { HJPromise } from 'Utils/hjPromise';
import { sortArrJson } from 'Utils/formatter';
let Immutable = require('immutable');

class NetworkLending extends Component{
    constructor(props){
        super(props);
        this.state = {
            listLoading: '暂无相关数据', // 若无数据 展示的信息
            chartData: [], // 数据源载体
            hasData: false // 判断是否有数据
        };
    }

    /**
     * 组件加载完成
     */
    componentDidMount(){
        let { monitorArea, countryFlag, operatingCity } = this.props;
        this.getData(monitorArea, countryFlag, operatingCity);
    }

    /**
     * 组件将接收新的参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { monitorArea, countryFlag, operatingCity, isDirectliCity, province } = nextProps;
        let isEqualArea = Immutable.is(monitorArea, this.props.monitorArea);
        if(!isEqualArea){
            this.getData(monitorArea, countryFlag, isDirectliCity ? province : operatingCity);
        }
    }

    /**
     * 获取数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     */
    getData(monitorArea, countryFlag, operatingCity){
        let _this = this;
        HJPromise({
            url: '/index/query/tradePlace/getTradePlaceTradeType.do',
            data: {
                city: countryFlag === 'notCity' ? null : countryFlag === 'country' ? operatingCity : monitorArea,
                area: countryFlag === 'country' ? monitorArea : null
            }
        }).then((response)=>{
            if(response.code === 200 && response.content){
                let dataBase = JSON.parse(response.content);
                let setDateBase = [];
                for(let item in dataBase){
                    if(dataBase.hasOwnProperty(item)) {
                        setDateBase.push({
                            name: item,
                            value: dataBase[item]
                        });
                    }
                }
                let responseContent = setDateBase.sort(sortArrJson('value', 'isAsc'));
                let data = [[]];
                let yAxis = [];
                for(let i = 0; i < responseContent.length; i++){
                    yAxis.push(responseContent[i].name);
                    data[0].push(responseContent[i].value);
                }
                this.setState({
                    hasData: true,
                    chartData: {
                        specialFormatter: true,
                        legendShow: false,
                        row: true,
                        chartName: 'tradeVariety',
                        graphic: false,
                        labelTextColor: '#cecece',
                        splitLineColor: 'rgba(69,105,135,.9)',
                        axisLineColor: 'rgba(69,105,135,.9)',
                        axisLineShow: false,
                        ysplitLineShow: false,
                        xsplitLineShow: true,
                        barWidth: '16',
                        gridLeft: '20%',
                        gridTop: '15%',
                        series: data,
                        yAxis: yAxis,
                        legend: yAxis,
                        tooltipBackgroundColor: 'rgba(255,255,255,1)',
                        yAxisName: '交易场所数量',
                        unit: '家',
                        labelName: '交易场所数量'
                    }
                }, function () {
                    CHATBBD.bbdBar(_this.state.chartData);
                });
            }else {
                this.setState({
                    hasData: false
                });
            }
        });
    }
    render(){
        const { monitorArea, industry } = this.props;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return(
            <div className="trade-variety">
                <div className="head">
                    <em className="iconfont icon-xingyexinxihua"> </em>
                    <span className="title">{monitorArea}-{industryTitle}交易品种</span>
                </div>
                {
                    this.state.hasData ?
                        <div className="v-center" id="tradeVariety" style={{ width: '90%', height: '90%' }}></div> :
                        <p className="no-data-info">{this.state.listLoading}</p>
                }
            </div>
        );
    }

}
export default NetworkLending;