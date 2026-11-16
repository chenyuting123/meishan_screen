/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 我的关注-关注列表
 */

import './attentionList.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';
import { HJPromise } from 'Utils/hjPromise';
import { uuid } from 'Utils/util';
import { PageList, Select, Input, Button } from 'mtui/index';
import emitter from 'Utils/emitter';
import { getLocal } from 'Utils/storage';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import { classIndustry } from 'Constants/common';

export default class AttentionList extends Component {
    constructor(props) {
        super(props);
        this.cancelAttentionModalRef = null;
        this.state = {
            id: getLocal('user').id,
            pageSize: 10,
            industry: classIndustry[0].name,
            riskLevel: '全部风险',
            order: '加入监控日期',
            descAsc: '降序',
            operateCompany: null,
            operateCompanyId: 0,
            current: 1, // 当前页
            size: 10, // 每页数
            total: 0, // 总量
            listData: [], // 所有数据
            listLoading: '数据载入中...', // 列表加载
            requestBackPage: 1, // 返回的page
            cancelAttentionVisible: false,
            firstCountNum: 0 // 第一次加载的有效条数
        };
        this.pagelist = null;
        this.num = null;
        this._showModal = this._showModal.bind(this);
        this.industrySelectOnChange = this.industrySelectOnChange.bind(this);
        this.riskSelectOnChange = this.riskSelectOnChange.bind(this);
        this.riskChange = this.riskChange.bind(this);
    }

    componentDidMount() {
        this._getList();
    }

    /**
     * 行业筛选
     * @param e
     */
    industrySelectOnChange(e) {
        let _this = this;
        this.setState({
            industry: e.target.value
        }, function () {
            _this._getList(true);
        });
    }

    /**
     * 风险指数筛选
     * @param e
     */
    riskSelectOnChange(e) {
        let _this = this;
        this.setState({
            riskLevel: e.target.value
        }, function () {
            _this._getList(true);
        });
    }

    /**
     * 排序
     * @param type
     */
    riskChange(type) {
        let _this = this;
        if (this.state.descAsc === '降序') {
            this.setState({ descAsc: '升序' });
        } else {
            this.setState({ descAsc: '降序' });
        }
        this.setState({
            order: type
        }, function () {
            _this._getList();
        });
    }

    /**
     * 获取数据列表
     * @param isSelect
     * @private
     */
    _getList(isSelect) {
        let _this = this;
        HJPromise({
            url: '/personal/my/focus.do',
            data: {
                page: this.state.current,
                pageSize: this.state.pageSize,
                industry: this.state.industry,
                riskLevel: this.state.riskLevel,
                order: this.state.order,
                descAsc: this.state.descAsc
            }
        }).then((result) => {
            if (result.code === 200) {
                if (result.content) {
                    if (result.content.items === null) {
                        result.content.items = [];
                    }
                    _this.setState({
                        listData: result.content.items.map(item => Object.assign({}, item, { offAttention: false })),
                        total: result.content.totalCount,
                        requestBackPage: result.content.page,
                        listLoading: '暂无相关数据！'
                    });
                    let that = _this;
                    if (!isSelect) {
                        _this.setState({
                            firstCountNum: result.content.totalCount - result.content.items.filter((item) => {
                                return item.status === '1';
                            }).length
                        }, function () {
                            that.props.getTotalList(that.state.firstCountNum);
                        });
                    } else {
                        _this.props.getTotalList(_this.state.firstCountNum);
                    }
                }
            }
        });
    }

    /**
     * 跳转回调
     */
    toPage() {
        this.pagelist.toPage(this.num.getValue());
    }

    /**
     * 分页回调
     * @param  {[type]} pageInfo [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback(pageInfo) {
        this.setState({
            current: pageInfo.current
        }, function () {
            this._getList();
        });
    }

    /**
     * 打开modal
     * @param company
     * @param id
     * @param e
     * @private
     */
    _showModal(company, id, e) {
        let _this = this;
        this.setState({
            operateCompany: company,
            operateCompanyId: id,
            cancelAttentionVisible: true
        });
    }

    /**
     * 关闭modal
     */
    closelAttentionModal() {
        this.setState({
            cancelAttentionVisible: false
        });
    }

    /**
     * 确认取关
     */
    attentionModal() {
        let _this = this;
        HJPromise({
            url: '/personal/cancel/focus.do',
            data: {
                id: this.state.operateCompanyId,
                company: this.state.operateCompany
            }
        }).then((result) => {
            if (result.code === 200) {
                this.props.cancelFocus();
                _this._getList();
                emitter.emit('REFRESH_USER_DATA'); // 让其他组件更新
                this.setState({
                    cancelAttentionVisible: false
                });
            }
        });
    }

    /**
     * 跳转详情页处理
     * @param routeId
     * @param id
     * @param company
     * @param industry
     */
    goToDetail(routeId, id, company, industry) {
        let _this = this;
        // 查看被别人加入黑名单的企业
        HJPromise({
            url: '/personal/look/black/change/cancel.do',
            data: {
                id: id,
                company: company
            }
        }).then(() => {
            HJPromise({
                url: '/common/check/is/black.do',
                data: {
                    companyId: routeId
                }
            }).then((response) => {
                // GetUserLog({
                //     page: '个人中心', // 页面类型
                //     operation: '我的关注', // 使用日志
                //     detail: '关注列表点击' + company + '进入详情'// 详情记录
                // });
                if (response.content === true) {
                    window.open(`${DEFAULT_DETAIL}/${BLACK}/${company}/${routeId}/${switchIndustryYW(industry)}/${switchIndustry(industry)}`);
                } else {
                    window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${company}/${routeId}/${switchIndustryYW(industry)}`);
                }
                _this._getList();
            });
        });
    }

    render() {
        let { listData } = this.state;

        return (
            <div className="attention-list">
                <div className="tab-item ">
                    <table className="table-theme table-bg textC">
                        <thead>
                        <tr>
                            <td width="10%" className="textC">序号</td>
                            <td width="15%">企业名</td>
                            <td width="10%">
                                <Select
                                    modalStyle={{ color: '#fff' }}
                                    onChange={this.industrySelectOnChange}
                                    defaultValue={classIndustry[0].name}
                                    trigger={'click'}>
                                    {classIndustry.map(({ name }) => <Option value={name}>{name}</Option>)}
                                </Select>
                            </td>
                            <td width="10%">
                                <Select
                                    modalStyle={{ color: '#fff' }}
                                    onChange={this.riskSelectOnChange}
                                    defaultValue="全部风险"
                                    trigger={'click'}>
                                    <Option value="全部风险">全部风险</Option>
                                    <Option value="高危预警">高危预警</Option>
                                    <Option value="重点关注">重点关注</Option>
                                    <Option value="持续监控">持续监控</Option>
                                </Select>
                            </td>
                            <td width="10%" className="cursor-pointer" onClick={() => this.riskChange('易燃指数')}>风险指数<i
                                className="iconfont icon-paixu color-blue"></i></td>
                            <td width="10%" className="cursor-pointer"
                                onClick={() => this.riskChange('加入关注日期')}>加入监控日期<i
                                className="iconfont icon-paixu color-blue"></i></td>
                            <td width="10%">加入原因</td>
                            <td width="10%">取消监控</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(listData.length > 0) ? (<tr>
                                    <td colSpan="8">{this.state.listLoading}</td>
                                </tr>) :
                                listData.map((attention, index) => {
                                    return attention.status === '0' ?
                                        <tr key={uuid()}>
                                            <td>{(this.state.requestBackPage - 1) * 10 + (index + 1)}</td>
                                            <td><span className="btn font18 company-hover text-ellipsis-200"
                                                      title={attention.company}
                                                      onClick={this.goToDetail.bind(this, attention.companyId, attention.id, attention.company, attention.industry)}>{attention.company}</span>
                                            </td>
                                            <td>{attention.industry}</td>
                                            <td>{attention.riskLevel}</td>
                                            <td>{attention.riskIndex}</td>
                                            <td>{attention.joinDate}</td>
                                            <td><span className="text-ellipsis"
                                                      title={attention.reasons}>{attention.reasons}</span></td>
                                            <td><i className="iconfont icon-guanzhu color-red font22 hover"
                                                   onClick={(e) => this._showModal(attention.company, attention.id, e)}/>
                                            </td>
                                        </tr> :
                                        <tr key={uuid()}>
                                            <td>{(this.state.requestBackPage - 1) * 10 + (index + 1)}</td>
                                            <td><span className="btn font18 company-hover text-ellipsis-200"
                                                      title={attention.company}
                                                      onClick={this.goToDetail.bind(this, attention.companyId, attention.id, attention.company, attention.industry)}>{attention.company}</span>
                                            </td>
                                            <td colSpan="6"
                                                title={attention.reason}>该企业已被加入黑名单，原因为：{fieldAnomaly(attention.reasons)}</td>
                                        </tr>;
                                })
                        }
                        </tbody>
                    </table>
                    <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={this.state.current}
                                  pageSize={this.state.size}
                                  callback={this.pageCallback.bind(this)}
                                  total={this.state.total}/>
                        <span>
                            &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                         type="text"/>
                            &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                        </span>
                    </div>
                </div>
                <Modal
                    visible={this.state.cancelAttentionVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'取消关注'}
                    onCancel={this.closelAttentionModal.bind(this)}
                    onOk={this.attentionModal.bind(this)}
                >
                    <div className="mt-panel-box">
                        <p className="font16 color-light-black line"></p>
                        <p className="font16 color-light-black line">是否确认取消关注?</p>
                        <p className="font16 color-light-black line"></p>
                    </div>
                </Modal>

            </div>
        );
    }
}