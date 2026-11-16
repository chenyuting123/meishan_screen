/*
* author:TanJun
* describe:首页地图
* createTime:2018/6/15
* */
import './map.scss';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Services, directlyCity } from 'Constants/common';
import { MAIN, SPECIAL_EVENT, MISTAKE_RULE } from 'RouterPath';
import { getLocal } from 'Utils/storage';
import CHATBBD from 'Utils/bbdCharts';
import emitter from 'Utils/emitter';
import { fmtData } from 'Utils/formatter';
import { shouldUpdate } from 'Utils/util';
import WarningInfo from './myUi/WarningInfo';
import Download from 'Libs/download';
import { LoadingBox } from 'mtui/index';
import { indexMap, findDealStatusCount, findIndexTotalInfo } from '../../../services/home';

const mainPath = `/${MAIN}/`;
const { HOME_LATITUDE, HOME_MAP_AREA, HOME_MAP_CITY, HOME_MAP_COUNTRY, HOME_MAP_PROVINCE, HOME_MAP_INVESTMENT } = Services;
const titleList = [
    { color: 'rgba(250, 56, 56, 1)', provinceName: '高危企业数', countryName: '高危企业数' },
    { color: 'rgba(254, 235, 21, 1)', provinceName: '违规预警企业数', countryName: '重点关注企业数' },
    { color: 'rgba(255, 255, 255, 1)', provinceName: '特征事件预警企业', countryName: '黑名单企业数' }
];
const bottomInfo = [
    { name: '已查看', num: 10, color: 'rgba(2, 147, 220, 1)' },
    { name: '已监控', num: 10, color: 'rgba(41, 222, 255, 1)' },
    { name: '已排查', num: 10, color: 'rgba(22, 240, 186, 1)' },
    { name: '已处置', num: 10, color: 'rgba(247, 109, 67, 1)' }
];
// 1-全国 2-省(包括直辖市) 3-市 4-县
const RegionType = {
    COUNTRY: 1, 
    PROVINCE: 2,
    CITY: 3,
    AREA: 4
};

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hide: true,
            currentType: RegionType.COUNTRY,    // 1-全国 2-省 3-市 4-
            province: '浙江省',
            city: '',
            area: '',
            cityTrue: false, // 是否为市级账号
            areaTrue: false, // 是否为区级账号
            previewInfo: '全国',
            chooseArea: '',                     // 选中区域
            isShowFlow: false,                  // 是否显示投资流向
            isCountry: false,
            scatterData: null,                  // 地图散点数据
            geoCoordMap: null,                  // 所有经纬度
            industry: '',                       // 行业
            direction: true,
            dealStatusCount: {},                // 查询处理状态对应数量
            IndexTotalInfoData: {},
            beilunScatterData: {},              // 北仑保税区数据
            meishanScatterData: {}              // 梅山保税港区数据
        };  
    }

    componentDidMount() {
        this._initData();
        emitter.on('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
        emitter.on('goHomePage', this.handleGoHomePage);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
        emitter.removeListener('goHomePage', this.handleGoHomePage);
        CHATBBD.dispose(this._chartObj);
    }

    render() {
        let { previewInfo, isShowFlow, direction, currentType, isCountry, dealStatusCount, IndexTotalInfoData, province,
            cityTrue, areaTrue } = this.state;
        let isShowBack = false;
        let isShowFlowBtn = true;
        if (isCountry) {
            if (currentType !== RegionType.COUNTRY) {
                isShowBack = true;
            }
            // 全国和省份(直辖市)才显示投资流向按钮
            if (currentType > RegionType.PROVINCE) {
                isShowFlowBtn = false;
            }
        } else {
            if (this._isDirectlyCity(province)) {
                if (currentType !== RegionType.CITY) {
                    isShowBack = true;
                }
            } else {
                if (areaTrue) {
                    isShowFlowBtn = false;
                    isShowBack = false;
                } else if (cityTrue) {
                    if (currentType === RegionType.CITY) {
                        isShowFlowBtn = false;
                        isShowBack = false;
                    } else {
                        isShowBack = true;
                        isShowFlowBtn = false;
                    }
                } else {
                    if (currentType !== RegionType.PROVINCE) {
                        isShowBack = true;
                    }
                    // 全国和省份(直辖市)才显示投资流向按钮
                    if (currentType > RegionType.PROVINCE) {
                        isShowFlowBtn = false;
                    }
                }
            }
        }
        let previewInfoTrue;
        // if (previewInfo === '宁波保税区' || previewInfo === '梅山保税港区') {
        //     previewInfoTrue = '北仑区';
        // } else {
        previewInfoTrue = previewInfo;
        // }
        return (
            <div className="c-map">
                <div className="map-title">
                    <div className="title-box">
                        <span className="icon-bg"><i className="iconfont icon-yingyong-paiming" /></span>
                        <span className="title">
                            <h3 className="font20">{previewInfoTrue + '-全局监测实时预警'}</h3>
                        </span>
                    </div>
                </div>
                <div className="info-box">
                    {
                        titleList.map(({ provinceName, color, countryName }, index) => <WarningInfo
                            title={previewInfo === '全国' ? countryName : provinceName} key={index} color={color}
                            IndexTotalInfoData={IndexTotalInfoData} type="map" previewInfo={previewInfo}
                            onClick={this.handleOnClick} />)
                    }
                </div>
                <div className="map-box">
                    {/* 地图绑定元素 */}
                    <div className="map-chart" ref={refs => this._mapChart = refs}>
                        <LoadingBox info="数据载入中" type="loading2" />
                    </div>
                </div>
                {
                    isShowBack && !isShowFlow ? <a className="color-blue iconfont icon-homePage font20 go-Back"
                        title="返回上一级" onClick={this.goBack}>
                    </a>
                        : null
                }
                <div className="c-map-btn">
                    {isShowFlowBtn
                        ? <div className="c-map-btn_l left" onClick={() => {
                            this.setState({ isShowFlow: !isShowFlow }, () => {
                                if (!isShowFlow) {
                                    this._getInvestmentInfo();
                                } else {
                                    this._initMap(null, { ...this._chartData, isShowFlow: false });
                                }
                            });
                        }}>
                            {!isShowFlow ? '投资流向' : '返回'}
                        </div>
                        : null
                    }

                    <div className="c-map-btn_r right" onClick={() => {
                        if (isShowFlow) {
                            this.setState({ direction: !direction }, () => {
                                this._getInvestmentInfo(this._chartFlowData.mapData.name);
                            });
                        } else {
                            let base64 = this._chartObj.getConnectedDataURL({ type: 'png', pixelRatio: 2 });
                            Download(base64, `${previewInfo}_${new Date().getTime()}`, 'image/png');
                            this._initMap(null, this._chartData);
                        }
                    }}>
                        {!isShowFlow ? '下载图片' : '反向'}
                    </div>
                </div>
                {currentType !== RegionType.COUNTRY ? <div className="c-map__bottom">
                    <div className="c-map__bottom-u">
                        {`${previewInfoTrue}-高危企业本月处理`}
                    </div>
                    <ul className="c-map__bottom-d">
                        {bottomInfo.map(({ name, num, color }, index) => <li key={index}>
                            <span>
                                <span style={{ color: color }}
                                    className="c-map__bottom-num">{fmtData(name, dealStatusCount)}</span><br />
                                <span>{name}</span>
                            </span></li>)}
                    </ul>
                </div> : null}

            </div>
        );
    }

    handleGoHomePage = (type) => {
        if (type) {
            this._initData();
        }
    };

    handleOnClick = (title, isCountry) => {
        let index = 0;
        if (isCountry) {
            switch (title) {
                case '高危企业数': {
                    index = 0;
                    break;
                }
                case '重点关注企业数': {
                    index = 2;
                    break;
                }
                case '黑名单企业数': {
                    index = 1;
                    break;
                }
            }
            this.props.getActiveType(index);
        } else {
            switch (title) {
                case '特征事件预警企业': {
                    const path = mainPath + SPECIAL_EVENT;
                    browserHistory.push(path);
                    emitter.emit('GETKER', path);
                    break;
                }
                case '违规预警企业数': {
                    const path = mainPath + MISTAKE_RULE;
                    browserHistory.push(path);
                    emitter.emit('GETKER', path);
                    break;
                }
            }
        }
    };

    // 初始化地图数据
    _initData() {
        let previewInfo;
        let currentType;
        let cityTrue; // 是否为市级账号
        let areaTrue; 
        let province = getLocal('user').province;
        let city = getLocal('user').city;
        let area = getLocal('user').area;
        if (area) {
            previewInfo = area;
            currentType = RegionType.AREA;
            cityTrue = false;
            areaTrue = true;
        } else if (city) {
            previewInfo = city;
            currentType = RegionType.CITY;
            cityTrue = true;
            areaTrue = false;
        } else {
            previewInfo = province;
            currentType = RegionType.PROVINCE;
            cityTrue = false;
            areaTrue = false;
        }
        let isCountry = previewInfo === '全国';
        let isDirectlyCity = this._isDirectlyCity(previewInfo);
        let state = {
            currentType: currentType,
            previewInfo: previewInfo,
            isCountry,
            province,
            city,
            area,
            cityTrue,
            areaTrue
        };
        // if (!isCountry) {
        //     state.province = previewInfo;
        // }

        // if (isDirectlyCity) {
        //     state.city = previewInfo;
        // }

        this._getLatitudeData();
        this.setState(state);
    }

    /**
     * 设置监测行业
     */
    setMonitorIndustry = (industry) => {
        this.setState({ industry, isShowFlow: false }, () => {
            let { isShowFlow } = this.state;
            if (!isShowFlow && this._chartData) {
                this._initMap(null, { ...this._chartData, isShowFlow: false });
            }
            this._getLatitudeData();
            this._emit(this.state.currentType);
        });
    };

    /**
     * 地图经纬度数据
     */
    _getLatitudeData = () => {
        let { geoCoordMap } = this.state;
        // 获取地区经纬度坐标
        if (!geoCoordMap) {
            indexMap({
                type: HOME_LATITUDE
            }).then((response) => {
                let { statusCode, data } = response;
                if (statusCode === '0000') {
                    let geoCoordMap = {};
                    
                    data.forEach((item) => {
                        geoCoordMap[item['province'] + '-' + item['area']] = [item['longitude'], item['latitude']];
                    });
                    this.setState({ geoCoordMap }, () => {
                        this._getScatterData();
                    });
                }
            });
        } else {
            this._getScatterData();
        }
    };
    // 获取地图需要高亮的地区数据
    _getScatterData() {
        let { currentType, province, city, area, industry, previewInfo } = this.state;
        // if (area !== '宁波保税区' && area !== '梅山保税港区') {
        let info = null;
        let industryFormat = industry === '综合监测' ? '' : industry;
        const isDirectlyCity = this._isDirectlyCity(previewInfo);
    
        switch (currentType) {
            case RegionType.COUNTRY: 
                info = { type: HOME_MAP_COUNTRY, data: { industry: industryFormat } };
                break;
            case RegionType.PROVINCE: // 省或直辖市
                info = !isDirectlyCity 
                        ? { type: HOME_MAP_PROVINCE, data: { province, industry: industryFormat } } 
                        : { type: HOME_MAP_CITY, data: { province, city, industry: industryFormat } };
                break;
            case RegionType.CITY:
                info = { type: HOME_MAP_CITY, data: { province, city, industry: industryFormat } };
                break;
            case RegionType.AREA: 
                info = { type: HOME_MAP_AREA, data: { province, city, area, industry: industryFormat } };
                break;
        }
    
        indexMap(info).then(({ data }) => {
            this.setState({
                scatterData: data
            }, () => {
                this._initMapInfo(province);
            });
        });
    
        emitter.emit('TOGGLE_COMMON_LOADING', true);
        // }
    }

    _initMapInfo = (param) => {
        let { scatterData } = this.state;
        let mapData = this._formatMapDatas(scatterData, param);
        this.getMapJson(mapData, this._mapCallBack);
    };
    
    /**
     * 地图点击回调
     */
    _mapCallBack = (param) => {
        let paramTrue = param;
        let { isShowFlow, currentType: lastRegionType, isCountry, previewInfo } = this.state;
        
        // 重新设置当前区域类型, 直辖市算省级
        // let newCurrentType = this._isDirectlyCity(param) ? RegionType.PROVINCE : Math.min(currentType + 1, 4);
        // newCurrentType = this._isDirectlyCity(previewInfo) ? RegionType.AREA : newCurrentType;
        
        if (isShowFlow) {
            // 这里有个权限控制, 如果用户不是全国账号则不响应.
            if (isCountry) {
                this._getInvestmentInfo(paramTrue);
            }
        } else {
            // let state = {
            //     chooseArea: paramTrue,
            //     previewInfo: paramTrue,
            //     currentType: Math.min(lastRegionType + 1, 4)
            // };

            // switch (lastRegionType) {
            //     case RegionType.COUNTRY: 
            //         state.province = paramTrue;
            //         if (this._isDirectlyCity(paramTrue)) {
            //             state.city = paramTrue;
            //             state.currentType = RegionType.PROVINCE;
            if (previewInfo === '全国' && paramTrue === '浙江省'  ){
                let state = {
                    chooseArea: paramTrue,
                    previewInfo: paramTrue,
                    currentType: Math.min(lastRegionType + 1, 4)
                };  
                switch (lastRegionType) {
                    case RegionType.COUNTRY: 
                        state.province = paramTrue;
                        if (this._isDirectlyCity(paramTrue)) {
                            state.city = paramTrue;
                            state.currentType = RegionType.PROVINCE;
                        }
                        break;
                    case RegionType.PROVINCE: // 省或直辖市
                        // 当前省是不是直辖市, 是的话点击的就是县级
                        if (this._isDirectlyCity(previewInfo)) {
                            state.city = previewInfo;
                            state.area = paramTrue;
                            state.currentType = RegionType.AREA;
                        // 不是直辖市点击的就是市级
                        } else {
                            state.city = paramTrue;
                        } 
                        break;
                    case RegionType.CITY:
                    case RegionType.AREA: 
                        state.area = paramTrue;
                        break;
                }
    
                this.setState(state, () => {
                    let currentType = state.currentType;
                    if (currentType !== RegionType.AREA) {
                        this._getScatterData(paramTrue);
                    }
                //     break;
                // case RegionType.PROVINCE: // 省或直辖市
                //     // 当前省是不是直辖市, 是的话点击的就是县级
                //     if (this._isDirectlyCity(previewInfo)) {
                //         state.city = previewInfo;
                // 触发兄弟组件响应区域变更事件
                    this._emit(currentType);
                });
            } else if(previewInfo !== '全国') {
                let state = {
                    chooseArea: paramTrue,
                    previewInfo: paramTrue,
                    currentType: Math.min(lastRegionType + 1, 4)
                };  
                switch (lastRegionType) {
                    case RegionType.COUNTRY: 
                        state.province = paramTrue;
                        if (this._isDirectlyCity(paramTrue)) {
                            state.city = paramTrue;
                            state.currentType = RegionType.PROVINCE;
                        }
                        break;
                    case RegionType.PROVINCE: // 省或直辖市
                    // 当前省是不是直辖市, 是的话点击的就是县级
                        if (this._isDirectlyCity(previewInfo)) {
                            state.city = previewInfo;
                            state.area = paramTrue;
                            state.currentType = RegionType.AREA;
                    // 不是直辖市点击的就是市级
                        } else {
                            state.city = paramTrue;
                        } 
                        break;
                    case RegionType.CITY:
                    case RegionType.AREA: 
                        state.area = paramTrue;
                        break;
                }
            //             state.currentType = RegionType.AREA;
            //         // 不是直辖市点击的就是市级
            //         } else {
            //             state.city = paramTrue;
            //         } 
            //         break;
            //     case RegionType.CITY:
            //     case RegionType.AREA: 
            //         state.area = paramTrue;
            //         break;
            // }

            // this.setState(state, () => {
            //     let currentType = state.currentType;
            //     if (currentType !== RegionType.AREA) {
            //         this._getScatterData(paramTrue);
                    
                // 触发兄弟组件响应区域变更事件
                // this._emit(currentType);
                this.setState(state, () => {
                    let currentType = state.currentType;
                    // if (currentType !== RegionType.AREA) {
                    this._getScatterData(paramTrue);
                    // }
                    // 触发兄弟组件响应区域变更事件
                    this._emit(currentType);
                });
            }
        }
    };

    /**
     * 获取地图json文件
     * @param  {[type]} mapDatas    [散点数据]
     * @param  {[city]} callBack    [回调函数]
     */
    getMapJson = (mapData, callBack) => {
        let { isShowFlow, currentType, province, city, area } = this.state;
        let mapURL = '/static/data/map';
        // if (area !== '宁波保税区' && area !== '梅山保税港区') {
        if (isShowFlow && this._chartObj) {
            mapURL += '/全国.json';
        } else {
            switch (currentType) {  
                case RegionType.COUNTRY: 
                    mapURL += '/全国.json';
                    break;
                case RegionType.PROVINCE: 
                    if(province === '浙江省'){
                        mapURL += `/${province}.json`;
                    }  
                    break;
                case RegionType.CITY: 
                    mapURL += `/${province}/${city.replace('市', '')}.json`;
                    break;
                case RegionType.AREA: 
                    mapURL += `/${province}/${city.replace('市', '')}/${area}.json`;
                    break;      
            }
        }
    
        $.getJSON(mapURL, (mapJson) => {
            this._initMap({
                mapData,
                mapJson,
                province,
                callBack,
                isShowFlow,
                obj: this._mapChart,
                isMoreInfo: currentType === RegionType.PROVINCE && this._isDirectlyCity(province) || currentType === RegionType.CITY ?  true : false
            });
        }).always((info) => {
            emitter.emit('TOGGLE_COMMON_LOADING', false);
        });
        // }
    };

    _initMap(data, update) {
        if (data && data.isShowFlow) {
            this._chartFlowData = update || data;
        } else {
            this._chartData = update || data;
        }

        this._chartObj = CHATBBD.bbdMap((data && data.isShowFlow) ? this._chartFlowData : this._chartData);
        return this._chartObj;
    }

    _getInvestmentInfo = (param) => {
        let { province, geoCoordMap, direction, currentType } = this.state;
        let name = param || province || '北京市';
        emitter.emit('TOGGLE_COMMON_LOADING', true);
      
        indexMap({
            type: HOME_MAP_INVESTMENT,
            data: { investedProvince: name }
        }).then(({ data }) => {
            let content = data;
            if (content) {
                let investInfo = [], formatterArr = {}, count = [], countNum = 0;
                content.forEach((item, index) => {
                    let { investProvince, investedProvince, companyCount } = item, coordinate;
                    if (!direction) {
                        if (name === investProvince) {
                            let keyValue = (currentType === RegionType.COUNTRY ? investedProvince : investedProvince) + '-' + investedProvince;
                            coordinate = geoCoordMap[keyValue] || [];
                            let value = coordinate.concat(companyCount);
                            investInfo.push({ name: investedProvince, value });
                            count.push(companyCount);
                            formatterArr[investedProvince] = value;
                            countNum += companyCount;
                        }
                    } else {
                        if (name === investedProvince) {
                            // let keyValue = (currentType === 1 ? investProvince  : province) + '-' + investProvince;
                            let keyValue = investProvince + '-' + investProvince;
                            coordinate = geoCoordMap[keyValue] || [];
                            let value = coordinate.concat(companyCount);
                            investInfo.push({ name: investProvince, value });
                            count.push(companyCount);
                            countNum += companyCount;
                            formatterArr[investProvince] = value;
                        }
                    }
                });

                let keyValue = (currentType === RegionType.COUNTRY ? name : province) + '-' + name;
                let nameL = geoCoordMap[keyValue];
                
                investInfo.push({ 
                    name, 
                    value: nameL.concat(countNum) 
                });
                formatterArr[name] = nameL.concat(countNum);
                this.getMapJson({
                    borderColor: '#fff',
                    areaColor: '#0f84c2',
                    areaColorEmp: '#68b1d5',
                    labelShow: true,
                    scatterData: investInfo,
                    formatterArr: formatterArr,
                    highMin: Math.min.apply(null, count),
                    highMax: Math.max.apply(null, count),
                    moveLine: this._convertData(investInfo, name),
                    name,
                    direction
                }, this._mapCallBack);
            }
        });
    };

    _formatMapDatas = (data, name) => {
        let scatterArr = [], formatterArr = {}, maxMinArr = [], { geoCoordMap, province, currentType } = this.state;
        data.forEach((item) => {
            let cityVal = [];
            cityVal.push(item['highCompany']);
            cityVal.push(item['region']);
            cityVal.push(item['monitorRegion']);
            cityVal.push(item['highCollect']);
            cityVal.push(item['monitorCompany']);
            cityVal.push(item['changeHighCompany']);
            cityVal.push(item['changeMonitorCompany']);
            maxMinArr.push(item['highCompany']);
            let keyValue = (currentType === RegionType.COUNTRY ? item.region : province) + '-' + item.region;
            if (item.region && geoCoordMap[keyValue]) {
                let region = geoCoordMap[keyValue], value = region.concat(cityVal);// 合并数据与经纬度
                scatterArr.push({ name: item.region, value: value });
                formatterArr[item.region] = value;
            }
        });
        let highMin = Math.min.apply(null, maxMinArr), highMax = Math.max.apply(null, maxMinArr);

        return {
            borderColor: '#fff',
            areaColor: '#0f84c2',
            areaColorEmp: '#68b1d5',
            labelShow: true,
            scatterData: scatterArr,
            formatterArr: formatterArr,
            highMin: highMin,
            highMax: highMax,
            moveLine: this._convertData(scatterArr, name),
            name: name
        };
    };

    // 返回上一级
    goBack = () => {
        let { currentType, previewInfo } = this.state;
        let newCurrentType = this._isDirectlyCity(previewInfo) ? RegionType.COUNTRY : (currentType === RegionType.COUNTRY ? currentType : currentType - 1);
        previewInfo = this._currentPreviewInfo(newCurrentType);

        this.setState({
            currentType: newCurrentType,
            previewInfo
        }, () => {
            this._getScatterData();
            this._emit(newCurrentType);
        });
    };

    _currentPreviewInfo(type) {
        let { province, city, area } = this.state;
        let previewInfo;

        switch (type) {
            case RegionType.COUNTRY:
                previewInfo = '全国';
                break;
            case RegionType.PROVINCE:
                previewInfo = province;
                break;
            case RegionType.CITY:
                previewInfo = city;
                break;
            case RegionType.AREA:
                previewInfo = area;
                break;
        }

        return previewInfo;
    }
    // 触发首页的兄弟组件响应事件
    _emit(type) {
        let { province, previewInfo, city, area, industry } = this.state;
        let info = {
            type: '',
            industry,
            previewInfo
        };
        
        switch (type) {
            case RegionType.COUNTRY:
                // info.type = 'province';
                info.type = 'country';
                info.isCountry = true;
                break;
            case RegionType.PROVINCE:
                info.type = 'province';
                info.province = province;
                if (this._isDirectlyCity(province)) {
                    info.city = city;
                } 
                break;
            case RegionType.CITY:
                info.type = 'city';
                info.province = province;
                info.city = city;
                break;
            case RegionType.AREA:
                info.type = 'area';
                info.province = province;
                info.city = city;
                info.area = area;
                break;
        }

        emitter.emit('CHANGE_MONITOR_AREA', info);
        // emitter.emit('CHANGE_MONITING_INDUSTRY');
        this.findDealStatusCount(info);
        this.findIndexTotalInfo(info);
    }

    /**
     * 查询处理状态对应数量
     * */
    findDealStatusCount = ({ area, previewInfo, city, industry, province, type, isCountry }) => {
        findDealStatusCount({
            province: !isCountry ? province : '',
            city: city,
            area: area,
            industry: industry === '综合监测' ? '' : industry
        }).then(({ data }) => {
            this.setState({
                dealStatusCount: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    /**
     * 预警数量（总体分析）
     * */
    findIndexTotalInfo = ({ area, previewInfo, city, industry, province, type, isCountry }) => {
        findIndexTotalInfo({
            province: !isCountry ? province : '',
            city: city,
            area: area,
            industry: industry === '综合监测' ? null : industry
        }).then(({ data }) => {
            this.setState({
                IndexTotalInfoData: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };

    /**
     * 投资流向数据格式转换
     * */
    _convertData(data, point) {
        let { direction } = this.state;
        let pointInfo;
        // 寻找指定点的位置
        data.forEach((item) => {
            if (item.name === point && item.value[2]) {
                pointInfo = item;
            }
        });
        pointInfo = pointInfo || data[0];
        return data.filter(({ value }) => value[2]).map(({ name, value }) => {
            let fromName = direction ? pointInfo.name : name,
                toName = direction ? name : pointInfo.name,
                fromCoord = direction ? [value[0], value[1]] : [pointInfo.value[0], pointInfo.value[1]],
                toCoord = direction ? [pointInfo.value[0], pointInfo.value[1]] : [value[0], value[1]];
            return { fromName, toName, coords: [fromCoord, toCoord] };
        });
    }

    _isDirectlyCity = (previewInfo) => {
        return directlyCity.indexOf(previewInfo) !== -1;
    };
}

export default Map;