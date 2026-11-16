/**
 * Created by ashima on 2017/7/6.
 * Remark 事件追踪
 */
import './eventDetail.scss';
import 'mtui/style.css';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import React, { Component } from 'react';
import perfectScrollbar from 'perfect-scrollbar';
import CHATBBD from 'Utils/bbdCharts';
import { formatDate, formatDateline } from 'Utils/formatter';
import { LoadingBox } from 'mtui/index';

import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;

export default class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.eventBottom = null;
        this.state = {
            loading: false,
            currentPage: 1,
            eventName: this.props.location.query.eventDetailName || '', 
            event_abstract: '', // 简介
            event_name: '', // 标题
            broadcast_trend: { // 事件趋势图
                date: [],
                value: []
            },
            TotalListData: [],
            listData: []
        };
    }
    componentDidMount(){
        let _this = this;
        _this.eventDetail();
        document.addEventListener('scroll', function () {
            setTimeout(function () {
                if(document.body.scrollTop + 300 > _this.eventBottom.offsetHeight){
                    _this.loadMore();
                }
            }, 1000);
        });
        perfectScrollbar.initialize(this.eventContent);
        CHATBBD.bbdWave({
            chartName: 'process-item1'
        });

    }

    componentDidUpdate() {
        perfectScrollbar.update(this.eventContent);
    }   
    componentWillUnmount(){
        document.addEventListener('scroll', null);
        perfectScrollbar.destroy(this.eventContent);
    }

    /**
     * 获取详情
     * @return {[type]} [description]
     */
    eventDetail(){
        let _this = this;
        
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'dataapi_hongjing_hottrack',
                eventName: _this.state.eventName
            }
        }).then((response)=>{
            let data = response.data.data;
            let series = [];
            let xAxis = [];
            // 事件趋势数据
            if(data.broadcast_trend){
                for(let i = 0, trendData = data.broadcast_trend; i < trendData.length; i++ ){
                    let date = trendData[i].news_pubdate.toString();
                    let newDate = date.substring(4, 6) + '-' + date.substring(6, 8);
                    series.push(trendData[i].news_count);
                    xAxis.push(newDate);
                }

                this.setState({
                    broadcast_trend: {
                        date: xAxis,
                        value: series
                    },
                    TotalListData: data.broadcast_process,
                    listData: data.broadcast_process.slice(0, 1 * 5),
                    event_abstract: data.event_abstract,
                    event_name: data.event_name
                }, function(){
                    _this.chartLine();
                });
            }
        });
    }

    /**
     * 事件趋势图
     * @return {[type]} [description]
     */
    chartLine(){
        let interval = 'auto';
        let xAxis = this.state.broadcast_trend.date;
        if(xAxis.length > 8 && xAxis.length <= 16){
            interval = 1;
        }else if(xAxis.length > 16){
            interval = 2;
        }
        CHATBBD.bbdLine({
            chartName: 'eventTrend',
            legend: ['舆情数量'],
            symbolSize: 8,
            legendShow: false,
            series: [this.state.broadcast_trend.value],
            left: '7%',
            right: '5%',
            top: 10,
            bottom: 20,
            splitAreaShow: true,
            xBoundaryGap: false,
            smooth: false,
            width: '90%',
            lineStyleWidth: 4,
            lineStyleOpacity: '0.9',
            lineStyleColor: ['#0393dc'],
            specialItemStyle: true,
            itemStyleBorderWidth: 1,
            symbol: 'circle',
            interval: interval,
            specialFormatter: 'eventTrend',
            xAxis: xAxis
        });
    }
    /**
     * 加载更多
     */
    loadMore(){
        let { TotalListData, currentPage, loading, eventDetailData } = this.state;
        let _this = this;
        this.setState({
            loading: true
        }, function () {
            setTimeout(
                function(){
                    if(currentPage < Math.ceil(TotalListData.length / 5)){
                        let nextPage = currentPage + 1;
                        _this.setState({
                            listData: TotalListData.slice(0, nextPage * 5),
                            currentPage: nextPage,
                            loading: false
                        });
                    }
                }, 1000);
        });

    }
    render() {
        let { listData, TotalListData, currentPage, loading, event_name, eventName, event_abstract } = this.state;
        return (
            <div className="event-tracking">
                <div className="header">
                    {/* 行业热点追踪/{event_name} */}
                    行业热点追踪/{eventName}
                </div>
                <div className="content">
                    <div className="event-top clearfix">
                        <div className="left event-remark">
                            <h2>热点简介</h2>
                            <div className="event-content" ref={eventContent => this.eventContent = eventContent}>
                                <p>{event_abstract === 'NULL' ? '暂无简介。' : event_abstract }</p>
                            </div>
                        </div>
                        <div className="left">
                            <h2>事件趋势</h2>
                            <div className="event-content" id="eventTrend">
                            </div>
                        </div>
                    </div>
                    <div className="event-bottom" ref={c => this.eventBottom = c}>
                        <h2>传播过程</h2>
                        <div className="event-process"  >
                            <div className="item">
                                <div className="date-soure process-item">
                                    <div className="wave" id="process-item1"></div>
                                    <span className="wave-num">{TotalListData.length > 0 ? formatDateline(TotalListData[0].news_pubdate) : null}</span>
                                    {
                                        TotalListData.length > 0 ?
                                            <div className="process-count">共有传播节点<em>{TotalListData.length}</em>条</div> :
                                            null
                                    }
                                </div>

                                <div className="process-lists ">
                                    {
                                        listData.length > 0 ?
                                            listData.map(function(item, index){
                                                let soureMark = index === 0 ? <span className="new_soure">（可能是事件源头，仅供参考）</span> : null;
                                                let news_site =  index === 0 ? item.news_site === '' || item.news_site === null ? null : <span>#{item.news_site}#&nbsp;</span> : null;
                                                return(
                                                    <div className="list " key={index}>
                                                        <div className="list-c">
                                                            <div className="msg">
                                                                <h3>{formatDate(item.news_pubdate)}</h3>
                                                                <div className="paper">{news_site}{item.news_title} {soureMark}</div> 
                                                            </div>
                                                            <span className="radius"><em></em></span>
                                                        </div>
                                                    </div>
                                                );
                                            }.bind(this)) : null
                                    }
                                </div>
                                {
                                    currentPage < Math.ceil(TotalListData.length / 5) ?
                                        loading ?
                                            <div className="loading"><LoadingBox type="loading2"/></div> :
                                            <div className="loadMore"><p onClick={this.loadMore.bind(this)}>加载更多</p></div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}