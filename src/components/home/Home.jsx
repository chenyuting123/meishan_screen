/**
 * Created by ashima on 2017/4/17.
 * Remark 首页入口
 */
import './home.scss';
import React, { Component } from 'react';
import { Modal, Cascader } from 'antd';
import { Tabs, Select, Radio, Tip } from 'mtui/index';
import { getLocal, setSession } from 'Utils/storage';
import emitter from 'Utils/emitter';
import { contains, shouldUpdate } from 'Utils/util';
import ChartPart from './chartPart/ChartPart'; // 企业监测
import Map from './map/Map'; // 地图
import DangerList from './list/DangerList'; // 高危企业
import BlackList from './list/BlackList'; // 黑名单
import AttentionList from './list/AttentionList'; // 重点关注
import MttentionList from './list/MttentionList'; // 持续监控
import FundManagerList from './list/FundManagerList'; // 基金管理人
import FundProductList from './list/FundProductList'; // 基金产品
import LeftPlan from './leftPlan/LeftPlan';  // 首页左侧
import EventAnalysis from './eventAnalysis/EventAnalysis'; // 行业事件分析
import { getProvinces, getCitys, getAreas } from '../../services/home';
import { directlyCity, classIndustry } from '../../constants/common';
import cls from 'classnames';

const TabItem = Tabs.TabItem;
const Option = Select.Option;
const RadioGroup = Radio.RadioGroup;

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hide: true,
            city: '', // 选中城市
            mapTop5: null, // top5数据 
            activeIndex: 0, // 下载高危模块，默认
            mapTop3: [], // top3数据 
            dangerTotleNum: 0, // 行业高危总数
            balckTotleNum: 0, // 黑名单总数
            attentionTotleNum: 0, // 重点关注总数
            mttentionTotleNum: 0, // 黑名单总数
            fundManagerTotleNum: 0, // 基金管理人
            fundProductTotleNum: 0, // 基金产品        
            provinceList: ['全国'], // 省份集合
            cityList: ['市'], // 城市集合
            areaList: ['区'], // 区域集合
            selctProvince: '', // 选择的省份
            selctCity: '', // 选择的城市
            selctArea: '', // 选择的城市对应区域
            selctProvinceVal: '全国',
            selctCityVal: '市',
            selctAreaVal: '区',
            selctBoundArea: '', 
            selctBoundAreaVal: '全部',
            exportTitle: '导出高危企业名单', // 默认导出按钮文字
            exportName: '高危企业',
            exportNumber: 0,
            province: getLocal('user').province, // 登录够返回的用户去权限(识别当前登录用户所属省市)
            exportUrl: '', // 高危企业以及黑名单导出地址
            provinceShow: 'inline-block', // 直辖市需要隐藏下拉
            cityIsShow: 'inline-block', // 直辖市影藏省市 
            cityShow: true,
            areasShow: true, // 区县下拉隐藏状态
            pageIndustry: '', // 页面类型
            dangerIsNew: '', // 高危下载是否最新
            dangerIndustry: '', // 高危下载行业下拉
            dangerIsIPO: '', // 是否上市
            dangerOrder: '', //  排序字段
            dangerDescAsc: '', //  排序方式
            blackIndustry: '', // 黑名单下载行业下拉
            blackDescAsc: '',
            attentionIndustry: '', // 高危下载行业下拉
            attentionIsNew: '',
            attentionIsBreak: '',
            attentionOrder: '',
            attentionDescAsc: '',
            attentionIndustryType: '',
            mttentionIndustry: '', // 黑名单下载行业下拉
            mttentionIndustryType: '',
            mttentionIsNew: '',
            mttentionIsBreak: '',
            mttentionOrder: '',
            mttentionDescAsc: '',
            fundManagerIndustry: '', // 基金管理人
            fundManagerIndustryType: '',
            fundManagerIsNew: '',
            fundManagerIsBreak: '',
            fundManagerOrder: '',
            fundManagerDescAsc: '',
            fundProductIndustry: '', // 基金产品
            fundProductIndustryType: '',
            fundProductIsNew: '',
            fundProductIsBreak: '',
            fundProductOrder: '',
            fundProductDescAsc: '',
            historyArea: null, // 历史监测地
            reportVisible: false, // 导出弹出窗是否显示标记
            tableList: ['高危企业', '黑名单', '重点关注', '持续监控'],
            numberOfTypes: {
                '高危企业': 0,
                '黑名单': 0,
                '重点关注': 0,
                '持续监控': 0,
                '基金管理人企业': 0,
                '基金产品企业': 0
            },
            industryType: '综合监测', // 行业
            industryName: '综合监测', // 行业名字
            IndexTotalInfoData: {}, // 总体分析
            NewEcoDevelopTrendData: [], // 新金融发展趋势图数据
            LocalRiskTrendData: [], // 当地和全国风险指数数据
            selectCountryType: '',  // 北仑区三个地区选项
            isShowTypeBtn: false,  // 是否显示三个选择按钮
            areaBoundList: [], // 级联选择列表
            nowType: ''
        };
        this.dangerTotle = this.dangerTotle.bind(this);
        this.balckTotle = this.balckTotle.bind(this);
        this.attentionTotle = this.attentionTotle.bind(this);
        this.mttentionTotle = this.mttentionTotle.bind(this);
        this.fundManagerTotle = this.fundManagerTotle.bind(this);
        this.fundProductTotle = this.fundProductTotle.bind(this);
    }

    componentDidMount() {
        let { province } = this.state;
        
        emitter.on('goHomePage', this.handleGoHomePage);
        emitter.on('CHANGE_MONITOR_AREA', this.getArea);
        this.getProvinces();

        if (contains(directlyCity, province)) {
            let state = {
                provinceShow: 'none',
                cityIsShow: 'none',
                areasShow: false,
                selctProvince: province,
                selctCity: province
            };
            this.state = { ...this.state, ...state };
            this.getAreas();
        } else {
            let state = {
                provinceShow: 'inline-block',
                cityIsShow: 'inline-block'
            };
            this.state = { ...this.state, ...state };
        }
        
        if (province !== '全国') {
            let state = {
                provinceShow: 'none',
                cityIsShow: 'inline-block',
                selctProvince: province,
                cityShow: false,
                areasShow: true
            };
            this.state = { ...this.state, ...state };
            this.getCitys();
        }
        emitter.emit('CHANGE_MONITING_INDUSTRY', '综合监测');
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITOR_AREA', this.getArea);
        emitter.removeListener('goHomePage', this.handleGoHomePage);
    }

    selectCountryType (e) {
        this.setState({
            selectCountryType: e
        });
    }

    onChange = (value) => {
    }

    render() {
        const { province, cityList, activeIndex, numberOfTypes, tableList, IndexTotalInfoData, provinceList, selctProvinceVal, areaList, industryType,
            selectCountryType, isShowTypeBtn, fundManagerTotleNum, fundProductTotleNum, areaBoundList, selctAreaVal, selctBoundArea, exportName, nowType } = this.state;
        let isDisable = nowType === 'area' ? true : false;
        const selectList = classIndustry.map((item, index) => {
            if (index === 0) {
                return { ...item, name: '综合监测' };
            }
            return item;
        });
        const choseData = selectList.map(item => <Option key={item} value={item.name}>{item.name}</Option>);
        const provinceOptions = provinceList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        const cityOptions = cityList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        const areaOptions = areaList.map((item, key) => <Option key={key} value={item}>{item}</Option>);
        let newAddName1 = industryType === '私募基金' ? '基金管理人企业' : '';
        let newAddNum1 = industryType === '私募基金' ? fundManagerTotleNum : '';
        let newAddName2 = industryType === '私募基金' ? '基金产品企业' : '';
        let newAddNum2 = industryType === '私募基金' ? fundProductTotleNum : '';
        return (
            <div className="home">
                <div className="clearfix home-top">
                    <div className="left test-flag leftChart-zone">
                        <LeftPlan />
                    </div>
                    <div className="left test-flag map-zone">
                        <Map mapTop5={this.state.mapTop5} province={province} IndexTotalInfoData={IndexTotalInfoData}
                             getActiveType={this.getActiveType}/>

                    </div>
                    <div className="right test-flag chart-zone">
                        {/* <RightPlan getIndustryName={this.getIndustryName}/> */}
                        <div className="select-box">
                            <Select value={this.state.industryType} onChange={this.industryChange}
                                    modalStyle={{ textAlign: 'center', color: '#c4c4c4' }} trigger="click">
                                {choseData}
                            </Select>
                        </div>
                        {
                            province ?
                                <ChartPart province={province} getIndexTotalInfoData={this.getIndexTotalInfoData}
                                           getNewEcoDevelopTrendData={this.getNewEcoDevelopTrendData}
                                           getLocalRiskTrendData={this.getLocalRiskTrendData}/>
                                : null
                        }
                    </div>
                </div>

                {/** 高危企业以及黑名单**/}
                <div className="home-bottom">
                    <div className="bottom-content">
                        <Tabs type="top" activeIndex={activeIndex} changeBack={this.changeBack.bind(this)}>
                            <TabItem name={this.getItemName('高危企业', this.state.dangerTotleNum)}>
                                <DangerList
                                    {...this.props}
                                    selctProvince={this.state.selctProvince}
                                    selctCity={this.state.selctCity}
                                    selctArea={this.state.selctArea}
                                    selctBoundArea={this.state.selctBoundArea}
                                    dangerTotle={this.dangerTotle}/>
                            </TabItem>
                            <TabItem name={this.getItemName('黑名单', this.state.balckTotleNum)}>
                                <BlackList
                                    {...this.props}
                                    selctProvince={this.state.selctProvince}
                                    selctCity={this.state.selctCity}
                                    selctArea={this.state.selctArea}
                                    selctBoundArea={this.state.selctBoundArea}
                                    balckTotle={this.balckTotle}/>
                            </TabItem>
                            <TabItem name={this.getItemName('重点关注', this.state.attentionTotleNum)}>
                                <AttentionList
                                    {...this.props}
                                    selctProvince={this.state.selctProvince}
                                    selctCity={this.state.selctCity}
                                    selctArea={this.state.selctArea}
                                    selctBoundArea={this.state.selctBoundArea}
                                    attentionTotle={this.attentionTotle}/>
                            </TabItem>
                            <TabItem name={this.getItemName('持续监控', this.state.mttentionTotleNum)}>
                                <MttentionList
                                    {...this.props}
                                    selctProvince={this.state.selctProvince}
                                    selctCity={this.state.selctCity}
                                    selctArea={this.state.selctArea}
                                    selctBoundArea={this.state.selctBoundArea}
                                    mttentionTotle={this.mttentionTotle}/>
                            </TabItem>
                            <TabItem  style={{ display: industryType === '私募基金' ? 'block' : 'none' }} name={this.getItemName(newAddName1, newAddNum1)}>
                                <div style={{ display: industryType === '私募基金' ? 'block' : 'none' }}>
                                    <FundManagerList
                                        {...this.props}
                                        selctProvince={this.state.selctProvince}
                                        selctCity={this.state.selctCity}
                                        selctArea={this.state.selctArea}
                                        industryType={industryType}
                                        fundManagerTotle={this.fundManagerTotle}/>
                                </div>    
                            </TabItem>
                            <TabItem name={this.getItemName(newAddName2, newAddNum2)}>
                                <div style={{ display: industryType === '私募基金' ? 'block' : 'none' }}>
                                    <FundProductList
                                        {...this.props}
                                        selctProvince={this.state.selctProvince}
                                        selctCity={this.state.selctCity}
                                        selctArea={this.state.selctArea}
                                        industryType={industryType}
                                        fundProductTotle={this.fundProductTotle}/>
                                </div>
                            </TabItem>
                        </Tabs>
                        {/** 导出操作开始 **/}
                        <div className="action">
                            <a href="javascript:void(null)"
                               style={{ display: this.state.exportNumber === 0 ? 'none' : 'inline-block' }}
                               className="export action-user" onClick={this.exportList.bind(this)}>
                                <em className="iconfont icon-xiangxi"></em>导出列表
                            </a>
                            <lable className="title">地区选择</lable>
                            <div className="province" style={{ display: this.state.provinceShow }}>
                                <Select value={selctProvinceVal}
                                        style={{ width: 120 }}
                                        modalStyle={{ width: 120, height: 250, background: '#395369', color: '#fff' }}
                                        onChange={this.selectProvinceOnChange}
                                        trigger={'click'} key={+new Date()}>
                                    {provinceOptions}
                                </Select>
                            </div>
                            <div className="city" style={{ display: this.state.cityIsShow }}>
                                <Select
                                    disabled={this.state.cityShow}
                                    value={this.state.selctCityVal}
                                    style={{ width: 120 }}
                                    modalStyle={{ width: 120, height: 250, background: '#395369', color: '#fff' }}
                                    onChange={this.selectCityOnChange}
                                    trigger={'click'} key={+new Date()}>
                                    {cityOptions}
                                </Select>
                            </div>
                            <div className="area">
                                <Select
                                    disabled={this.state.areasShow}
                                    value={this.state.selctAreaVal}
                                    style={{ width: 120 }}
                                    modalStyle={{ width: 120, height: 250, background: '#395369', color: '#fff' }}
                                    onChange={this.selectAreaOnChange}
                                    trigger={'click'} key={+new Date()}
                                    >
                                    {areaOptions}
                                </Select>
                                {/* <Cascader
                                    className="selectBoundeAreaChange"
                                    disabled={isDisable}
                                    value={[selctAreaVal, selctBoundArea]}
                                    allowClear={false}
                                    options={areaBoundList}
                                    expandTrigger="hover"
                                    onChange={this.selectAreaOnChange}
                                    style={{ color: '#000' }}
                                /> */}
                            </div>
                            {/** 导出操作完毕 **/}
                        </div>
                    </div>
                </div>

                {/** 行业事件分析**/}
                {/* <EventAnalysis /> */}
                <Modal
                    visible={this.state.reportVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    okText={'提交'}
                    title={this.state.exportTitle}
                    onOk={this.downloadSure.bind(this)}
                    onCancel={this.downloadClose.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div className="remark">共<em
                            style={{ color: '#0293dc', fontWeight: 'bold' }}>{numberOfTypes[tableList[activeIndex]] ? numberOfTypes[tableList[activeIndex]] : numberOfTypes[exportName]}</em>条企业信息<br/>是否确认导出?
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    handleGoHomePage = (type) => {
        if (type) {
            this.setState({
                industryType: '综合监测',
                industryName: '综合监测'
            }, () => {
                emitter.emit('CHANGE_MONITING_INDUSTRY', this.state.industryName);
            });
        }
    };

    getArea = (data) => {
        setSession('areaChange', data);
        // TODO: type 只有这里使用, 且只判断了是否为 area
        let { isCountry, province, previewInfo, city, area, industry, type } = data;
        this.setState({
            nowType: type
        });
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
        } else {
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
    };

    /**
     * 获取省份列表
     * @return {[type]} [description]
     */
    getProvinces = () => {
        getProvinces().then(({ data }) => {
            this.setState({
                provinceList: ['全国', ...data]
            });
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
            let areaBoundList = [ {
                value: '区',
                label: '区'
            }];
            for (let i of data) {
                if (i === '北仑区') {
                    areaBoundList.push({
                        value: '北仑区',
                        label: '北仑区',
                        children: [
                            {
                                value: '全部',
                                label: '全部'
                            },
                            {
                                value: '北仑区',
                                label: '北仑区'
                            },
                            {
                                value: '宁波保税区',
                                label: '宁波保税区'
                            },
                            {
                                value: '梅山保税港区',
                                label: '梅山保税港区'
                            }
                        ]
                    });
                } else {
                    areaBoundList.push({ value: i, label: i });
                }
            }
            this.setState({
                areaBoundList
            });
        });
    };
    /**
     * 省份下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectProvinceOnChange = (e, { children, value }) => {
        let selctProvince = (children === '全国') ? '' : children;
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
        }
    };
    /**
     * 城市下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectCityOnChange = (e, { children, value }) => {
        let selctCity = (children === '市') ? '' : children;
        let state = {
            selctCity,
            selctCityVal: value,
            areasShow: children === '市',
            selctAreaVal: '区',
            selctArea: '',
            selctBoundArea: ''
        };
        this.state = { ...this.state, ...state };
        this.getAreas();
    };
    /**
     * 区县下拉回调事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    selectAreaOnChange = (e, { children, value }) => {
        let selctArea = (children === '区') ? '' : children;
        this.setState({
            selctArea,
            selctAreaVal: value
        });
        // let len = e.length;
        // if (len === 1) {
        //     let selectArea, selectAreaVal;
        //     selectArea = e[0] === '区' ? '' : e[0];
        //     selectAreaVal = e[0];
        //     this.setState({
        //         selctArea: selectArea,
        //         selctAreaVal: selectAreaVal,
        //         selctBoundArea: ''
        //     });
        // } else if (len === 2) {
        //     let selectAreaVal, selectBoundAreaVal;
        //     selectAreaVal = e[1] === '全部' ? '' : e[1];
        //     selectBoundAreaVal = e[1];
        //     this.setState({
        //         selctArea: '北仑区',
        //         selctBoundArea: selectAreaVal,
        //         selctAreaVal: '北仑区',
        //         selctBoundAreaVal: selectBoundAreaVal
        //     });
        // }
    };

    /**
     * 高危企业以及黑名单tab切换
     * @param  {[type]} index [下标]
     * @return {[type]}       [description]
     */
    changeBack(index, data, flag) {
        let { industryType } = this.state;
        let _this = this;
        let exportTitle = '';
        let exportName = '';
        let exportNumber = 0;
        if (index === 0) {
            exportTitle = '导出高危企业名单';
            exportName = '高危企业';
            exportNumber = this.state.dangerTotleNum;
        } else if (index === 1) {
            exportTitle = '导出黑名单企业名单';
            exportName = '黑名单';
            exportNumber = this.state.balckTotleNum;
        } else if (index === 2) {
            exportTitle = '导出重点关注企业名单';
            exportName = '重点关注';
            exportNumber = this.state.attentionTotleNum;
        } else if (index === 3) {
            exportTitle = '导出持续监控企业名单';
            exportName = '持续监控';
            exportNumber = this.state.mttentionTotleNum;
        } else if (index === 4) {
            exportTitle = '导出基金管理人企业名单';
            exportName = '基金管理人企业';
            exportNumber = this.state.fundManagerTotleNum;
        } else if (index === 5) {
            exportTitle = '导出基金产品企业名单';
            exportName = '基金产品企业';
            exportNumber = this.state.fundProductTotleNum;
        }

        if (!flag) {
            // GetUserLog({
            //     page: this.state.pageIndustry + '首页',
            //     operation: '表单切换',
            //     detail: '点击' + this.state.tableList[index] + '标签'
            // });
        }
        _this.setState({
            activeIndex: index,
            exportTitle: exportTitle,
            exportName: exportName,
            exportNumber: exportNumber
        });
    }

    setExportNumber(num, industryType) {
        let { numberOfTypes, activeIndex } = this.state;
        let newState = numberOfTypes;
        switch (industryType) {
            case '高危企业':
                newState[industryType] = num;
            case '黑名单':
                newState[industryType] = num;
            case '重点关注':
                newState[industryType] = num;
            case '持续监控':
                newState[industryType] = num;
            case '基金管理人企业':
                newState[industryType] = num;
            case '基金产品企业':
                newState[industryType] = num;
            default:
                null;
        }
        this.setState({
            exportNumber: num,
            numberOfTypes: newState
        });
    }

    /**
     * 高危企业以及黑名单
     * @param  {[type]} itemName [名称]
     * @param  {[type]} itemNum  [总量]
     * @return {[type]}          [description]
     */
    getItemName(itemName, itemNum) {
        return (
            <div className="clearfix"><span>{itemName}</span>
                <button className="small-tab-count">{itemNum}</button>
            </div>
        );
    }

    /**
     * 高危企业总量回调函数
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    dangerTotle(val, dangerIndustry, dangerIsNew, dangerIsIPO, dangerOrder, dangerDescAsc, industryType) {
        let _this = this;
        _this.setState({
            dangerTotleNum: val,
            dangerIndustry: dangerIndustry,
            dangerIsNew: dangerIsNew,
            dangerIsIPO,
            dangerOrder,
            dangerDescAsc
        }, function () {
            _this.setExportNumber(val, industryType);
        });
    }

    /**
     * 黑名单总量回调函数
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    balckTotle(val, blackIndustry, industryType, blackDescAsc) {
        let _this = this;
        _this.setState({
            balckTotleNum: val,
            blackIndustry: blackIndustry,
            blackDescAsc
        }, function () {
            _this.setExportNumber(val, industryType);
        });
    }

    /**
     * 重点关注
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    attentionTotle(val, attentionIndustry, attentionIndustryType, attentionIsNew, attentionIsBreak, attentionOrder, attentionDescAsc) {
        let _this = this;
        _this.setState({
            attentionTotleNum: val,
            attentionIndustry: attentionIndustry,
            attentionIndustryType,
            attentionIsNew,
            attentionIsBreak,
            attentionOrder,
            attentionDescAsc
        }, function () {
            _this.setExportNumber(val, attentionIndustryType);
        });
    }

    /**
     * 持续监控
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    mttentionTotle(val, mttentionIndustry, mttentionIndustryType, mttentionIsNew, mttentionIsBreak, mttentionOrder, mttentionDescAsc) {
        let _this = this;
        _this.setState({
            mttentionTotleNum: val,
            mttentionIndustry: mttentionIndustry,
            mttentionIndustryType,
            mttentionIsNew,
            mttentionIsBreak,
            mttentionOrder,
            mttentionDescAsc
        }, function () {
            _this.setExportNumber(val, mttentionIndustryType);
        });
    }

    /**
     * 基金管理人
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    fundManagerTotle(val, fundManagerIndustry, fundManagerIndustryType, fundManagerIsNew, fundManagerIsBreak, fundManagerOrder, fundManagerDescAsc) {
        let _this = this;
        _this.setState({
            fundManagerTotleNum: val,
            fundManagerIndustry,
            fundManagerIndustryType,
            fundManagerIsNew,
            fundManagerIsBreak,
            fundManagerOrder,
            fundManagerDescAsc
        }, function () {
            _this.setExportNumber(val, '基金管理人企业');
        });
    }

    /**
     * 基金管理人
     * @param  {[type]} val [总量]
     * @return {[type]}     [description]
     */
    fundProductTotle(val, fundProductIndustry, fundProductIndustryType, fundProductIsNew, fundProductIsBreak, fundProductOrder, fundProductDescAsc) {
        let _this = this;
        _this.setState({
            fundProductTotleNum: val,
            fundProductIndustry,
            fundProductIndustryType,
            fundProductIsNew,
            fundProductIsBreak,
            fundProductOrder,
            fundProductDescAsc
        }, function () {
            _this.setExportNumber(val, '基金产品企业');
        });
    }

    /**
     * 高危企业以及黑名单导出弹出窗
     * @return {[type]} [description]
     */
    exportList() {
        this.setState({
            reportVisible: true
        });
    }

    /**
     * 导出列表取消下载
     * @return {[type]} [description]
     */
    downloadClose() {
        this.setState({
            reportVisible: false
        });
    }

    /**
     * 导出列表确认下载
     * @return {[type]} [description]
     */
    downloadSure() {
        let url = '';
        let tabIndex = this.state.activeIndex;
        this.setState({
            reportVisible: false
        });
        if (tabIndex === 0) { // 高危企业
            window.location = `/api/v1.0/export/indexHighCompany.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.dangerIndustry)}&isNew=${encodeURIComponent(this.state.dangerIsNew)}&isIPO=${encodeURIComponent(this.state.dangerIsIPO)}&order=${encodeURIComponent(this.state.dangerOrder)}&descAsc=${encodeURIComponent(this.state.dangerDescAsc)}`;
        } else if (tabIndex === 1) { // 黑名单
            window.location = `/api/v1.0/export/query/blackList.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.blackIndustry)}&descAsc=${encodeURIComponent(this.state.blackDescAsc)} `;
        } else if (tabIndex === 2) { // 重点关注
            window.location = `/api/v1.0/export/indexCompany.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.attentionIndustry)}&isNew=${encodeURIComponent(this.state.attentionIsNew)}&order=${encodeURIComponent(this.state.attentionOrder)}&descAsc=${encodeURIComponent(this.state.attentionDescAsc)}&isBreak=${encodeURIComponent(this.state.attentionIsBreak)}&riskLevel=${encodeURIComponent(this.state.attentionIndustryType)}`;
        } else if (tabIndex === 3) { // 持续监控
            window.location = `/api/v1.0/export/indexCompany.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.mttentionIndustry)}&isNew=${encodeURIComponent(this.state.mttentionIsNew)}&order=${encodeURIComponent(this.state.mttentionOrder)}&descAsc=${encodeURIComponent(this.state.mttentionDescAsc)}&isBreak=${encodeURIComponent(this.state.mttentionIsBreak)}&riskLevel=${encodeURIComponent(this.state.mttentionIndustryType)}`;
        } else if (tabIndex === 4) { // 基金管理人企业
            window.location = `/api/v1.0/export/indexCompany.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.fundManagerIndustry)}&isNew=${encodeURIComponent(this.state.fundManagerIsNew)}&order=${encodeURIComponent(this.state.fundManagerOrder)}&descAsc=${encodeURIComponent(this.state.fundManagerDescAsc)}&isBreak=${encodeURIComponent(this.state.fundManagerIsBreak)}&riskLevel=${encodeURIComponent(this.state.fundManagerIndustryType)}&fundType=基金管理人企业`;
        } else if (tabIndex === 5) { // 基金产品
            window.location = `/api/v1.0/export/indexCompany.do?province=${encodeURIComponent(this.state.selctProvince)}&city=${encodeURIComponent(this.state.selctCity)}&area=${encodeURIComponent(this.state.selctArea)}&bondedArea=${encodeURIComponent(this.state.selctBoundArea)}&industry=${encodeURIComponent(this.state.fundProductIndustry)}&isNew=${encodeURIComponent(this.state.fundProductIsNew)}&order=${encodeURIComponent(this.state.fundProductOrder)}&descAsc=${encodeURIComponent(this.state.fundProductDescAsc)}&isBreak=${encodeURIComponent(this.state.fundProductIsBreak)}&riskLevel=${encodeURIComponent(this.state.fundProductIndustryType)}&fundType=基金产品企业`;
        }
    }
    /**
     * 行业下拉回调方法
     * @param  {[type]} e    [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

    industryChange = (e, { children, value }) => {
        let pageIndustry = (children === '综合监测') ? '' : children;
        let state = {
            industryType: value,
            industryName: children,
            pageIndustry
        };
        this.state = { ...this.state, ...state };
        /* GetUserLog({
            page: '首页', // 页面类型
            operation: '行业选择', // 使用日志
            detail: '选择“' + children + '”' // 详情记录
        }); */
        emitter.emit('CHANGE_MONITING_INDUSTRY', this.state.industryName);
    };
    // 获取总体分析data

    getIndexTotalInfoData = (data) => {
        this.setState({
            IndexTotalInfoData: data
        });
    };
    // 获取省金融发展趋势图数据
    getNewEcoDevelopTrendData = (data) => {
        this.setState({
            NewEcoDevelopTrendData: data
        });
    };
    // 查询当前省份和本地风险指数
    getLocalRiskTrendData = (data) => {
        this.setState({
            LocalRiskTrendData: data
        });
    };

    //
    getActiveType = (index) => {
        this.setState({
            activeIndex: index
        });
    };
}