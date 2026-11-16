/**
 * Created by lijing on 208/7/9.
 * Remark 我的进程
 */
import './process.scss';
import React, { Component } from 'react';
import { Btnswitch } from '../../../common/indexComponent/IndexComponent';
import { DownLoadIframe } from 'Utils/hjPromise';
import { Link } from 'react-router';
import { Select, Tip, Checkbox, Input, Button } from 'mtui/index';
import { switchIndustry, switchIndustryYW } from 'Utils/formatter';
import { Modal } from 'antd';
import PageList from '../../../common/pageList/PageList';
import { Services } from 'Constants/common';
import { contains, isNumber } from 'Utils/util';
import { fmtDateType, fmtExplainType } from 'Utils/formatter';
import { personalCenterPAPI } from 'Services/personal';
import { DEFAULT_DETAIL } from 'RouterPath';
import { classIndustry } from 'Constants/common';

const { PERSONAL_CENTER_MY_DEALLIST, PERSONAL_CENTER_PROCESS_CHANGE_OVERCANCEL } = Services;
const CheckboxGroup = Checkbox.CheckboxGroup;
export default class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabActiveVal: 1,
            industryType: classIndustry[0].name, // 行业
            industryName: classIndustry[0].name,
            comType: [],
            lookCount: this.props.location.query.lookCount, // 已查看
            disposalNum: this.props.location.query.disposal, // 已处置
            checkedCount: this.props.location.query.checkedCount, // 已排查
            dealDate_order: 'DESC', // 排序方式
            riskIndex_order: 'DESC', // 排序方式
            descAsc: 'DESC',
            exportVisible: false,
            isNew: false,
            ipo: false,
            pageSize: 10,
            page: 1,
            listLoading: '数据载入中...', // 
            total: 0, // 总量
            dataList: [], // 列表数据
            orderName: 'riskIndex_order' // 排序名称 默认按照风险指数排序
        };
    }

    componentDidMount() {
        this.getDataList();
    }

    // 获取列表数据
    getDataList = () => {
        let { orderName, tabActiveVal, industryName, isNew, ipo, pageSize, page } = this.state;
        personalCenterPAPI({
            data: {
                [orderName]: this.state[orderName],
                dealStatus: tabActiveVal,
                industry: industryName === classIndustry[0].name ? null : industryName,
                isNew,
                ipo,
                pageSize,
                page
            },
            type: PERSONAL_CENTER_MY_DEALLIST
        }).then(({ data }) => {
            this.setState({
                listLoading: '暂无相关数据！'
            }, () => {
                this.setState({
                    dataList: data.items,
                    total: data.totalCount
                });
            });
        }, (error) => {
            console.error(error.message);
        });
    };

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
            getDomDescAsc = 'ASC';
        } else {
            this[dom].className = 'sort des';
            getDomDescAsc = 'DESC';
        }
        if (type === '风险指数') {
            this.setState({
                riskIndex_order: getDomDescAsc,
                page: 1,
                orderName: 'riskIndex_order'
            }, () => {
                this.refsPageList.toPage(this.state.page);
            });
        } else if (type === '日期') {
            this.setState({
                dealDate_order: getDomDescAsc,
                page: 1,
                orderName: 'dealDate_order'
            }, () => {
                this.refsPageList.toPage(this.state.page);
            });
        }
    }

    // 点击切换
    choseTab = (val) => {
        this.setState({
            tabActiveVal: val,
            page: 1,
            dealDate_order: 'DESC', // 排序方式
            riskIndex_order: 'DESC', // 排序方式
            isNew: false,
            ipo: false
        }, () => {
            this.getDataList();
            this.refsPageList.toPage(this.state.page);
        });
    };

    /**
     *  分页点击后执行
     */
    pageCallback = (pageInfo) => {
        this.setState({
            page: pageInfo.current
        }, () => {
            this.getDataList();
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

    render() {
        let { tabActiveVal, industryType, lookCount, disposalNum, checkedCount, dataList, pageSize, page, total } = this.state;
        let tabList = [
            { text: '已查看', value: 1, showNum: lookCount },
            { text: '已排查', value: 2, showNum: checkedCount },
            { text: '已处置', value: 3, showNum: disposalNum }
        ];
        const industryList = classIndustry;
        const selectList = [{
            name: '仅显示新增',
            value: 'newCompany'
        }, {
            name: '仅显示上市公司',
            value: 'shCompany'
        }];
        const checkList = selectList.map(item => <Checkbox key={item.value} value={item.value}>{item.name}</Checkbox>);
        const industryData = industryList.map(item => <Option key={item} value={item.name}>{item.name}</Option>); // 行业
        return (
            <div className="process">
                <div className="top-bar">
                    <Btnswitch btnList={tabList} value={tabActiveVal}
                               onClick={this.choseTab}/>
                    <a href="javascript:void(null)"
                       style={{ display: total === 0 ? 'none' : 'inline-block' }}
                       className="export action-user" onClick={this.exportList}>
                        <em className="iconfont icon-xiangxi"></em>下载列表
                    </a>
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
                            <td>
                                <Select value={industryType} onChange={this.industryChange} style={{ width: 120 }}
                                        modalStyle={{ width: 120, height: 250, color: '#fff' }}
                                        trigger="click">
                                    {industryData}
                                </Select>
                            </td>
                            <td>
                                    <span className="sort des"
                                          ref={dealDate => this.dealDate = dealDate}
                                          onClick={this.sortList.bind(this, '日期', 'dealDate')}>{fmtDateType(tabActiveVal)}
                                        <em className="iconfont icon-paixu color-blue"></em>
                                    </span>
                            </td>
                            <td>{fmtExplainType(tabActiveVal)}</td>
                            <td>注册地址</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(dataList.length > 0) ? (<tr>
                                    <td colSpan="7">{this.state.listLoading}</td>
                                </tr>) :
                                dataList.map((ele, index) => {
                                    let indexNum = (this.state.page - 1) * this.state.pageSize + index + 1;
                                    return (
                                        <tr key={index}>
                                            <td>{indexNum}</td>
                                            <td>
                                                <span className="btn font18 company-hover text-ellipsis-200"
                                                      title={ele.companyName ? ele.companyName : '-'}
                                                      onClick={this.goToDetail.bind(this, ele.qyxxId, ele.companyName, ele.industry)}>{ele.companyName ? ele.companyName : '-'}</span>
                                            </td>
                                            <td>{ele.riskIndex ? ele.riskIndex : '-'}</td>
                                            <td>{ele.industry ? ele.industry : '-'}</td>
                                            <td>{ele.dealDate ? ele.dealDate.replace(/(.{10}).*/, '$1') : '-'}</td>
                                            <td><span style={{ cursor: 'default' }} className="text-ellipsis"
                                                      title={ele.remark ? ele.remark : '-'}>{ele.remark ? ele.remark : '-'}</span>
                                            </td>
                                            <td><span style={{ cursor: 'default' }} className="text-ellipsis"
                                                      title={ele.registerArea ? ele.registerArea : '-'}>{ele.registerArea ? ele.registerArea : '-'}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                        }
                        </tbody>
                    </table>
                    <div className="page-box pageStyle" style={{ display: dataList.length > 0 ? 'block' : 'none' }}>
                        <PageList
                            ref={(c) => {
                                this.refsPageList = c;
                            }}
                            current={page}
                            pageSize={pageSize}
                            callback={this.pageCallback}
                            total={total}
                            isShow={true}
                        />
                        &nbsp;第&nbsp;<Input style={{ width: 50 }} defaultValue="" ref={(num) => {
                            this.num = num;
                        }} size="xm" type="text"/>&nbsp;页
                        &nbsp;<Button size="sm" onClick={this.toPage}>跳转</Button>
                    </div>
                </div>
                <Modal
                    visible={this.state.exportVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    okText={'提交'}
                    title={'导出列表'}
                    onCancel={this.cancelExport}
                    onOk={this.confirmExport}
                >
                    <div className="mt-panel-box">
                        <p className="font16 color-gray line">共<b className="color-blue">{total}</b>条企业信息</p>
                        <p className="font16 color-gray line">是否确认导出</p>
                    </div>
                </Modal>
            </div>
        );
    }

    /**
     * 行业下拉回调方法
     * @param  {[type]} e    [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

    industryChange = (e, { children, value }) => {
        this.setState({
            industryType: value,
            industryName: children,
            page: 1
        }, () => {
            this.getDataList();
            this.refsPageList.toPage(this.state.page);
        });
    };
    // 新增上市
    comChange = (data) => {
        this.setState({
            comType: data
        }, () => {
            let selectArr = this.state.comType,
                isNewCompany = contains(selectArr, 'newCompany'),
                isShCompany = contains(selectArr, 'shCompany');
            if (isNewCompany) {
                this.state = { ...this.state, isNew: true };
            } else {
                this.state = { ...this.state, isNew: false };
            }
            if (isShCompany) {
                this.state = { ...this.state, ipo: true };
            } else {
                this.state = { ...this.state, ipo: false };
            }
            this.getDataList();
        });
    };
    // 点击弹出导出弹框
    exportList = () => {
        this.setState({
            exportVisible: true
        });
    };
    /**
     * 确认导出
     * @param  {[type]} deletInfo  [description]
     */
    confirmExport = () => {
        window.location = `/api/v1.0/personal/importMyDeal.do?dealDate_order=${encodeURIComponent(this.state.dealDate_order)}&riskIndex_order=${encodeURIComponent(this.state.riskIndex_order)}&dealStatus=${encodeURIComponent(this.state.tabActiveVal)}&industry=${encodeURIComponent(this.state.industryName)}&isNew=${encodeURIComponent(this.state.isNew)}&ipo=${encodeURIComponent(this.state.ipo)}`;
        this.cancelExport();
    };
    /**
     * 取消导出
     * @param  {[type]} deletInfo  [description]
     */
    cancelExport = () => {
        this.setState({
            exportVisible: false
        });
    };
// 跳转详情页
    goToDetail(qyxxId, companyName, industry) {
        personalCenterPAPI({
            data: {
                qyxxId
            },
            type: PERSONAL_CENTER_PROCESS_CHANGE_OVERCANCEL
        }).then(({ data }) => {
            if (data.code === 200) {
                window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${companyName}/${qyxxId}/${switchIndustryYW(industry)}`);
            }
        }, (error) => {
            console.error(error.message);
        });
    }
}