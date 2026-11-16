/**
 * Created by ashima on 2017/4/18.
 * Remark 黑名单
 */
import './list.scss';
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { PageList, Input, Button, Grid, Select } from 'mtui/index';
import emitter from 'Utils/emitter';
import { shouldUpdate } from 'Utils/util';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import { getBlackList } from '../../../services/home';
import { classIndustry } from 'Constants/common';

let Immutable = require('immutable');

const Option = Select.Option;

class BlackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dangerVal: '2',
            start: 0, // 页码
            size: 10, // 页量
            total: 0, // 总量
            descAsc: '降序', // 排序方式
            province: '', // 省
            city: '', // 市
            area: '', // 区县
            bondedArea: '',
            selctDangerVal: 0,
            selctIndustryVal: 0,
            // selectRiskLevel: '全部风险', // 风险等级
            selectIndustry: classIndustry[0].name, // 行业
            listData: [], // 所有数据
            listLoading: '数据载入中...', // 列表加载
            tdHasIndustry: false, // 除了综合监测表格有行业筛选
            tdWidth: '20%',
            industryList: classIndustry, // 所有行业
            monitorIndustry: '', // 行业
            pageIndustry: '' // 页面行业
        };
    }

    componentDidMount() {
        emitter.on('CHANGE_MONITING_INDUSTRY', this.setMonitorIndustry);
    }

    componentWillReceiveProps(nextProps) {
        let isEqualSelctProvince = Immutable.is(nextProps.selctProvince, this.props.selctProvince);
        let isEqualSelctArea = Immutable.is(nextProps.selctArea, this.props.selctArea);
        let isEqualSelctCity = Immutable.is(nextProps.selctCity, this.props.selctCity);
        let isEqualSelctBoundArea = Immutable.is(nextProps.selctBoundArea, this.props.selctBoundArea);
        if (!isEqualSelctArea || !isEqualSelctCity || !isEqualSelctProvince || !isEqualSelctBoundArea) {
            this.setState({
                province: nextProps.selctProvince,
                city: nextProps.selctCity,
                area: nextProps.selctArea,
                bondedArea: nextProps.selctBoundArea,
                start: 0
            }, function () {
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
    setMonitorIndustry = (industry) => {
        let getIndustry = industry;
        let tdHasIndustry = true;
        let tdWidth = '15%';
        if (industry === '综合监测' || industry === undefined) {
            getIndustry = '';
        } else {
            tdHasIndustry = false;
            tdWidth = '20%';
        }

        this.setState({
            monitorIndustry: getIndustry,
            pageIndustry: getIndustry,
            tdWidth: tdWidth,
            tdHasIndustry: tdHasIndustry,
            start: 0
        }, function () {
            this.getList(true);
        });
    };

    getList = (refresh) => {
        let { province, city, area, bondedArea, descAsc, size, monitorIndustry, start } = this.state;
        let _this = this;
        getBlackList({
            province,
            city,
            area,
            bondedArea,
            descAsc,
            industry: monitorIndustry,
            pageSize: size,
            page: start
        }).then((response) => {
            _this.props.balckTotle(response.data.totalCount, _this.state.monitorIndustry, '黑名单', _this.state.descAsc);
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
    };

    /**
     * [按照字段排序]
     * @param  {[type]} type [需要排序的字段]
     * @param  {[type]} dom  [当前要排序的dom]
     * @return {[type]}      [description]
     */
    sortList(dom) {
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
            descAsc: getDomDescAsc
        }, function () {
            this.getList();
        });
    }

    /**
     * 全部行业
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

    /**
     * 分页回调
     * @param  {[type]} pageNumber [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback(page) {
        this.setState({
            start: page.current - 1
        }, function () {
            this.getList();
        });
    }

    /**
     * 分页跳转
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    searchListToLog(company) {
        // GetUserLog({
        //     page: this.state.pageIndustry + '首页', // 页面类型
        //     operation: '黑名单列表', // 使用日志
        //     detail: '点击企业榜单，公司名称为：' + company // 详情记录
        // });
    }

    render() {
        return (
            <div className="danger list">
                <table className="table-theme">
                    <thead>
                    <tr>
                        <td className="textL pl30" width="10%">序号</td>
                        <td className="textL" width="30%">企业名称</td>
                        <td width={this.state.tdWidth}>
                                <span className="sort des"
                                      ref={joinDate => this.joinDate = joinDate}
                                      onClick={this.sortList.bind(this, 'joinDate')}>加入黑名单日期
                                    <em className="iconfont icon-paixu"></em>
                                </span>
                        </td>
                        <td width={this.state.tdWidth} className="textC">加入原因</td>
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
                                    let linkInfo = <Link
                                        className="company-name"
                                        target="_blank"
                                        onClick={this.searchListToLog.bind(this, item.companyName)}
                                        to={`${DEFAULT_DETAIL}/${BLACK}/${item.companyName}/${item.companyId}/hmd/${switchIndustry(item.industry)}`}>{item.companyName}
                                    </Link>;
                                    // if (item.industry === '网络借贷') {
                                    //     linkInfo = <Link
                                    //         className="company-name"
                                    //         target="_blank"
                                    //         onClick={this.searchListToLog.bind(this, item.companyName)}
                                    //         to={`${DEFAULT_DETAIL}/${switchIndustry(item.industry)}/${item.companyName}/${item.companyId}/${switchIndustryYW(item.industry)}`}>{item.companyName}
                                    //     </Link>;
                                    // }
                                    return (
                                        <tr key={index}>
                                            <td className="textL pl30">{indexNum}</td>
                                            <td className="textL">{linkInfo}</td>
                                            <td>{item.joinDate ? item.joinDate.replace(/(.{10}).*/, '$1') : '-'}</td>
                                            <td className="textC">
                                                <span className="join-reason text-ellipsis"
                                                      title={fieldAnomaly(item.joinReasons)}>{fieldAnomaly(item.joinReasons)}</span>
                                            </td>
                                            {
                                                this.state.tdHasIndustry ? <td>{fieldAnomaly(item.industry)}</td> : null
                                            }
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

export default BlackList;