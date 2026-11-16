/*
* author:TanJun
* describe:MistakeRule
* createTime:2018/6/20
* */
import './index.scss';
import React, { Component } from 'react';
import { Select, Tip, Checkbox, Input, Button } from 'mtui/index';
import IllegalPie from '../mistakeRule/myCharts/IllegalPie';
import ChartScatter from '../mistakeRule/myCharts/ChartScatter';
import RegionBar from '../mistakeRule/myCharts/RegionBar';
import { getSession } from 'Utils/storage';
import CHATBBD from 'Utils/bbdCharts';
import { getProvinces, getCitys, getAreas } from '../../../services/home';
import PageList from '../../common/pageList/PageList';
import { sortArrJson, extendJson, windowOpenByUrl } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { mistakeRulePAPI, specialEventCAPI } from 'Services/mistakeRule';
import { contains } from 'Utils/util';
import { directlyCity, classIndustry } from '../../../constants/common';
import { NoData } from 'CommonComponents';
import { OVERALL, EVENT_DETAIL } from 'RouterPath';
import { switchIndustry, switchIndustryYW } from 'Utils/formatter';
import { DEFAULT_DETAIL } from 'RouterPath';
const { MISTAKE_RULE_PROPERTY, MISTAKE_RULE_ADDRESS_PROPERTY, MISTAKE_RULE_TYPE_COUNTS, MISTAKE_RULE__COMPANY_TOTAL, MONITOR_HOME_YQ, MISTAKE_RULE_TABLELIST } = Services;
const CheckboxGroup = Checkbox.CheckboxGroup;

class SpecialEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceList: ['全国'], // 省份集合
            cityList: ['市'], // 城市集合
            areaList: ['区'], // 区域集合
            selctProvince: '', // 选择的省份
            selctCity: '', // 选择的城市
            selctArea: '', // 选择的城市对应区域
            selctProvinceVal: '全国',
            selctCityVal: '市',
            selctAreaVal: '区',
            provinceShow: 'inline-block', // 直辖市需要隐藏下拉
            cityIsShow: 'inline-block', // 直辖市影藏省市
            cityShow: true,
            areasShow: true, // 区县下拉隐藏状态
            industryType: classIndustry[0].name, // 行业
            industryName: classIndustry[0].name, // 行业名字
            companProperty: [],
            address: [], // 地区分布
            typeCount: [], // 特征事件集中度
            areaInfo: getSession('areaChange').previewInfo, // 默认查看的区域
            noData: false,
            comNoData: false,
            addressNoData: false,
            listLoading: '数据载入中...',
            comTotal: 0,
            yqData: [],
            page: 0,
            pageSize: 10,
            total: 0,
            comType: [],
            isNew: 0,
            isIPO: 0,
            eventType: 'dataapi_hongjing_hoteventList',
            riskWarning: undefined,
            tableList: [], // 列表数据，
            riseDesc: 0,
            joinDateDesc: 0,
            eventDetail: ''
        };
    }

    componentDidMount() {
        this.findByCompanProperty();
        this.findByAddress();
        this.findTypeCounts();
        this.getCompanyTotal();
        this.getYqData();
        this.getTableList();
        this.getProvinces();
        let info = getSession('areaChange');
        let { isCountry, province, previewInfo, city, area, industry, type } = info;
        if (!isCountry) {
            this.setState({
                activeIndex: 0
            });
            let state = {
                provinceShow: 'none',
                cityIsShow: city ? 'none' : 'inline-block',
                cityShow: false,
                areasShow: city ? false : true,
                selctProvince: province,
                selctCity: city ? city : '',
                selctArea: (previewInfo && type === 'area') ? previewInfo : '',
                selctCityVal: city ? city : '市',
                selctAreaVal: (previewInfo && type === 'area') ? previewInfo : '区'
            };
            this.state = { ...this.state, ...state };
            if (contains(directlyCity, province)) {
                let state = {
                    provinceShow: 'none',
                    cityIsShow: 'none',
                    selctProvince: province,
                    selctCity: province,
                    areasShow: false
                };
                this.state = { ...this.state, ...state };
            } else {
                this.getCitys();
            }
            this.getAreas();
        }
        else {
            let state = {
                provinceShow: 'inline-block',
                cityIsShow: 'inline-block',
                cityShow: true,
                areasShow: true,
                selctProvince: province ? province : '',
                selctCity: city ? city : '',
                selctArea: (previewInfo && type === 'area') ? previewInfo : '',
                selctProvinceVal: province ? province : '全国',
                selctCityVal: city ? city : '市',
                selctAreaVal: (previewInfo && type === 'area') ? previewInfo : '区'
            };
            this.state = { ...this.state, ...state };
            this.getProvinces();
            this.getCitys();
        }
    }

    /**
     * 获取省份列表
     * @return {[type]} [description]
     */
    getProvinces = () => {
        getProvinces().then(({ data }) => {
            this.setState({
                provinceList: ['全国', ...data]
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    /**
     * 获取城市列表
     * @return {[type]} [description]
     */
    getCitys = () => {
        let { selctProvince } = this.state;
        getCitys({
            province: selctProvince
        }).then(({ data }) => {
            this.setState({
                cityList: ['市', ...data]
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    /**
     * 获取区县列表
     * @return {[type]} [description]
     */
    getAreas = () => {
        let { selctProvince, selctCity } = this.state;
        getAreas({
            province: selctProvince,
            city: selctCity
        }).then(({ data }) => {
            this.setState({
                areaList: ['区', ...data]
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    /**
     * 省份下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectProvinceOnChange = (e, { children, value }) => {
        let selctProvince = (children === '全国') ? undefined : children;
        if (contains(directlyCity, value)) {
            let state = {
                selctProvince,
                selctProvinceVal: value,
                selctCity: selctProvince,
                cityIsShow: 'none',
                areasShow: false
            };
            this.state = { ...this.state, ...state };
            this.getAreas();
            this.getTableList();
        } else {
            let state = {
                selctProvince,
                selctProvinceVal: value,
                cityShow: children === '全国',
                selctCityVal: '市',
                selctCity: '',
                selctAreaVal: '区',
                selctArea: '',
                cityIsShow: 'inline-block',
                areasShow: true
            };
            this.state = { ...this.state, ...state };
            this.getCitys();
            this.getTableList();
        }

    };
    /**
     * 城市下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectCityOnChange = (e, { children, value }) => {
        let selctCity = (children === '市') ? undefined : children;
        let state = {
            selctCity,
            selctCityVal: value,
            areasShow: children === '市',
            selctAreaVal: '区',
            selctArea: ''
        };
        this.state = { ...this.state, ...state };
        this.getTableList();
        this.getAreas();
    };
    /**
     * 区县下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectAreaOnChange = (e, { children, value }) => {
        let selctArea = (children === '区') ? undefined : children;
        this.setState({
            selctArea,
            selctAreaVal: value
        }, () => {
            this.getTableList();
        });
    };
    /**
     * 行业下拉回调方法
     * @param  {[type]} e    [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

    industryChange = (e, { children, value }) => {
        this.setState({
            industryType: value,
            industryName: children
        }, () => {
            this.getTableList();
        });
    };
    // 新增/上市
    comChange = (data) => {
        this.setState({
            comType: data
        }, () => {
            let selectArr = this.state.comType,
                isNewCompany = contains(selectArr, 'newCompany'),
                isShCompany = contains(selectArr, 'shCompany');
            if (isNewCompany) {
                this.state = { ...this.state, isNew: '1' };
            } else {
                this.state = { ...this.state, isNew: '0' };
            }
            if (isShCompany) {
                this.state = { ...this.state, isIPO: '1' };
            } else {
                this.state = { ...this.state, isIPO: '0' };
            }
            this.getTableList();
        });
    };
    /**
     * 按照字段排序
     * @param  {[type]} type [需要排序的字段]
     * @param  {[type]} dom  [当前要排序的dom]
     */
    sortList = (type, dom) => {
        let domdescAsc = this[dom].className;
        let getDomDescAsc = this.state.descAsc;
        if (domdescAsc.indexOf('des') !== -1) {
            this[dom].className = 'sort asc';
            getDomDescAsc = 2; // 正序（升序）
        } else {
            this[dom].className = 'sort des';
            getDomDescAsc = 1; // 倒序（降序）
        }
        if (type === '风险指数') {
            this.setState({
                riseDesc: getDomDescAsc,
                page: 0
            }, () => {
                this.refsPageList.toPage(this.state.page + 1);
            });
        } else if (type === '进入日期') {
            this.setState({
                joinDateDesc: getDomDescAsc,
                page: 0
            }, () => {
                this.refsPageList.toPage(this.state.page + 1);
            });
        }
    };
    /**
     *  分页点击后执行
     */
    pageCallback = (pageInfo) => {
        this.setState({
            page: pageInfo.current - 1
        }, () => {
            this.getTableList();
        });
    };
    /**
     * 输入页码跳转
     */
    toPage = (e) => {
        let num = parseInt(this.num.getValue(), 10);
        if (!isNumber(num) || num <= 0) {
            return Tip.warning('请输入大于0的整数！');
        }
        this.refsPageList.toPage(this.num.getValue());
    };
    ChartScatterClickEvent(data){
        this.setState({
            riskWarning: data
        }, ()=>{
            this.getTableList();
        });
    }
    render() {
        let { cityList, provinceList, selctProvinceVal, areaList, industryType, companProperty, areaInfo, address, typeCount, noData, comNoData, addressNoData, comTotal, tableList } = this.state;
        const selectList = [{
            name: '新增企业',
            value: 'newCompany'
        }, {
            name: '上市企业',
            value: 'shCompany'
        }];
        let hideTime = false;
        const industryList = classIndustry;
        const provinceOptions = provinceList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        const cityOptions = cityList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        const areaOptions = areaList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        const industryData = industryList.map(item => <Option key={item} value={item.name}>{item.name}</Option>); // 行业
        const checkList = selectList.map(item => <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>);
        return (
            <div className="u-container mistakeRule-home">
                <div className="mistakeRule-title">
                    <span className="title">{areaInfo}-特征事件实时预警企业</span>
                    <span className="tag">{comTotal}家</span>
                </div>
                <div className="mistakeRule-chart">
                    <div className="chart-box left-chart clearfix">
                        <p className="barTitle">特征事件集中度</p>
                        <div className="myChart">
                            {
                                typeCount.length !== 0 ? <ChartScatter dataList={typeCount} callback={this.ChartScatterClickEvent.bind(this)}/> :
                                    <NoData isNoData={noData}/>
                            }
                        </div>
                    </div>
                    <div className="chart-box right-chart clearfix">
                        <p className="barTitle">舆情热点事件</p>
                        <div className="myChart" id="eventChart">

                        </div>
                    </div>
                </div>
                <div className="mistakeRule-chart">
                    <div className="chart-box left-chart clearfix">
                        <p className="barTitle">各行业特征风险预警分布</p>
                        <div className="myChart">
                            {
                                companProperty.length !== 0 ? <IllegalPie pieData={companProperty}/> :
                                    <NoData isNoData={comNoData}/>
                            }

                        </div>
                    </div>
                    <div className="chart-box right-chart clearfix">
                        <p className="barTitle">预警企业地区分布</p>
                        <div className="myChart">
                            {
                                address.length !== 0 ? <RegionBar area={address}/> :
                                    <NoData isNoData={addressNoData}/>
                            }
                        </div>
                    </div>
                </div>
                <div className="mistakeRule-table">
                    <div className="table-top">
                        <div className="table-top-left">
                            <span className="title">特征事件预警企业名单</span>
                            <span className="tag">{this.state.total}</span>
                        </div>
                        <div className="table-top-right">
                            {/* <a href="javascript:void(null)"
                                style={{ display: this.state.exportNumber === 0 ? 'none' : 'inline-block' }}
                                className="export action-user" onClick={this.exportList}>
                                <em className="iconfont icon-xiangxi"></em>导出列表
                            </a> */}
                            <lable className="title">地区选择</lable>
                            <div className="province" style={{ display: this.state.provinceShow }}>
                                <Select value={selctProvinceVal}
                                        style={{ width: 150 }}
                                        modalStyle={{ width: 150, height: 250, background: '#395369', color: '#fff' }}
                                        onChange={this.selectProvinceOnChange}
                                        trigger={'click'} key={+new Date()}>
                                    {provinceOptions}
                                </Select>
                            </div>
                            <div className="city" style={{ display: this.state.cityIsShow }}>
                                <Select
                                    disabled={this.state.cityShow}
                                    value={this.state.selctCityVal}
                                    style={{ width: 150 }}
                                    modalStyle={{ width: 150, height: 250, background: '#395369', color: '#fff' }}
                                    onChange={this.selectCityOnChange}
                                    trigger={'click'} key={+new Date()}>
                                    {cityOptions}
                                </Select>
                            </div>
                            <div className="area">
                                <Select
                                    disabled={this.state.areasShow}
                                    value={this.state.selctAreaVal}
                                    style={{ width: 150 }}
                                    modalStyle={{ width: 150, height: 250, background: '#395369', color: '#fff' }}
                                    onChange={this.selectAreaOnChange}
                                    trigger={'click'} key={+new Date()}>
                                    {areaOptions}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="table-box">
                        <table className="table-theme">
                            <thead>
                            <tr>
                                <td>序号</td>
                                <td>
                                    企业名称
                                    <CheckboxGroup onChange={this.comChange} value={this.state.comType}>
                                        {checkList}
                                    </CheckboxGroup>
                                </td>
                                <td>
                                        <span className="sort des"
                                              ref={riskIndex => this.riskIndex = riskIndex}
                                              onClick={this.sortList.bind(this, '风险指数', 'riskIndex')}>风险指数
                                            <em className="iconfont icon-paixu color-blue"></em>
                                        </span>
                                </td>
                                {/* <td>
                                         <span className="sort des"
                                               ref={joinDate => this.joinDate = joinDate}
                                               onClick={this.sortList.bind(this, '进入日期', 'joinDate')}>进入日期
                                            <em className="iconfont icon-paixu color-blue"></em>
                                        </span>
                                </td> */}
                                <td>
                                    <Select value={industryType} onChange={this.industryChange} style={{ width: 120 }}
                                            modalStyle={{ width: 120, height: 250, color: '#fff' }}
                                            trigger="click">
                                        {industryData}
                                    </Select>
                                </td>
                                <td>注册地区</td>
                                <td>
                                    {/* <span className="sort des"
                                            ref={eventTotal => this.eventTotal = eventTotal}
                                            onClick={this.sortList.bind(this, '违规数量', 'eventTotal')}> */}
                                    特征事件数量
                                    {/* <em className="iconfont icon-paixu color-blue"></em>
                                        </span> */}
                                </td>
                                <td>特征事件信息</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableList.length !== 0 ? tableList.map((ite, index) => {
                                    let indexNum = (this.state.page) * this.state.pageSize + index + 1;
                                    return (
                                        <tr key={index}>
                                            <td>{indexNum}</td>
                                            <td>
                                                <span className="btn font18 company-hover text-ellipsis-260"
                                                      title={ite.companyName ? ite.companyName : '-'}
                                                      onClick={this.goToDetail.bind(this, ite.qyxxId, ite.companyName, ite.industry)}>{ite.companyName ? ite.companyName : '-'}</span>
                                            </td>
                                            <td>{ite.riskIndex ? ite.riskIndex : '-'}</td>
                                            {hideTime ?
                                                <td>{ite.approvalDate ? ite.approvalDate.replace(/(.{10}).*/, '$1') : '-'}</td> : null
                                            }
                                            
                                            <td>{ite.industry ? ite.industry : '-'}</td>
                                            <td>{ite.province ? ite.province : null}{ite.city ? ite.city : null}{ite.area ? ite.area : null}</td>
                                            <td>{ite.earlyWarning ? ite.earlyWarning.length : 0}</td>
                                            <td>{ite.earlyWarning ? ite.earlyWarning.toString() : '-'}</td>
                                        </tr>
                                    );
                                }) : <tr>
                                    <td colSpan="8">{this.state.listLoading}</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                        <div className="page-box pageStyle" style={{ display: tableList.length > 0 ? 'block' : 'none' }}>
                            <PageList
                                ref={(c) => {
                                    this.refsPageList = c;
                                }}
                                current={this.state.page + 1}
                                pageSize={this.state.pageSize}
                                callback={this.pageCallback}
                                total={this.state.total}
                                isShow={true}/>
                            &nbsp;第&nbsp;<Input style={{ width: 50 }} defaultValue="" ref={(num) => {
                                this.num = num;
                            }} size="xm" type="text"/>&nbsp;页
                            &nbsp;<Button size="sm" onClick={this.toPage}>跳转</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 各行业特征风险预警分布
    findByCompanProperty = () => {
        let info = getSession('areaChange');
        let { isCountry, province, city, area } = info;
        specialEventCAPI({
            type: MISTAKE_RULE_PROPERTY,
            data: {
                provinceStr: !isCountry ? province : undefined,
                cityStr: city,
                areaStr: area
            }
        }).then(({ data }) => {
            this.setState({
                companProperty: data,
                comNoData: data.length === 0 || !data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 地区分布
    findByAddress = () => {
        let info = getSession('areaChange');
        let { isCountry, province, city, area } = info;
        specialEventCAPI({
            type: MISTAKE_RULE_ADDRESS_PROPERTY,
            data: {
                provinceStr: !isCountry ? province : undefined,
                cityStr: city,
                areaStr: area
            }
        }).then(({ data }) => {
            this.setState({
                address: data,
                addressNoData: data.length === 0 || !data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 特征事件集中度
    findTypeCounts = () => {
        let info = getSession('areaChange');
        let { isCountry, province, city, area } = info;
        specialEventCAPI({
            type: MISTAKE_RULE_TYPE_COUNTS,
            data: {
                provinceStr: !isCountry ? province : undefined,
                cityStr: city,
                areaStr: area
            }
        }).then(({ data }) => {
            this.setState({
                typeCount: data,
                noData: data.length === 0 || !data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 获取企业总数
    getCompanyTotal = () => {
        let info = getSession('areaChange');
        let { isCountry, province, city, area } = info;
        specialEventCAPI({
            type: MISTAKE_RULE__COMPANY_TOTAL,
            data: {
                provinceStr: !isCountry ? province : undefined,
                cityStr: city,
                areaStr: area,
                type: 2
            }
        }).then(({ data }) => {
            this.setState({
                comTotal: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 获取舆情热点
    getYqData = () => {
        mistakeRulePAPI({
            type: MONITOR_HOME_YQ
        }).then(({ data }) => {
            this.dataFormattingInvoke(data.data.sort(sortArrJson('pubdate', 'isAsc')));
        }, (error) => {
            console.error(error.message);
        });
    };
    /**
     * 事件数据格式化
     * @return {[type]} [description]
     * 如果是30天热点事件的话，纵坐标叫：事件活跃度，如果是30天负面事件的tab，纵坐标就是事件负面情感值
     */
    dataFormattingInvoke = (data) => {
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
        let xAxisDateJson = {};

        for (let i = 0; i < data.length; i++) {
            // eventIndustry[data[i].event_industry] = data[i].event_industry;
            // getFormatDataJson[data[i].event_industry] = {}; // 获取所有行业
            xAxisDateJson[data[i].pubdate] = {}; // 获取所有数据节点，以便于补缺每个行业数据
        }
        for (let j = 0; j < data.length; j++) {
            let industry = data[j].event_industry;
            for (let item in eventIndustry) {
                if (eventIndustry.hasOwnProperty(item)) {
                    let itemData = {};
                    let pubdate = data[j].pubdate;
                    if (industry === item) {
                        itemData = {
                            name: pubdate,
                            value: this.state.eventType === 'dataapi_hongjing_hoteventList' ? data[j].event_activity : data[j].event_evaluate,
                            date: data[j].event_name,
                            value2: data[j].event_activity,
                            industry: data[j].event_industry
                        };
                        if (getFormatDataJson[industry].length > 10) {
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
        for (let item in getFormatDataJson) {
            if (getFormatDataJson.hasOwnProperty(item)) {
                let newSeries = extendJson(xAxisDateJson, getFormatDataJson[item]);
                legendData.push(item);
                seriesData.push(newSeries);
            }

        }

        // 横坐标
        let xAxisDate = [];
        for (let item in xAxisDateJson) {
            if (xAxisDateJson.hasOwnProperty(item)) {
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
        }, (param) => {
            _this.setState({
                eventDetail: param.data
            }, () => {
                _this.goDetail();
            });
        });
    };
    // 跳转事件页面
    goDetail = () => {
        let name = this.state.eventDetail.date;
        let url = `${OVERALL}/${EVENT_DETAIL}?eventDetailName=${encodeURIComponent(name)}`;
        windowOpenByUrl(url);
    };
    // 获取列表数据
    getTableList = () => {
        let info = getSession('areaChange');
        let { isCountry, province, city, area } = info;
        let { page, pageSize, isNew, isIPO, industryName, riskWarning, riseDesc, joinDateDesc } = this.state;
        let { selctProvince, selctCity, selctArea } = this.state;
        mistakeRulePAPI({
            type: MISTAKE_RULE_TABLELIST,
            data: {
                page,
                pageSize,
                type: 2,
                provinceStr: selctProvince || (!isCountry ? province : undefined),
                cityStr: selctCity || city,
                areaStr: selctArea || area,
                characteristicsOne: isNew,
                characteristicsTow: isIPO,
                riseDesc: riseDesc,
                joinDateDesc: joinDateDesc,
                industry: industryName === classIndustry[0].name ? undefined : industryName,
                riskWarning
            }
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据！'
            }, () => {
                this.setState({
                    tableList: data.content,
                    total: data.totalElements
                });
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 跳转详情页
    goToDetail(qyxxId, companyName, industry) {
        window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${companyName}/${qyxxId}/${switchIndustryYW(industry)}`);
    }
}

export default SpecialEvent;
