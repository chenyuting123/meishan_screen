/**
 * Created by hejie on 2017/4/23.
 *  pdf 雷达图
 */
import './pdf.scss';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, hashHistory } from 'react-router';
import { HJPromise } from 'Utils/hjPromise';
import CHATBBD from 'Utils/bbdCharts';
window.loadedPdf = 'fail';// pdf的雷达图加载是否完成
export default class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tips: ''
        };
    }
    componentDidMount() {
        var _getUrlParm = this.props.location.query;
        if(_getUrlParm.companyId){
            let keyValue = _getUrlParm.keyValue ? _getUrlParm.keyValue : '--';
            this.rdarData(_getUrlParm.companyId, keyValue);
        }else{
            this.setState({
                tips: '未获取到参数'
            });
        }
    }
    /**
     * 查询企业易燃指数雷达图
     */
    rdarData(companyId, type) {
        let _this = this;
        HJPromise({
            url: '/companyDetail/getRadarByCompanyId.do',
            data: {
                companyId: companyId
            }
        }).then((response)=>{
            if(response.content !== null){
                let radarSoureData = response.content.indexRadar === null ? {} : response.content.indexRadar;
                let radar = JSON.parse(radarSoureData); // 雷达图JSON转换
                let radarFormat = {
                    legend: [],
                    indicator: [],
                    series: []
                };
                if(type !== ''){
                    radar = JSON.parse(response.content.indexRadar)[type];
                    if(radar.total_score){
                        delete radar.total_score;
                    }
                    if(radar.platform_score){
                        delete radar.platform_score;
                    }
                    if(radar.platform_state){
                        delete radar.platform_state;
                    }
                }

                for (let items in radar) {
                    if(radar.hasOwnProperty(items)){
                        radarFormat.indicator.push({
                            name: items,
                            max: 100,
                            value: radar[items]
                        });
                        radarFormat.series.push(radar[items]);
                    }
                }
                CHATBBD.bbdRadar({
                    chartName: 'radar-pdf',
                    color: ['#fbc338', '#f76e44', '#79f2df'],
                    title: '',
                    radarRadius: 110,
                    legendShow: false,
                    indicator: radarFormat.indicator,
                    series: [radarFormat.series]
                });
                loadedPdf = 'success';
                // setTimeout(function(){
                //     _this.toPng();
                // }, 1000);
            }else{
                _this.setState({
                    tips: '暂无数据'
                });
            }
        });
    }
    toPng(){
        // html2canvas($('#radar-pdf'), {
        //     onrendered: function (canvas) {
        //         var url = canvas.toDataURL();
        //         console.info(url);
        //         // 以下代码为下载此图片功能
        //         var triggerDownload = $('<a>').attr('href', url).attr('download', 'radar.png').appendTo('body');
        //             triggerDownload[0].click();
        //             triggerDownload.remove();
        //        }
        // });
    }
    render() {
        return (
            <div className="Radar">
                {this.state.tips}
                <div className="radar" id = "radar-pdf"></div>
            </div>
        );
    }
}