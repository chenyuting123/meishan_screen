/**
 * Created by hejie on 2017/4/23.
 * Change by ashima on 2017/8/01.
 *  关联方
 */
import './relatedParty.scss';
import React, { Component } from 'react';
import classname from 'classnames';
import { Link } from 'react-router';
import { Icon } from 'antd';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import perfectScrollbar from 'perfect-scrollbar';
import { Button, Input, PageList, Select } from 'mtui/index';
import { HJPromise } from 'Utils/hjPromise';
import emitter from 'Utils/emitter';
import { fieldAnomaly, switchIndustry, switchIndustryYW, windowOpenByUrl } from 'Utils/formatter';
import Map from '../../../../Maps/Index';
import { showExecutives, showGuDong, showTouZhi } from '../../../../Maps/map/FunApi';
import { ANALYSIS_DETAIL, BLACK, CIRCLE, DEFAULT_DETAIL } from 'RouterPath';
import { Services } from 'Constants/common';
import { companyDetailAPI } from 'Services/detail';
import { classIndustry } from 'Constants/common';
import { sortArr, tabArr, legendList } from './data';
const { COMPANY_DETAIL_RIGHT_RELATION, COUNT_BOTTOM_RELATION_INFO, COMPANY_DETAIL_BOTTOM_RELATION, COMPANY_DETAIL_ABSTRACT } = Services;

const Option = Select.Option;
const defaultFilterVal = { // 筛选下拉框默认值
    category: -1, // 关联度
    relationDescribe: '', // 关联关系
    enterpriseStatus: '', // 状态
    industry: '', // 行业
    riskLevel: '' // 风险等级
};

export default class RelatedParty extends Component {
    constructor(props) {
        super(props);
        this.relatedPartyRef = null;
        const { companyName = '', companyId = '' } = this.props.params;
        this.state = {
            companyName,
            companyId,
            pageIndex: 1, // 关联方列表页码
            pageSize: 5, // 关联方列表页量
            total: 0, // 关联方列表总页数
            selctlistDegreesVal: 0, // 关联方下拉框默认下标
            degreeIndex: 1, // 关联度数
            typeIndex: -1, // 公司性质下标
            typeName: '', // 公司性质字段
            mapsData: [], // 图谱数据
            companyVal: null, // 选中公司弹窗值
            searchVal: '', // 搜索公司值
            showText: true, // 是否展示图谱文字
            isMax: false, // 是否全屏展示
            mapWidth: '88%',
            mapheight: '100%',
            nodeClickGetName: '', // 关联方node获取公司名称
            relateValue: 0, // 关联方下拉列表默认显示下标
            relationList: {}, // 关联方右侧所有度数数据
            relationDegreeList: null, // 关联方选中度数数据
            relationGetByIdList: [], // 关联方列表数据集合
            relateList: ['一度内', '二度内', '三度内'], // 关联方下拉列表数据
            relateListMenuType: '全部', // 列表筛选条件
            sortColumn: '风险分值', // 要排序的字段 默认按照风险分值降序排列
            sortType: '降序', // 排序方式，升序，降序
            isSort: 1, // 是否排序，0是，1不需要
            listLoading: '数据载入中...', // loading
            filterItem: null, // 筛选下拉框数据
            filterVal: {// 筛选下拉框选中值
                ...defaultFilterVal
            } 
        };
    }

    componentDidMount() {
        this.getList(); // 获取列表数据
        this.getRightRelation(); // 获取右侧关联方数据
        emitter.on('CHANGE_MAPS_DATA', this.getMapData);
        let _this = this;
        // 点击node 点的接口
        $(document).off('selectNode').on('selectNode', function (e, getparam) {
            _this.relatedPartyRef && _this.setState({
                companyVal: null,
                nodeClickGetName: getparam.cname
            }, function () {
                _this.getcompanyVal(getparam.name);
                $('#mapPop').show();
            });

        });
        perfectScrollbar.initialize(this.scrollRelateList);// 关联方列表滚动条
    }

    componentDidUpdate() {
        perfectScrollbar.update(this.scrollRelateList);
    }

    componentWillUnmount() {
        perfectScrollbar.destroy(this.scrollRelateList);
        emitter.removeListener('CHANGE_MAPS_DATA', this.getMapData);
        // 避免异步请求调用setState时组件已经被销毁的错误.
        this.setState = () => {};
    }

    /**
     * 关联方右侧列表
     * @return {[type]} [description]
     */
    getRightRelation() {
        let { companyId, degreeIndex } = this.state;
        companyDetailAPI({
            type: COMPANY_DETAIL_RIGHT_RELATION,
            data: {
                companyId,
                degree: degreeIndex
            }
        }).then(({ data }) => {
            let str = `relationTotalInfoDetail${degreeIndex}dVO`;
            this.relatedPartyRef && this.setState({
                relationDegreeList: data[str] || null
            });
            companyDetailAPI({
                type: COUNT_BOTTOM_RELATION_INFO,
                data: {
                    companyId,
                    degree: degreeIndex,
                    type: '全部',
                    isSort: 0,
                    category: -1
                }
            }).then(({ data }) => {
                let { relationDegreeList } = this.state;
                this.relatedPartyRef && this.setState({
                    relationDegreeList: Object.assign(relationDegreeList, data)
                });
            });
        });
    }

    /**
     * 关联方右侧新增列表
     * @return {[type]} [description]
     */
    getRightRelationNewList() {
        let { companyId, degreeIndex } = this.state;
        companyDetailAPI({
            type: COUNT_BOTTOM_RELATION_INFO,
            data: {
                companyId,
                degree: degreeIndex
            }
        }).then(({ data }) => {
            let str = `relationTotalInfoDetail${degreeIndex}dVO`;
            this.relatedPartyRef && this.setState({
                relationDegreeList: data[str] || null
            });
        });
    }

    /**
     * 关联方度数选择
     * @param  {[index]}  [下标值]
     */
    chooseDegree(index) {
        if(index === this.state.selctlistDegreesVal){
            return;
        }
        let indexInfo = '';
        if (index === 0) {
            indexInfo = '一度';
        } else if (index === 1) {
            indexInfo = '二度';
        } else if (index === 2) {
            indexInfo = '三度';
        }
        let degreeIndex = index + 1;
        emitter.emit('CHANGE_DEGREE_INDEX', degreeIndex);
        this.setState({
            degreeIndex,
            typeIndex: -1,
            searchVal: '',
            selctlistDegreesVal: index,
            filterVal: defaultFilterVal,
            pageIndex: 1,
            sortColumn: '风险分值',
            sortType: '降序',
            relateListMenuType: '全部'
        }, function () {
            // GetUserLog({
            //     page: '企业页面', // 页面类型
            //     operation: '关联方信息相关操作', // 使用日志
            //     detail: '图谱' + indexInfo + '详情'// 详情记录
            // });
            this.getRightRelation();
            this.getList('pageRefresh');
        });
    }

    /**
     * 列表数据
     * @param  {[type]}  relateListMenuType [当前筛选类型]
     * @param  {[type]}  pageRefresh       [是否更新分页]
     * @return {[type]}                     [description]
     */
    getList(pageRefresh) {
        this.setState({
            listLoading: '数据请求中',
            relationGetByIdList: []
        });
        let { companyId, degreeIndex, filterVal, relateListMenuType, sortColumn, sortType, pageIndex, pageSize, searchVal } = this.state;
        companyDetailAPI({
            type: COMPANY_DETAIL_BOTTOM_RELATION,
            data: {
                companyId,
                degree: degreeIndex,
                companyIdList: '',
                type: relateListMenuType, 
                sortColumn,
                sortType,
                isSort: 1,
                pageNum: pageIndex,
                pageSize,
                searchValue: searchVal,
                ...filterVal
            }
        }).then(({ data }) => {
            const { pageInfo, filterItem } = data;
            if (pageRefresh) {
                this.pagelist.refresh();
            }
            this.setState({
                filterItem,
                total: pageInfo.totalCount,
                relationGetByIdList: pageInfo.items || [],
                listLoading: pageInfo.totalCount > 0 ? '' : '暂无相关数据。'
            });
        }).catch(error =>{
            this.setState({
                filterItem: null,
                total: 0,
                listLoading: error.message
            });
        });
    }

    /**
     * 关联方列表相关度数的类型筛选
     * @param  {[type]} index    [下标]
     * @param  {[type]} typeInfo [筛选；类型]
     * @param  {[type]} num      [当前类型的总量]
     * @return {[type]}          [description]
     */
    getDegreeByType(index, typeInfo, num) {
        if (num === 0 && typeInfo !== '全部') {
            return;
        }
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '关联方列表', // 使用日志
        //     detail: '点击“' + typeInfo + '”类型'
        // });
        this.relatedPartyRef && this.setState({
            pageIndex: 1,
            searchVal: '',
            relateListMenuType: typeInfo,
            sortColumn: '风险分值',
            sortType: '降序',
            filterVal: defaultFilterVal
        },  () => {
            this.getList('pageRefresh');
        });
    }

    /**
     * 关联方列表排序
     * @param {[name]} [要排序的字段]
     * @param {[sort]} [是否排序]
     */
    listSort({ name, sort }){
        if(sort){
            const { sortType, sortColumn } = this.state;
            let text = '降序'; // 切换的默认降序排列
            if(sortColumn === name){
                text = sortType === '升序' ? '降序' : '升序';
            }
            this.setState({
                sortColumn: name,
                sortType: text
            }, () => {
                this.getList();
            });
        }        
    }
    /**
     * 关联方列表下拉框筛选
     * @param {[index]} [下标]
     * @param {[data]} [当前值]
     * @param {[key]} [字段名]
     */
    selectListChange(index, data, key){
        let { filterVal } = this.state;
        if(filterVal[key] !== data.value){
            this.setState({
                filterVal: {
                    ...defaultFilterVal,
                    [key]: data.value
                },
                pageIndex: 1
            }, () =>{
                this.getList('pageRefresh');
            });
        }
        
    }

    /**
     * 切换公司性质
     * @param  {[type]} index    [下标值]
     * @param  {[city]} ele    [字段]
     */
    chooseType(index, ele) {
        let treeNames = this.state.mapsData;
        if (index === 0) {
            // showAll();
            showGuDong();
        } else if (index === 1) {
            showTouZhi();
        } else if (index === 2) {
            showExecutives();
        }
        this.setState({
            typeIndex: index,
            typeName: ele,
            searchVal: ''
        }, function () {
            // GetUserLog({
            //     page: '企业页面', // 页面类型
            //     operation: '关联方信息相关操作', // 使用日志
            //     detail: '图谱' + ele + '详情'// 详情记录
            // });
        });
    }

    /**
     * 区分关联方性质
     * @param  {[type]} index    [下标值]
     * @param  {[city]} ele    [字段]
     */
    changeMapsData = (companyList) => {
        let type = this.state.typeName;
        let data = [];
        for (var i = 0; i < companyList.length; i++) {
            if (type === '投资目标') {
                if (companyList[i].relationDescribe === '投资目标') {
                    data.push(companyList[i]);
                }
            } else if (type === '股东') {
                if (companyList[i].relationDescribe === '自然人股东' || companyList[i].relationDescribe === '法人股东') {
                    data.push(companyList[i]);
                }
            } else {
                data = companyList;
            }
        }
    };

    /**
     * 图谱数据
     * @param  {[type]} data    []
     */
    getMapData = (data) => {
        this.relatedPartyRef && this.setState({
            mapsData: data.nodes
            // companyList: data.nodes
        });
    };

    /**
     * 选中公司的弹窗
     * @param  {[type]} companyName    []
     */
    getcompanyVal = (name) => {
        companyDetailAPI({
            type: COMPANY_DETAIL_ABSTRACT,
            data: {
                companyId: name
            }
        }).then(({ data }) => {
            let content = data.content;
            this.setState({
                companyVal: content
            }, () => {
                // GetUserLog({
                //     page: '企业页面', // 页面类型
                //     operation: '关联方信息相关操作', // 使用日志
                //     detail: '图谱中查看' + content.companyName + '基本信息' // 详情记录
                // });
            });

        });
    };

    /**
     * 搜索onchange事件
     * @return {[type]} [description]
     */
    searchChange(e) {
        let value = e.target.value.trim();
        this.setState({
            searchVal: value
        });
    }

    /**
     * 搜索匹配关键字
     * @param  {[type]} companyName    []
     */
    searchCompany(e) {
        this.setState({
            pageIndex: 1
        }, () => {
            this.getList('pageRefresh');
        });
        // 行为操作日志
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '关联方信息相关操作', // 使用日志
        //     detail: '根据关键字“' + this.state.searchVal + '”搜索'// 详情记录
        // });
    }

    /**
     * 放大关联方图谱
     * @param  {[type]} index    [下标值]
     */
    changeMapUp() {
        scaleFun(1, true);
    }

    /**
     * 缩小关联方图谱
     * @param  {[type]} index    [下标值]
     */
    changeMapDown = () => {
        scaleFun(-1, true);
    };

    /**
     * 缩小关联方图谱
     * @param  {[type]} index    [下标值]
     */
    hideText = () => {
        let showText = this.state.showText;
        this.setState({
            showText: !showText
        });
        hideText(showText);
    };

    /**
     * 全屏关联方图谱
     * @param  {[type]} index    [下标值]
     */
    changeMapMax = () => {
        emitter.emit('CHANGE_DEGREE_INDEX', this.state.degreeIndex);
        let isMax = this.state.isMax;
        let width = '';
        let height = '';
        if (!isMax) {
            width = $(window).width() + 'px';
            height = $(window).height() + 'px';
            $('#maxMap').parents('.mt-tabs-item').addClass('mt-max');
        } else {
            $('#Map').hide();
            width = '88%';
            height = '100%';
            $('#maxMap').parents('.mt-tabs-item').removeClass('mt-max');
        }
        this.setState({
            isMax: !isMax,
            mapWidth: width,
            mapheight: height
        });
    };

    /**
     * 还原关联方图谱
     * @param  {[type]} index    [下标值]
     */
    recoverMap = () => {
        let showText = this.state.showText;
        let isMax = this.state.isMax;
        if (!showText) {
            this.hideText();
        }
        if (isMax) {
            this.changeMapMax();
        }
        scaleFun(1, false);
    };

    goUserLogTipDetail(companyName) {
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '关联方信息相关操作', // 使用日志
        //     detail: '图谱中点击' + companyName + '企业进入详情'// 详情记录
        // });
    }

    /**
     * 关联方列表分页回调
     * @param  {[type]} pageNumber [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback = (page) => {
        if(page.current !== this.state.pageIndex){
            this.setState({
                pageIndex: page.current
            }, function () {
                this.getList();
            });
        }
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    /**
     * 查询是否为个人，如果是个人需要进入个人信息页面
     * @param  {[type]} name     [公司或者人民]
     * @param  {[type]} dataId   [id]
     * @param  {[type]} industry [行业]
     * @return {[type]}          [description]
     */
    listGoDetail(name, dataId, industry, black, ele) {
        // console.log(ele, 'ele');
        // let isPerson = ele.frname === '--'; // 判断是否是个人，个人进入个人信息页面
        // let logInfo = '点击“' + name + '”进入企业页面';
        // if (isPerson) {
        //     logInfo = '点击“' + name + '”进入个人信息';
        //     windowOpenByUrl(`/main/overall/relatedDetail/${ele.name}/${dataId}`);
        // } else {
        //     if (black && industry !== '网络借贷') { // 黑名单
        //         windowOpenByUrl(`${DEFAULT_DETAIL}/${BLACK}/${name}/${dataId}/hmd/${switchIndustry(industry)}`);
        //     } else {
        //         windowOpenByUrl(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${name}/${dataId}/${switchIndustryYW(industry)}`);
        //     }
        // }
        // GetUserLog({
        //     page: '企业页面',
        //     operation: '关联方列表',
        //     detail: logInfo
        // });
        HJPromise({
            url: '/api/v1.0/personDetail/isPerson.do',
            data: {
                valueId: dataId
            },
            type: 'post'
        }).then((response) => {
            
            let isPerson = response.data.isPerson; // 判断是否是个人，个人进入个人信息页面
            let logInfo = '点击“' + name + '”进入企业页面';
            if (isPerson === 'true') {
                logInfo = '点击“' + name + '”进入个人信息';
                windowOpenByUrl(`/main/overall/relatedDetail/${ele.name}/${dataId}`);
            }else if(black){// 黑名单
                windowOpenByUrl(`${DEFAULT_DETAIL}/${BLACK}/${name}/${dataId}/hmd/${switchIndustry(industry)}`);
            }else {
                windowOpenByUrl(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${name}/${dataId}/${switchIndustryYW(industry)}`);
            }
            
            // GetUserLog({
            //     page: '企业页面',
            //     operation: '关联方列表',
            //     detail: logInfo
            // });
            
        });
    }

    render() {
        const { companyVal, total, degreeIndex, selctlistDegreesVal, listLoading, filterItem, relationGetByIdList, filterVal, relationDegreeList, relateListMenuType } = this.state;
        let popBox = '';
        if (companyVal) {
            let industryFlag = false;
            classIndustry.forEach((value)=> {
                if(value.name === companyVal.industry) {
                    industryFlag = true;
                }
            });
            let companyName = companyVal.companyName ? companyVal.companyName : this.state.nodeClickGetName;
            if (companyVal.black) {
                popBox = <div>
                    <div className="map-title font18">{companyName}</div>
                    <ul className="map-list">
                        <li>法定代表人：{fieldAnomaly(companyVal.frname)}</li>
                        <li>注册资本：{fieldAnomaly(companyVal.regcap)}</li>
                        <li>成立日期：{fieldAnomaly(companyVal.esdate)}</li>
                        <li>注册地址：{fieldAnomaly(companyVal.address)}</li>
                        <li>所属行业：{fieldAnomaly(companyVal.industry)}</li>
                        <li>风险状态: 黑名单</li>
                        <li className="map-item-btn">
                            <Link className="btn font18"
                                  target="_blank"
                                  onClick={this.goUserLogTipDetail.bind(this, companyName)}
                                  to={`${DEFAULT_DETAIL}/${BLACK}/${companyName}/${companyVal.bbdQyxxId}/hmd/${switchIndustry(companyVal.industry)}`}>查看详情</Link>
                        </li>
                    </ul>
                </div>;
            } else {
                popBox = <div>
                    <div className="map-title font18">{companyName}</div>
                    <ul className="map-list">
                        <li>法定代表人：{fieldAnomaly(companyVal.frname)}</li>
                        <li>注册资本：{fieldAnomaly(companyVal.regcap)}</li>
                        <li>成立日期：{fieldAnomaly(companyVal.esdate)}</li>
                        <li>注册地址：{fieldAnomaly(companyVal.address)}</li>
                        <li>所属行业：{fieldAnomaly(companyVal.industry)}</li>
                        {industryFlag ? <li>风险指数: {fieldAnomaly(companyVal.riskIndex)}</li> : null}
                        {industryFlag ? <li>风险等级：{fieldAnomaly(companyVal.riskLevel)}</li> : null}
                        <li className="map-item-btn">
                            <Link className="btn font18"
                                  target="_blank"
                                  onClick={this.goUserLogTipDetail.bind(this, companyName)}
                                  to={`${DEFAULT_DETAIL}/${switchIndustry(companyVal.industry)}/${companyName}/${companyVal.bbdQyxxId}/${switchIndustryYW(companyVal.industry)}`}>查看详情</Link>
                        </li>
                    </ul>
                </div>;
            }

        } else {
            popBox = <div className="map-tips">数据请求中...</div>;
        }
        
        return (
            <div className="related-party" ref={c => this.relatedPartyRef = c}>
                <div className="related-map-box">
                    <div className="related-map left">
                        <div className="legend-box left">
                            <ul>
                                {
                                    legendList.map(({ name, icon }, index) => {
                                        return <li key={name + index}>
                                            <img src={`/static/images/${icon}.svg`} alt={name + index}/>
                                            <span>{name}</span>
                                        </li>;
                                    })
                                }
                            </ul>
                        </div>
                        <div className={this.state.isMax ? 'related-map-main left max-map' : 'related-map-main left'}
                             id="maxMap" style={{ width: this.state.mapWidth, height: this.state.mapheight }}>
                            <div className="map-pop" id="mapPop">
                                {popBox}
                            </div>
                            <Map {...this.props}/>
                            <div className="handle-Box left">
                                {this._getHandleItem()}
                            </div>
                            <div className="related-party__analysis u-btn base" onClick={this._relateAnalysis}>
                                <Icon type="search"/><Link
                                to={`${ANALYSIS_DETAIL}/${CIRCLE}/${this.state.companyName}/${this.state.companyId}`}
                                target="_blank">关联风险分析</Link>
                            </div>
                        </div>
                    </div>
                    <div className="related-list left">
                        <div className="menu-box">
                            {
                                ['一度', '二度', '三度'].map((ele, index) => {
                                    let itemName = index === degreeIndex - 1 ? 'item active-item' : 'item';
                                    return <a key={index} className={itemName} href="javascript:;"
                                              onClick={this.chooseDegree.bind(this, index, '')}>
                                        {ele}
                                    </a>;
                                })
                            }
                        </div>
                        {/** 关联方右侧除了一度显示股东以及投资目标，二度和三度需要隐藏 */}
                        <div className="menu-box" style={{ display: degreeIndex === 1 ? 'block' : 'none' }}>
                            {
                                ['股东', '对外投资', '董监高'].map((ele, index) => {
                                    let itemName = index === this.state.typeIndex ? 'item active-item' : 'item';
                                    return <a key={index} className={itemName} href="javascript:;"
                                              onClick={this.chooseType.bind(this, index, ele)}>
                                        {ele}
                                    </a>;
                                })
                            }
                        </div>
                        <div className="company-list" id="companyList">
                            <table>
                                {
                                    relationDegreeList && 
                                        <tbody>
                                            <tr>
                                                <td width="158px">关键自然人</td>
                                                <td>
                                                    <span className="text-ellipsis"
                                                          title={relationDegreeList.keyNature}>{fieldAnomaly(relationDegreeList.keyNature)}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>关键非自然人</td>
                                                <td><span className="text-ellipsis"
                                                          title={relationDegreeList.unKeyNature}>{fieldAnomaly(relationDegreeList.unKeyNature)}</span></td>
                                            </tr>
                                            <tr>
                                                <td>关联集聚行业</td>
                                                <td><span className="text-ellipsis"
                                                          title={relationDegreeList.relationIndustry}>{fieldAnomaly(relationDegreeList.relationIndustry)}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>关联集聚地</td>
                                                <td><span className="text-ellipsis"
                                                          title={relationDegreeList.relationPlace}>{fieldAnomaly(relationDegreeList.relationPlace)}</span></td>
                                            </tr>
                                            {
                                                tabArr.map((ele, index) =>{
                                                    let { key, shortName, name } = ele;
                                                    const value = relationDegreeList[key];
                                                    return index > 0 ? 
                                                            <tr key = {key}>
                                                                <td>{name}</td>
                                                                <td>
                                                                    <span className="cursor-pointer type-num"
                                                                        onClick={this.getDegreeByType.bind(this, index, shortName, value)}>{value}</span>
                                                                </td>
                                                            </tr> : null;
                                                })
                                            }
                                        </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
                <div className="related-tab-box">
                    <div className="header-action">

                        {/** 关联方下拉**/}
                        <Select
                            value={selctlistDegreesVal}
                            style={{ width: 120 }}
                            modalStyle={{ width: 120, height: 'auto', background: '#395369', color: '#fff' }}
                            onChange={(index, data) => this.chooseDegree(data.value)}
                            trigger={'click'} key={+new Date()}>
                            {
                                this.state.relateList.map(function (item, index) {
                                    {
                                        return (
                                            <Option value={index} key={index}>{item}</Option>
                                        );
                                    }
                                })
                            }
                        </Select>
                        {/** 关联方表单筛选类型 **/}
                        {
                            relationDegreeList && 
                                <div className="table-type-list" ref={meunType => this.meunType = meunType}>
                                    { 
                                        tabArr.map( (ele, index) => {
                                            let { key, shortName } = ele;
                                            const value = relationDegreeList[key];
                                            return (
                                                    <a  key = {key} onClick={this.getDegreeByType.bind(this, index, shortName, key)}
                                                        className={classname({
                                                            noHover: value <= 0,
                                                            active: relateListMenuType === shortName
                                                        })}>{shortName}({value}）</a>
                                            );
                                        })
                                    }
                                </div>
                        }                      
                        {/** 搜索 （只有类型为全部的时候才展示）**/}
                        <div className="action-right">
                            {
                                relateListMenuType === '全部' ?
                                    <div className="search-box">
                                        <i className="iconfont icon-sousuo font20"
                                           onClick={this.searchCompany.bind(this)}></i>
                                        <input type="text"
                                               id="searchIpt"
                                               placeholder="请输入企业名/人名进行搜索"
                                               className="search-input"
                                               value={this.state.searchVal}
                                               ref={searchInput => this.searchInput = searchInput}
                                               onChange={this.searchChange.bind(this)}></input>
                                    </div>
                                    :
                                    null
                            }
                            <a className="expor-box"
                               href={`/api/v1.0/companyDetail/exportExcel.do?companyId=${this.state.companyId}&degree=${degreeIndex}&type=${relateListMenuType}&isSort=0&category=-1&operationPage=企业页面`}>
                                <span>下载关联方列表</span>
                            </a>
                        </div>
                    </div>
                    <div className="table-content clearfix">
                        <div className="left company-name">
                            <table className="table-theme">
                                <thead>
                                <tr>
                                    <td className="pl30">企业名/人名</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    relationGetByIdList.map(function (ele, index) {
                                        let investRatioInfo = ele.investRatio === null ? '' :
                                            <span className="dis-block cap-scale">出资比例{ele.investRatio}</span>;
                                        return (
                                            <tr key={index}>
                                                <td className="pl30 item-name">
                                                        <span className="text-ellipsis dis-block"
                                                              title={ele.name}
                                                              onClick={this.listGoDetail.bind(this, ele.name, ele.dataId, ele.industry, ele.black, ele)}>{ele.name}</span>
                                                    {investRatioInfo}
                                                </td>
                                            </tr>
                                        );
                                    }.bind(this))
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="left company-remark">
                            <div className="scroll-relate-list"
                                 ref={scrollRelateList => this.scrollRelateList = scrollRelateList}>
                                <table className="table-theme">
                                    <thead>
                                    <tr>
                                        {
                                            sortArr.map((ele, index) =>{
                                                const { name, sort, width, isSelect = false, key, unit = '' } = ele;
                                                let dom = '- -';
                                                if(isSelect){ // 下拉框
                                                    if(filterItem && filterItem[key]){
                                                        let arr = [...filterItem[key]];
                                                        arr.unshift(name);
                                                        dom = <Select
                                                                value={filterVal[key]}
                                                                defaultValue = {name}
                                                                style={{ width: 120 }}
                                                                modalStyle={{ width: 120, height: 'auto', background: '#395369', color: '#fff' }}
                                                                onChange={(index, data) => {this.selectListChange(index, data, key);}}
                                                                trigger={'click'} key={+new Date()}>
                                                                {
                                                                    arr.map(function (item, i) {
                                                                        return  <Option value={i === 0 ? key === 'category' ?  -1 : '' :  item} key={item}>{item}{i !== 0 && unit}</Option>;
                                                                    })
                                                                }
                                                            </Select>;
                                                    }
                                                }else{ // 排序筛选
                                                    dom = <span className="cursor-pointer" onClick = {() => {this.listSort(ele);}}>
                                                                {name}
                                                                {sort ? <em className="iconfont icon-paixu"></em> : null}
                                                            </span>;
                                                }
                                                return <td width ={width} key = {name} >
                                                            {dom}
                                                        </td>;
                                            })
                                        }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        relationGetByIdList.map((ele, index) => {
                                            return (
                                                <tr key={index}>
                                                    {
                                                        sortArr.map((item, i) =>{
                                                            let text = fieldAnomaly(ele[item.key]);
                                                            if(ele.black){
                                                                if(item.key === 'riskIndex'){
                                                                    text = '- -'; 
                                                                }else if(item.key === 'riskLevel'){
                                                                    text = '黑名单';
                                                                }
                                                            }
                                                            return <td  key = {item.name} width = {item.width} title = {text}>
                                                                       <span  style={{ cursor: 'default' }} className="text-ellipsis dis-block"
                                                                            title={text}>{text}</span>
                                                                    </td>;
                                                        })
                                                    }
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        {
                           !relationGetByIdList.length && listLoading && <div className="no-data">{listLoading}</div>
                        }
                    </div>
                    <div className="page-box"
                         style={{ display: relationGetByIdList.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={this.state.pageIndex}
                                  pageSize={this.state.pageSize}
                                  callback={this.pageCallback}
                                  total={total}/>
                        &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                     type="text"/>
                        &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
    _getHandleItem() {
        let item = [
            {
                icon: this.state.isMax ? 'icon-suoxiao' : 'icon-fangda',
                click: this.changeMapMax
            },
            {
                icon: 'icon-wenzi',
                click: this.hideText
            },
            {
                icon: 'icon-jiahao',
                click: this.changeMapUp
            },
            {
                icon: 'icon-minus',
                click: this.changeMapDown
            },
            {
                icon: 'icon-shuaxin',
                click: this.recoverMap
            }
        ];
        return item.map(({ icon, click }, index) => <a key={index} className="btn" onClick={click}><i
            className={`iconfont ${icon} font18`}/></a>);
    }

    _relateAnalysis() {
           // 
    }
}