/*
* author:TanJun
* describe:RelatedAnalysis
* createTime:2018/7/10
* */
import './index.scss';
import React, { Component } from 'react';
import { Button } from 'antd';
import { Select } from 'mtui/index';
import { browserHistory } from 'react-router';
import echarts from 'echarts';
import { Services } from '../../../../../constants/common';
import { analyzeController } from '../../../../../services/analysis';
import giftImageUrl from '../../../../../images/analysis/icon00.png';
import peopleImgUrl from '../../../../../images/analysis/people.png';
import companyImgUrl from '../../../../../images/analysis/company.png';
import CHATBBD from '../../../../../utils/bbdCharts';

import { HJPromise } from '../../../../../utils/hjPromise';

const { ANALYZE_KEYREL_TOP5, ANALYZE_RELATION_COUNT, ANALYZE_RELATION_TREND, ANALYZE_INDUSTRY_TREND, ANALYZE_INDUSTRY_DIC } = Services;
const colors = ['#31B8F3', '#FAC339', '#F76D43', '#72EFDE'];

class RelatedAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'RelatedAnalysis',
            companyId: props.params.companyId,
            companyName: props.params.companyName,
            Association: [],
            RelatedCompany: [
                {
                    name: '风险关联方 企业总数',
                    value: '',
                    key: 'riskTot',
                    color: 'RGBA(20, 173, 255, 0.5)',
                    backgroundcolor: 'RGBA(20, 173, 255, 0.3)'
                },
                {
                    name: '高危企业',
                    value: '',
                    key: 'highRisk',
                    color: 'RGBA(255, 17, 17, 0.5)',
                    backgroundcolor: 'RGBA(255, 17, 17, 0.3)'
                },
                {
                    name: '重点关注企业',
                    value: '',
                    key: 'emphasis',
                    color: 'RGBA(247, 109, 67, 0.5)',
                    backgroundcolor: 'RGBA(247, 109, 67, 0.3)'
                },
                {
                    name: '黑名单企业',
                    value: '',
                    key: 'black',
                    color: 'RGBA(0, 0, 0, 0.4)',
                    backgroundcolor: 'RGBA(0, 0, 0, 0.3)'
                }
            ],
            top5: [],
            relationtrend: [],
            relationIndex: '1',
            frShow: false,
            insdustryTrend: [],
            industryIndex: '1',
            industryShow: false,
            industryDic: { 'A': '农、林、牧、渔服务业', 'B': '采矿业', 'C': '制造业', 'D': '电力、热力、燃气及水生产和供应业', 'E': '建筑业', 'F': '批发和零售业', 'G': '交通运输、仓储和邮政业', 'H': '住宿和餐饮业', 'I': '信息传输、软件和信息技术服务业', 'J': '金融业', 'K': '房地产业', 'L': '租赁和商务服务业', 'M': '科学研究和技术服务业', 'N': '水利、环境和公共设施管理业', 'O': '居民服务、修理和其他服务业', 'P': '教育', 'Q': '卫生', 'R': '文化、体育和娱乐业', 'S': '公共管理、社会保障和社会组织', 'T': '国际组织', 'Z': '其他' }
        };
    }

    componentWillMount(){
        this.associationCount();
        this.industryDic();
    }

    componentDidMount(){
        // this.legalpersonCount();
        // this.industryCount();
        
        // this.relatedCompanyCount();

        this.keyrelTop5();

        this.relationtrend();
        // this.industrytrend();
    }

    // 关联方统计饼图
    RelatedAnalysisPie(obj){
        let data = [];

        switch (obj.name) {
            case 'relatedTot': 
                data = [
                    { value: obj.relaLegal, name: '法人' },
                    { value: obj.relaNatural, name: '自然人' }
                ];
                break;
            case 'dirTot':
                data = [
                    { value: obj.dirLegal, name: '法人' },
                    { value: obj.dirNatural, name: '自然人' }
                ];
                break;
            case 'indirTot':
                data = [
                    { value: obj.indirLegal, name: '法人' },
                    { value: obj.indirNatural, name: '自然人' }
                ];
                break;
            case 'relationTot':
                data = [
                    { value: obj.relaInvest, name: '投资' },
                    { value: obj.relaManage, name: '管理' }
                ];
                break;
        }

        let mapChart = echarts.init(document.getElementById(obj.name));
        let name = this.relatedTransfer(obj.name);
        let option = {
            tooltip: {
                
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            color: ['#14ADFF', '#72EFDE'],
            legend: {
                orient: 'vertical',
                right: '-3%',
                top: '20%',
                icon: 'circle',
                itemHeight: 12,
                align: 'left',
                formatter: (param) => {
                    let val = '';
                    if(param === '法人' || param === '投资' ){
                        val = data[0].value;
                    }else if(param === '自然人' || param === '管理' ){
                        val = data[1].value;
                    }
                    return `${param} \n ${val}`;
                },
                data: ['法人', '自然人', '投资', '管理']
            },
            graphic: {
                elements: [
                    {
                        type: 'image',
                        style: {
                            image: giftImageUrl,
                            width: 110,
                            height: 110
                        },
                        left: 'center',
                        top: 'center'
                    }
                ]
            },
            series: [
                {
                    name: name,
                    type: 'pie',
                    radius: ['65%', '80%'],
                    avoidLabelOverlap: false,
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                }
            ]
        };
        mapChart.setOption(option);
    }

    // 关联方字段翻译
    relatedTransfer(val){
        switch (val) {
            case 'relatedTot':
                return '关联方总数';
            case 'dirTot':
                return '直接关联';
            case 'indirTot':
                return '间接关联';
            case 'relationTot':
                return '关联关系';
        }
    }
    
    // 关联关系线图
    RelatedAnalysisLine(obj){
        let { id, legend, xAxis, series } = obj;
        let mapChart = echarts.init(document.getElementById(id));

        let tooltip = {};
        if(id === 'industry'){
            tooltip = {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.8)',
                formatter: function (params) {
                    // debugger;
                    let res = '<div style="font-weight:bold; color: #666"><p>' + params[0].name + '</p></div>';
                    for(let i = 0; i < params.length; i++){
                        let data = params[i].data;
                        data = data === undefined ? '' : data + '%';
                        res += `<p style='color: #666'>${params[i].seriesName} : <span style='color: ${params[i].color }'>${data}</span> </p>`;
                    }
                    return res;
                }
            };
        }else{
            tooltip = {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.8)',
                textStyle: {
                    color: '#666'
                }
            };
        }

        let option = {
            tooltip: tooltip,
            legend: {
                data: legend,
                type: 'scroll',
                right: '4%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis
            },
            yAxis: {
                type: 'value',
                axisLabel: {  
                    show: true,  
                    interval: 'auto',  
                    formatter: id === 'industry' ? '{value}%' : '{value}'
                }
            },
            series: series
        };
        mapChart.setOption(option);
    }

    // 关联方(法人)趋势统计
    relationCount(arr){
        let legend = [], dateList = [], seriesData = [];

        arr.map((item, index) => {
            legend.push(item.name);
            let data = [];
            for(let j in item.value){
                dateList.push(j);
                data.push(item.value[j]);
            }
            seriesData.push(
                {
                    name: item.name,
                    type: 'line',
                    data: data
                }
            );
        });
        let list = [...new Set(dateList)];

        let ss = [];
        list.forEach((item) => {
            ss.push(item.slice(0, 4) + '-' + item.slice(4, 7));
        });

        let object = {
            id: 'fr',
            legend: legend,
            xAxis: ss,
            series: seriesData
        };
        this.setState({
            frShow: true
        }, () => {
            this.RelatedAnalysisLine(object);
        });
    }
    relationChange(e){
        let index = e.target.value;
        let s = `${index}`;
        let { relationtrend } = this.state;

        let fr = `nonNaturalPersons${s}d`, risk = `riskNonNaturalPersons${s}d`;
        let data = relationtrend;
        this.setState({
            relationIndex: index
        }, ()=>{
            this.relationCount([{ name: '关联方（法人）总数', value: data[fr] }, { name: '有风险项关联方（法人）数', value: data[risk] }]);
        });
    }

    // 关联方行业统计分析
    industryCount(obj){
        let legend = [], dateList = [], seriesData = [], list = [];
        // let {industryDic} = this.state;
        // if(industryDic.lenght <= 0){
        //     return;
        // }

        for(let i in obj){
            legend.push(this.industryTransfer(i));
            
            for(let j in obj[i]){
                dateList.push(j);
                // data.push(parseFloat(obj[i][j].industryRatio));
            }
            dateList = [...new Set(dateList)];
            dateList.sort(function (a, b) {
                return a > b ? 1 : -1;
            });
        }

        for(let ii in obj){
            let data = [];
            outer:
            for(let k = 0; k < dateList.length; k++){
                for(let jj in obj[ii]){
                    if(dateList[k] === jj){
                        data[k] = parseFloat(obj[ii][jj].industryRatio);
                        continue outer;
                    }else{
                        data[k] = 0;
                    }
                }
            }
            seriesData.push(
                {
                    name: this.industryTransfer(ii),
                    type: 'line',
                    data: data
                }
            );
        }
        let ss = [];
        dateList.forEach((item) => {
            ss.push(item.slice(0, 4) + '-' + item.slice(4, 7));
        });
        
        let object = {
            id: 'industry',
            legend: legend,
            xAxis: ss,
            series: seriesData
        };

        if(obj){
            this.setState({
                industryShow: true
            }, () => {
                this.RelatedAnalysisLine(object);
            });
        }else{
            this.setState({
                industryShow: false
            });
        }
        
    }

    // 关联方及关联关系统计 取值
    associationCount(){
        let { Association } = this.state;

        Association = [
            {
                name: 'relatedTot', // 关联方总数
                value: '',
                relaLegal: '',
                relaNatural: ''
            },
            { 
                name: 'dirTot', // 直接关联
                value: '',
                dirLegal: '',
                dirNatural: ''
            },
            {
                name: 'indirTot', // 间接关联
                value: '',
                indirLegal: '',
                indirNatural: ''
            },
            {
                name: 'relationTot', // 关联关系
                value: '',
                relaInvest: '',
                relaManage: ''
            }
        ];

        analyzeController({
            data: {
                companyId: this.state.companyId
            },
            type: ANALYZE_RELATION_COUNT
        }).then((res) => {
            // debugger;
            let data = res.data;
            for(let i of Association){
                i.value = data[i.name];
                i.relaLegal = data.relaLegal;
                i.relaNatural = data.relaNatural;
                i.dirLegal = data.dirLegal;
                i.dirNatural = data.dirNatural;
                i.indirLegal = data.indirLegal;
                i.indirNatural = data.indirNatural;
                i.relaInvest = data.relaInvest;
                i.relaManage = data.relaManage;
            }
            // 企业数据处理 start
            let { RelatedCompany } = this.state;
            
            RelatedCompany.map((item, index) => {
                switch (item.key) {
                    case 'riskTot':
                        item.value = data.riskTot;
                        break;
                    case 'highRisk':
                        item.value = data.highRisk;
                        break;
                    case 'emphasis':
                        item.value = data.emphasis;
                        break;
                    case 'black':
                        item.value = data.black;
                        break;
                }
            });
            // 企业数据处理 end
            this.setState({
                Association: Association,
                RelatedCompany: RelatedCompany
            }, () => {
                Association.map((item, index) => {
                    this.RelatedAnalysisPie(item);
                });
                RelatedCompany.map((item, index) => {
                    this.wave(item, index);
                });
            });
        }); 
    }

    //
    relatedCompanyCount(){
        let { RelatedCompany } = this.state;
        RelatedCompany.map((item, index) => {
            this.wave(item, index);
        });
    }
    wave(obj, index){
        CHATBBD.bbdWave({
            chartName: `liq_${index}`,
            color: obj.color,
            backgroundColor: obj.backgroundcolor
        });
        // mapChart.setOption(option);
    }

    // 关键自然人与法人 取值
    keyrelTop5(){
        // analyzeController({
        //     data: {
        //         companyId: this.state.companyId
        //     },
        //     type: ANALYZE_KEYREL_TOP5
        // }).then((res) => {
        //     debugger;
        // });
        HJPromise({
            url: '/api/v1.0/company/query/keyreltop5.do',
            type: 'post',
            data: {
                companyId: this.state.companyId
            }
        }).then((res) => {
            let data = res.data, list = [];
            data.map((item, index) => {
                let type = item.relationIsperson === 1 ? 'people' : 'company';
                let detail = [];
                if(type === 'people'){
                    if(item.investBlack === 0 && item.investRisk === 0){
                        detail[0] = [
                            `投资 ${item.investCompany} 家企业`
                        ];
                    }else{
                        detail[0] = [
                            `投资 ${item.investCompany} 家企业(${item.investRisk === 0 ? '' : item.investRisk + '家有风险事件'}${item.investBlack === 0 ? '' : ',' + item.investBlack + '家黑名单'})`
                        ];
                    }
                    if(item.manageBlack === 0 && item.manageRisk === 0){
                        detail[1] = [
                            `管理 ${item.manageCompany} 家企业`
                        ];
                    }else{
                        detail[1] = [
                            `管理 ${item.manageCompany} 家企业(${item.manageRisk === 0 ? '' : item.manageRisk + '家有风险事件'}${item.manageBlack === 0 ? '' : ',' + item.manageBlack + '家黑名单'})`
                        ];
                    }
                }else if(type === 'company'){
                    if(item.investBlack === 0 && item.investRisk === 0){
                        detail[0] = [
                            `投资 ${item.investCompany} 家企业`
                        ];
                    }else{
                        detail[0] = [
                            `投资 ${item.investCompany} 家企业(${item.investRisk === 0 ? '' : item.investRisk + '家有风险事件'}${item.investBlack === 0 ? '' : ',' + item.investBlack + '家黑名单'})`
                        ];
                    }
                    if(item.manageBlack === 0 && item.manageRisk === 0){
                        detail[1] = [
                            `股东 ${item.manageCompany} 家企业`
                        ];
                    }else{
                        detail[1] = [
                            `股东 ${item.manageCompany} 家企业(${item.manageRisk === 0 ? '' : item.manageRisk + '家有风险事件'}${item.manageBlack === 0 ? '' : ',' + item.manageBlack + '家黑名单'})`
                        ];
                    }
                }
                list.push({
                    name: item.relationName,
                    type: type,
                    degree: item.relationDegree,
                    detail: detail
                });
            });
            this.setState({
                top5: list
            });
        });
    }

    // 关联方(法人)趋势统计 取值
    relationtrend(){
        // analyzeController({
        //     data: {
        //         companyId: this.state.companyId
        //     },
        //     type: ANALYZE_RELATION_TREND
        // }).then((res) => {
        //     debugger;
        // });
        HJPromise({
            url: '/api/v1.0/company/query/relationtrend.do',
            type: 'post',
            data: {
                companyId: this.state.companyId
            }
        }).then((res) => {
            this.setState({
                relationtrend: res.data
            }, ()=>{
                let { relationIndex } = this.state;
                let fr = `nonNaturalPersons${relationIndex}d`, risk = `riskNonNaturalPersons${relationIndex}d`;
                let data = res.data;
                this.relationCount([{ name: '关联方（法人）总数', value: data[fr] }, { name: '有风险项关联方（法人）数', value: data[risk] }]);
            });
        });
    }

    // 行业相关统计-行业分布 取值
    industrytrend(){
        analyzeController({
            data: {
                companyId: this.state.companyId
            },
            type: ANALYZE_INDUSTRY_TREND
        }).then((res) => {
            // debugger;
            let { industryIndex } = this.state;
            this.setState({
                insdustryTrend: res.data
            }, ()=>{
                let s = `d${industryIndex}`;
                this.industryCount(res.data[s]);
            });
        });
    }
    industryChange(e){
        let index = e.target.value;
        let s = `d${index}`;
        let { insdustryTrend } = this.state;
        let data = insdustryTrend[s];
        // debugger;
        this.setState({
            industryIndex: index
        }, ()=>{
            this.industryCount(data);
        });
    }
    // 获取行业字典
    industryDic(){
        // analyzeController({
        //     type: ANALYZE_INDUSTRY_DIC
        // }).then((res) => {
        //     debugger;
        // });
        // HJPromise({
        //     url: '/api/v1.0/company/query/industrydic.do',
        //     type: 'post'
        // }).then((res) => {
        //     this.setState({
        //         industryDic: res.data
        //     });
        // });
        let _this = this;
        $.ajax({
            type: 'post',
            url: '/api/v1.0/company/query/industrydic.do',
            // async: false,
            success: (res) => {
                _this.setState({
                    industryDic: res.data
                }, () => {
                    _this.industrytrend();
                });
            }
        });
    }
    // 行业类型转换
    industryTransfer(val){
        let { industryDic } = this.state;
        let name = '';
        for(let i in industryDic){
            if(i === val){
                return name = industryDic[i];
            }
        }
        return name;
    }
    
    render() {
        let { name, Association, RelatedCompany, top5, industryIndex, relationIndex, frShow, industryShow } = this.state;
        return <div className="c-related-analysis">
            <div className="c-related-analysis__box">
                <div className="c-related-analysis__title">
                    关联方及关联关系统计
                    <span><em className="c-related-analysis__box__alert">!</em>默认统计到2度</span>
                </div>
                <div className="c-related-analysis__content half">
                    {Association ? Association.map((item, index) => {
                        return <div  key={index} className="f1">
                            <div id={item.name} className="pie"></div>
                            <div className="pie text" style={{ marginTop: 30, height: '60%' }}>
                                    <p>{item.value}</p>
                                    <p>{this.relatedTransfer(item.name)}</p>
                                </div>
                        </div>;
                    }) : null}
                </div>
            </div>
            <div className="c-related-analysis__box">
                <div className="c-related-analysis__title">
                    风险关联方企业统计
                    <span><em className="c-related-analysis__box__alert">!</em>默认统计到2度</span>
                </div>
                <div className="c-related-analysis__content half">
                    {RelatedCompany.map((item, index) => {
                        return <div className="f1 wave" key={index}>
                                <div  id={`liq_${index}`} className="pie"></div>
                                {item.value === '' ? '' : <div className="pie text">
                                    <p>{item.value}</p>
                                    <p>{item.name}</p>
                                </div>}
                            </div>;
                    })}
                    
                </div>
            </div>
            {/* <div className="c-related-analysis__box">
                <p className="c-related-analysis__title">
                    企业实际控制人
                </p>
                <div className="c-related-analysis__content half">
                    {name}
                </div>
            </div> */}
            <div className="c-related-analysis__box">
                <div className="c-related-analysis__title">
                    关键自然人与法人
                    
                </div>
                <div className="c-related-analysis__content half">
                    {top5 ? top5.map((item, index) => {
                        return <div className="people" key={index}>
                                    <div className={`index s${index + 1}`}>{index + 1}</div>

                                    <div className="pic">
                                        <div className="pic_outline">
                                            <img src={item.pic ? item.pic : (item.type === 'people' ? peopleImgUrl : companyImgUrl)}/>
                                        </div>
                                    </div>
                                    <div className="fr_detail">
                                        <div className="name">{item.name}</div>
                                        {item.detail ? item.detail.map((item, index) => {
                                            return <div className="fr_detail_content" key={index} title={item}>{item}</div>;
                                        }) : null}
                                    </div>
                                    <div className="dia">
                                        <span>关联维度：<i>{item.degree}</i>度</span>
                                    </div>
                                </div>;
                    }) : null}
                    
                </div>
            </div>
            <div className="c-related-analysis__box">
                <div className="c-related-analysis__title">
                    关联方(法人)趋势统计
                    <span><em className="c-related-analysis__box__alert">!</em>只统计关联方法人总数和有风险事件关联方法人数</span>
                    <div className="right">
                        <span style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>选择维度</span>
                        <Select value={relationIndex}
                            style={{ width: 120, marginRight: 20 }}
                            onChange={this.relationChange.bind(this)}
                            modalStyle={{ widtd: 120, height: 150, background: '#395369', color: '#fff' }}
                            trigger={'click'} key={+new Date()}>
                            <Option value="1">一度</Option>
                            <Option value="2">二度</Option>
                        </Select>
                    </div>
                </div>
                <div className="c-related-analysis__content">
                {frShow ? <div id="fr" style={{ height: 440, width: '100%' }}></div> : <span>暂无数据</span>}
                </div>
            </div>
            <div className="c-related-analysis__box">
                <div className="c-related-analysis__title">
                    关联方行业统计分析
                    <div className="right">
                        <span style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>选择维度</span>
                        <Select value={industryIndex}
                            style={{ width: 120, marginRight: 20 }}
                            onChange={this.industryChange.bind(this)}
                            modalStyle={{ widtd: 120, height: 150, background: '#395369', color: '#fff' }}
                            trigger={'click'} key={+new Date()}>
                            <Option value="1">一度</Option>
                            <Option value="2">二度</Option>
                        </Select>
                    </div>
                </div>
                <div className="c-related-analysis__content">
                    {industryShow ? <div id="industry" style={{ height: 440, width: '100%' }}></div> : <span>暂无数据</span>}
                </div>
            </div>
        </div>;
    }

}

export default RelatedAnalysis;