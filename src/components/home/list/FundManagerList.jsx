/**
 * Created by ashima on 2017/8/17.
 * Remark 重点关注
 */
import './list.scss';
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import emitter from 'Utils/emitter';
import { PageList, Input, Button, Select, Checkbox, Tip } from 'mtui/index';
import { shouldUpdate, contains } from 'Utils/util';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import { findIndexCompanyPage } from '../../../services/home';
import { classIndustry } from 'Constants/common';

let Immutable = require('immutable');

const CheckboxGroup = Checkbox.CheckboxGroup;

class FundManagerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            size: 10,
            total: 0, // 总量
            order: '易燃指数', // 排序字段
            descAsc: '降序', // 排序方式
            province: '', // 省
            city: '', // 市
            area: '', // 区县
            bondedArea: '',
            selctIndustryVal: 0, // 列表行业下标
            listLoading: '数据载入中...', // 列表加载
            listData: [], // 所有数据
            monitorIndustry: '', // 行业
            tdHasIndustry: false, // 如果是综合监测行业，高危企业以及黑名单需要有行业筛选，其他行业则不需要
            tdWidth: '5%', // 表格宽度
            industryList: classIndustry, // 所有行业
            pageIndustry: '', // 页面所属行业
            comType: [],
            isNew: '否',
            isBreak: '否'
        };
        this.setMonitorIndustry = this.setMonitorIndustry.bind(this);
    }

    componentDidMount() {
        emitter.on('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
    }

    componentWillReceiveProps(nextProps) {
        let isEqualSelctProvince = Immutable.is(nextProps.selctProvince, this.props.selctProvince);
        let isEqualSelctArea = Immutable.is(nextProps.selctArea, this.props.selctArea);
        let isEqualSelctCity = Immutable.is(nextProps.selctCity, this.props.selctCity);
        let isEqualIndustryType = Immutable.is(nextProps.industryType, this.props.industryType);
        let isEqualSelctBoundArea = Immutable.is(nextProps.selctBoundArea, this.props.selctBoundArea);
        if (!isEqualSelctArea || !isEqualSelctCity || !isEqualSelctProvince || !isEqualIndustryType || !isEqualSelctBoundArea) {      
            this.setState({
                province: nextProps.selctProvince,
                city: nextProps.selctCity,
                area: nextProps.selctArea,
                bondedArea: nextProps.selctBoundArea,
                monitorIndustry: nextProps.industryType,
                start: 0
            }, () => {
                this.getList('refresh');
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
    }

    /**
     * 行业监测
     * @param {[type]} industry [description]
     */
    setMonitorIndustry(industry) {
        let getIndustry = industry;
        let tdHasIndustry = true;
        let tdWidth = '5%';
        if (industry === '综合监测' || industry === undefined) {
            getIndustry = '';
        } else {
            tdHasIndustry = false;
            tdWidth = '5%';
        }
        this.setState({
            monitorIndustry: getIndustry,
            pageIndustry: getIndustry,
            tdWidth: tdWidth,
            tdHasIndustry: tdHasIndustry,
            start: 0
        }, () => {
            this.getList(true);
        });
    }

    /**
     * 获取高危企业列表
     * @return {[type]} [description]
     */
    getList(refresh) {
        let { province, city, area, bondedArea, order, descAsc, size, monitorIndustry, start, isNew, isBreak } = this.state;
        if (monitorIndustry === '私募基金') {
            let _this = this;
            findIndexCompanyPage({
                fundType: '基金管理人',
                province,
                city,
                area,
                bondedArea,
                order,
                descAsc,
                pageSize: size,
                industry: monitorIndustry,
                page: start,
                isNew,
                isBreak
            }).then((response) => {
                _this.props.fundManagerTotle(response.data.totalCount, _this.state.monitorIndustry, '重点关注', _this.state.isNew, _this.state.isBreak, _this.state.order, _this.state.descAsc);
                _this.setState({
                    listLoading: '暂无相关数据！',
                    listData: []
                }, function () {
                    if (refresh) {
                        this.pagelist.refresh();
                    }
                    if (response.data !== null) {
                        let responseSoureData = response.data.items === null ? [] : response.data.items;
                        _this.setState({
                            listData: responseSoureData,
                            total: response.data.totalCount
                        });
                    }
                });
            }, (error) => {
                console.error(error.message);
            });
        } 
    }

    /**
     * 按照字段排序
     * @param  {[type]} type [需要排序的字段]
     * @param  {[type]} dom  [当前要排序的dom]
     */
    sortList(type, dom) {
        let domdescAsc = this[dom].className;
        let getDomDescAsc = this.state.descAsc;
        if (domdescAsc.indexOf('des') !== -1) {
            this[dom].className = 'sort asc';
            getDomDescAsc = '升序';
        } else {
            this[dom].className = 'sort des';
            getDomDescAsc = '降序';
        }
        this.setState({
            order: type,
            descAsc: getDomDescAsc
        }, function () {
            this.getList();
        });
    }

    /**
     * 分页回调函数
     * @param  {[type]} pageNumber 第几页
     */
    pageCallback(page) {
        this.setState({
            start: page.current - 1
        }, function () {
            this.getList();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    /**
     * 列表行业筛选
     * @param  {[type]} e    [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    selectIndustryOnChang(e, data) {
        this.setState({
            selctIndustryVal: data.value,
            start: 0,
            monitorIndustry: data.children === classIndustry[0].name ? '' : data.children
        }, function () {
            this.getList(true);
        });
    }

    searchListToLog(company) {
        // GetUserLog({
        //     page: this.state.pageIndustry + '首页', // 页面类型
        //     operation: '重点关注列表', // 使用日志
        //     detail: '点击企业榜单，公司名称为：' + company // 详情记录
        // });
    }

    comChange = (data) => {
        this.setState({
            comType: data
        }, () => {
            let selectArr = this.state.comType,
                isNew = contains(selectArr, 'new'),
                isBreak = contains(selectArr, 'break');
            if (isNew) {
                this.state = { ...this.state, isNew: '是' };
            } else {
                this.state = { ...this.state, isNew: '否' };
            }
            if (isBreak) {
                this.state = { ...this.state, isBreak: '是' };
            } else {
                this.state = { ...this.state, isBreak: '否' };
            }
            this.getList();
        });
    };

    render() {
        const selectList = [{
            name: '仅显示新增',
            value: 'new'
        }, {
            name: '仅显示违规',
            value: 'break'
        }];
        let hideTime = false;
        const checkList = selectList.map(item => <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>);
        return (
            <div className="danger list">
                <table className="table-theme">
                    <thead>
                    <tr>
                        <td className="textL" width="3%">序号</td>
                        <td className="textC" width="15%">
                            <p className="textC">企业名称</p>
                            <div style={{ fontSize: 14 }}>
                                <CheckboxGroup onChange={this.comChange} value={this.state.comType}>
                                    {checkList}
                                </CheckboxGroup>
                            </div>
                        </td>
                        <td width={this.state.tdWidth}>
                                <span className="sort des"
                                      ref={riskIndex => this.riskIndex = riskIndex}
                                      onClick={this.sortList.bind(this, '易燃指数', 'riskIndex')}>风险指数
                                    <em className="iconfont icon-paixu"></em>
                                </span>
                        </td>
                        {/* <td width={this.state.tdWidth}>*/}
                                {/* <span className="sort des"*/}
                                      {/* ref={joinDate => this.joinDate = joinDate}*/}
                                      {/* onClick={this.sortList.bind(this, '进入日期', 'joinDate')}>进入日期*/}
                                    {/* <em className="iconfont icon-paixu"></em>*/}
                                {/* </span>*/}
                        {/* </td>*/}
                        {
                            this.state.tdHasIndustry ?
                                <td width={this.state.tdWidth}>
                                    <div className="industry">
                                        <Select
                                            value={this.state.selctIndustryVal}
                                            style={{ width: 120 }}
                                            modalStyle={{ width: 120, height: 250, color: '#fff' }}
                                            onChange={this.selectIndustryOnChang.bind(this)}
                                            key={+new Date()}
                                            trigger={'click'}>
                                            {
                                                this.state.industryList.map(function (item, index) {
                                                    {
                                                        return (
                                                            <Option value={index} key={index}>{item.name}</Option>
                                                        );
                                                    }
                                                })
                                            }
                                        </Select>
                                    </div>
                                </td> : null
                        }
                        <td width={this.state.tdWidth}>违规预警</td>
                        <td width={this.state.tdWidth}>失信预警</td>
                        <td width={'8%'}>关联风险预警</td>
                        <td width={'8%'}>经营行为预警</td>
                        <td width={this.state.tdWidth}>舆情预警</td>
                        <td width={this.state.tdWidth}>处理状态</td>
                        <td width={this.state.tdWidth}>注册地区</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        !(this.state.listData.length > 0) ? (<tr>
                                <td colSpan="6">{this.state.listLoading}</td>
                            </tr>) :
                            this.state.listData.map(function (item, index) {
                                {
                                    let indexNum = (this.state.start - 0) * this.state.size + index + 1;
                                    // let date = dateFormat(item.joinDate);
                                    let isNew = item.isNew === 1 ? <em className="iconfont icon-new"></em> : null; // 是否为新加入：0 否，1 是
                                    let rise = ''; // 易燃指数是否上升；1:上升，0：持平，-1：下降 ,
                                    if (item.rise === 1) {
                                        rise = <em className="iconfont icon-up3"></em>;
                                    } else if (item.rise === 0) {
                                        rise = '';
                                    } else if (item.rise === -1) {
                                        rise = <em className="iconfont icon-down3"></em>;
                                    }
                                    return (
                                        <tr key={index}>
                                            <td className="textL">{indexNum}</td>
                                            <td className="textL">
                                                <Link
                                                    className="company-name"
                                                    target="_blank"
                                                    onClick={this.searchListToLog.bind(this, item.company)}
                                                    to={`${DEFAULT_DETAIL}/${switchIndustry(item.industry)}/${item.company}/${item.id}/${switchIndustryYW(item.industry)}`}>{item.company}&nbsp;{isNew}
                                                </Link>
                                            </td>
                                            <td>{fieldAnomaly(item.riskIndex)}</td>
                                            {hideTime ?
                                                <td>{item.joinDate ? item.joinDate.replace(/(.{10}).*/, '$1') : '-'}</td> : null
                                            }
                                            {
                                                this.state.tdHasIndustry ? <td>{fieldAnomaly(item.industry)}</td> : null
                                            }
                                            <td><i
                                                className={item.ruleBreakRisk ? 'iconfont icon-warn-o color-o' : 'iconfont icon-warn-o color-l'}/>
                                            </td>
                                            <td><i
                                                className={item.faithBreakRisk ? 'iconfont icon-warn-o color-o' : 'iconfont icon-warn-o color-l'}/>
                                            </td>
                                            <td><i
                                                className={item.relationRisk ? 'iconfont icon-warn-o color-o' : 'iconfont icon-warn-o color-l'}/>
                                            </td>
                                            <td><i
                                                className={item.manageRisk ? 'iconfont icon-warn-o color-o' : 'iconfont icon-warn-o color-l'}/>
                                            </td>
                                            <td><i
                                                className={item.yuqingRisk ? 'iconfont icon-warn-o color-o' : 'iconfont icon-warn-o color-l'}/>
                                            </td>
                                            <td>{item.dealStatus ? item.dealStatus : '未处理'}</td>
                                            <td>{fieldAnomaly(item.registerArea)}</td>
                                        </tr>
                                    );
                                }
                            }.bind(this))
                    }
                    </tbody>
                </table>
                <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                    <PageList ref={pagelist => this.pagelist = pagelist}
                              current={this.state.start}
                              pageSize={this.state.size}
                              callback={this.pageCallback.bind(this)}
                              total={this.state.total}/>
                    &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm" type="text"/>
                    &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                </div>
            </div>
        );
    }
}

export default FundManagerList;