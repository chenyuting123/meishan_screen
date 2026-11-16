/**
 * Created by ashima on 2017/7/04.
 * Remark 行业事件分析
 */
import './eventAnalysis.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import CHATBBD from 'Utils/bbdCharts';
import { HJPromise } from 'Utils/hjPromise';
import { Swicth } from '../../../UI/index';
import { eventDate, sortArrJson, extendJson, windowOpenByUrl } from 'Utils/formatter';

export default class EventAnalysis extends Component {
    constructor(props){
        super(props);
        this.state = {
            eventType: 'dataapi_hongjing_hoteventList',
            eventDetail: {
                date: '',
                name: '',
                value: 0,
                industry: '',
                value2: 0
            } // 当前默认显示详情事件
        };
    }
    
    componentDidMount() {
        this.getInvoke();
    }

    /**
     * 获取事件
     * @return {[type]} [description]
     */
    getInvoke(){
        let _this = this;
        HJPromise({
            url: '/api/invoke/data.do',
            data: {
                apiId: _this.state.eventType
            }
        }).then((response)=>{
            this.dataFormattingInvoke(response.content.sort(sortArrJson('pubdate', 'isAsc')));
        });
    }

    /**
     * 事件数据格式化
     * @return {[type]} [description]
     * 如果是30天热点事件的话，纵坐标叫：事件活跃度，如果是30天负面事件的tab，纵坐标就是事件负面情感值
     */
    dataFormattingInvoke(data){

        let _this = this;
        let getFormatData = [];
        let getFormatDataJson = {
            交易场所: {},
            网络借贷: {},
            私募基金: {},
            新兴金融: {}
        };
        let eventIndustry = {
            交易场所: '交易场所',
            网络借贷: '网络借贷',
            私募基金: '私募基金',
            新兴金融: '新兴金融'
        };
        let itemData = [];
        let xAxisDateJson  = {};

        for (let i = 0; i < data.length; i++) {
            // eventIndustry[data[i].event_industry] = data[i].event_industry;
            // getFormatDataJson[data[i].event_industry] = {}; // 获取所有行业
            xAxisDateJson[data[i].pubdate] = {}; // 获取所有数据节点，以便于补缺每个行业数据
        }
        for (let j = 0; j < data.length; j++) {
            let industry = data[j].event_industry;
            for(let item in eventIndustry){
                if(eventIndustry.hasOwnProperty(item)){
                    let itemData = {};
                    let pubdate = data[j].pubdate;
                    if(industry === item){
                        itemData = {
                            name: pubdate, 
                            value: this.state.eventType === 'dataapi_hongjing_hoteventList' ? data[j].event_activity : data[j].event_evaluate,
                            date: data[j].event_name,
                            value2: data[j].event_activity,
                            industry: data[j].event_industry
                        }; 
                        if(getFormatDataJson[industry].length > 10){
                            return;
                        }
                        getFormatDataJson[industry][pubdate] = itemData;
                    }
                }
            }
        }
        
        // 数据
        let legendData = []; // 图例
        let seriesData = [];
        for (let item in getFormatDataJson){
            if(getFormatDataJson.hasOwnProperty(item)){
                let  newSeries = extendJson(xAxisDateJson, getFormatDataJson[item]);
                legendData.push(item);
                seriesData.push(newSeries);
            }

        }

        // 横坐标
        let xAxisDate  = []; 
        for (let item in xAxisDateJson){
            if(xAxisDateJson.hasOwnProperty(item)){
                xAxisDate.push(item);
            }
        }
        // 根据感情值或者活跃度得到最大值的一个事件，触发右边默认加载事件
        let sortKey = this.state.eventType === 'dataapi_hongjing_hoteventList' ? 'event_activity' : 'event_evaluate';
        let getBySortData = data.sort(sortArrJson(sortKey));
        _this.setState({
            eventDetail: {
                date: getBySortData[0].event_name,
                name: getBySortData[0].pubdate,
                value: this.state.eventType === 'dataapi_hongjing_hoteventList' ? Math.abs(getBySortData[0].event_activity) : Math.abs(getBySortData[0].event_evaluate),
                industry: getBySortData[0].event_industry,
                value2: 0
            }
        }, function(){
            _this.getInvokeDetail();
        });

        CHATBBD.scatterBase({
            chartName: 'eventChart',
            left: '10%',
            right: '5%',
            top: 100,
            bottom: 40,
            min: this.state.eventType === 'dataapi_hongjing_hoteventList' ? 0 : -100,
            splitNumber: this.state.eventType === 'dataapi_hongjing_hoteventList' ? 5 : 10,
            formatterType: this.state.eventType,
            axisLineShow: '#e5ebf1',
            xAxisDate: xAxisDate,
            legendData: legendData,
            series: seriesData,
            yAxisName: this.state.eventType === 'dataapi_hongjing_hoteventList' ? '事件活跃指数' : '事件情感指数'
        }, function(param){
            _this.setState({
                eventDetail: param.data
            }, function(){
                _this.getInvokeDetail();
            });
        });
    }

        /**
     * 获取当前事件详情
     * @return {[type]} [description]
     */
    getInvokeDetail(){
        let _this = this;
        HJPromise({
            url: '/api/invoke/data.do',
            data: {
                apiId: 'dataapi_hongjing_eventTrend',
                eventName: _this.state.eventDetail.date
            }
        }).then((response)=>{
            let data = response.content.sort(sortArrJson('news_pubdate', 'isAsc')).slice(0, 7);
            let xAxis = [];
            let series = [];
            for (let i = 0; i < data.length; i++) {
                let newDate = data[i].news_pubdate.substring(4, 6) + '-' + data[i].news_pubdate.substring(6, 8);
                xAxis.push(newDate);
                series.push({ 
                    name: data[i].event_name,
                    value: data[i].news_all_count,
                    pubdate: data[i].pubdate,
                    event_evaluate: data[i].event_evaluate,
                    news_all_count: data[i].news_all_count, // 总量
                    news_minus_count: data[i].news_minus_count, // 负面
                    news_middle_count: data[i].news_middle_count, // 中性
                    news_positive_count: data[i].news_positive_count, // 正面
                    news_pubdate: data[i].news_pubdate,
                    
                    event_industry: data[i].event_industry
                });
            }

            CHATBBD.bbdLine({
                chartName: 'eventLineChart',
                legend: ['舆情数量'],
                symbolSize: 5,
                legendShow: false,
                series: [series],
                left: '6%',
                right: '5%',
                top: 30,
                bottom: 100,
                splitAreaShow: true,
                specialFormatter: 'eventLineChart',
                yAxisName: '近期趋势',
                xAxis: xAxis
            }); 
        });
    }

    /**
     * 切换开关
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    switchCallback(state) {
        let eventtype = state === 'true' ? 'dataapi_hongjing_negeventList' : 'dataapi_hongjing_hoteventList';
        this.setState({
            eventType: eventtype
        }, function () {
            this.getInvoke();
        });
    }

    goDetail(name){
        let url = `/main/eventDetail?eventDetailName=${encodeURI(name)}`;
        windowOpenByUrl(url);
    }
    render(){
        let eventDetail = this.state.eventDetail;
        let eventInfo = this.state.eventType === 'dataapi_hongjing_hoteventList' ? '事件活跃指数' : '事件情感指数';
        let eventValue = eventDetail.value > 100 ? 100 : eventDetail.value;
        let eventClassName = eventDetail.value >= 50 ? 'per-item in-value' : 'per-item';
        let eventDetailName = encodeURIComponent(eventDetail.date);
        return (
            <div className="event-analysis home-bottom" >
                <div className="header">
                    <span><em className="iconfont icon-hot"></em>行业事件分析</span>
                </div>  
                <div className="content">
                    <div className="hot-event">
                        {/** 事件开关**/}
                        <Swicth id="event-switch" 
                            checked={'false'} 
                            className={'event-switch'}
                            checkedChildren={'近30天热点事件'} 
                            unCheckedChildren={'近30天负面事件'} 
                            callback={this.switchCallback.bind(this)}/>
                        {/** 气泡图**/}
                        <div className="event-chart" id="eventChart"></div>
                    </div>
                    <div className="hot-event-detail">
                        <div className="header">
                            <div className="detail-name">
                                <span className="text-ellipsis-200 title" title={eventDetail.date}>{eventDetail.date}</span>
                            </div>
                            <span className="event-industry">所属行业：{eventDetail.industry}</span>
                            <a  className="blue-btn"  
                                target="_blank" 
                                onClick={this.goDetail.bind(this, eventDetail.date)}>热点追踪</a>
                        </div>
                        <div className="content">
                            {/** 事件情感指数 **/}
                            <div className="event-score">
                                <h2>{eventInfo}</h2>
                                <div className={eventClassName}>
                                    <span className="per-score display-line" style={{ width: eventValue + '%' }}></span>
                                    <em className="score">{eventValue}</em>
                                </div>
                            </div>
                            <div className="event-line-chart" id="eventLineChart">
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        );  
    }
}