/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-裁判文书
 */

import './instrument.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailCreditAPI } from 'Services/detail';
import Immutable from 'immutable';

const { CREDIT_ZGCPWSW } = Services;
export default class Instrument extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.instrument = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            instruments: null,
            current: 1, // 当前页
            size: 10, // 每页数
            total: 0, // 总量
            instrumentVisible: false, // 文书详情显示
            instrumentItemData: [], // 文书详情存储当前数据
            listData: [], // 所有数据
            listLoading: '数据载入中...', // 列表加载
            requestBackPage: 1
        };
    }

    componentWillReceiveProps(nextProps) {
        let { currentCompanyId } = nextProps;
        if (currentCompanyId) {
            let isCurrentCompanyId = Immutable.is(currentCompanyId, this.props.currentCompanyId);
            if (!isCurrentCompanyId) {
                this.getList(nextProps);
            }
        }
    }

    /**
     * 获取裁判文书列表
     * @return {[type]} [description]
     */
    getList(nextProps) {
        let { currentCompanyId } = nextProps || this.props;
        if (!currentCompanyId) {
            let { companyId, current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_ZGCPWSW,
                data: {
                    companyId: companyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data }) => {
                let content = data;
                if (content === null || content.items === null || 0) {
                    content = {
                        items: []
                    };
                }
                let { items, totalCount, page } = content;
                this.instrument && this.props.getNum('instrument', totalCount || 0);
                this.instrument && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        } else {
            let { current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_ZGCPWSW,
                data: {
                    companyId: currentCompanyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data }) => {
                let content = data;
                if (content === null || content.items === null || 0) {
                    content = {
                        items: []
                    };
                }
                let { items, totalCount, page } = content;
                this.instrument && this.props.getNum('instrument', totalCount || 0);
                this.instrument && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        }
    }

    /**
     * 文书详情
     * @return {[type]} [description]
     */
    getDocDetail(data) {
        let _this = this;
        _this.setState({
            instrumentVisible: true,
            instrumentItemData: data
        }, function () {
            // 重置滚动条位置
            this.scrollInstrument.scrollTop = 0;
            this.scrollInstrumentRight.scrollTop = 0;
        });
    }

    /**
     * 文书详情关闭
     * @return {[type]} [description]
     */
    instrumentDetail() {
        this.setState({
            instrumentVisible: false
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
            this.getList();
        });
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        const { listData, instrumentItemData } = this.state;
        return (
            <div className="instrument" ref={c => this.instrument = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="5%">序号</td>
                            <td width="12%">审判日期</td>
                            <td width="17%">案号</td>
                            <td width="20%">案件标题</td>

                            <td width="15%">案由</td>
                            <td width="15%">案件类型</td>
                            <td width="8%">当事人类型</td>
                            <td width="8%">案例结果</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length > 0 ?
                                listData.map((instrument, index) =>
                                    <tr key={uuid()}>
                                        <td>{(this.state.requestBackPage - 1) * 10 + (index + 1)}</td>
                                        <td>{instrument.sentenceDate || '--'}</td>
                                        <td><span
                                            className="text-ellipsis doc-casecode">{instrument.casecode || '--'}</span>
                                        </td>
                                        <td>
                                            <span className="text-ellipsis doc-title"
                                                  onClick={this.getDocDetail.bind(this, instrument)}
                                                  title={fieldAnomaly(instrument.title)}>{fieldAnomaly(instrument.title)}</span>
                                        </td>
                                        <td>{fieldAnomaly(instrument.actionCause)}</td>
                                        <td>{fieldAnomaly(instrument.caseType)}</td>
                                        <td>{fieldAnomaly(instrument.litigantType)}</td>
                                        <td>{fieldAnomaly(instrument.caseoutCome)}</td>
                                    </tr>
                                ) :
                                <tr>
                                    <td colSpan="8">{this.state.listLoading}</td>
                                </tr>
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

                    <Modal
                        visible={this.state.instrumentVisible}
                        wrapClassName="instrument-model"
                        width={740}
                        title={this.state.instrumentItemData.title}
                        onCancel={this.instrumentDetail.bind(this)}
                        onOk={this.instrumentDetail.bind(this)}
                    >
                        <div className="mt-panel-box">
                            <div className="title">
                                <h2>{this.state.instrumentItemData.title}</h2>
                                <p className="title-remark">{instrumentItemData.casecode}</p>
                            </div>
                            <div className="content clearfix">
                                <div className="instrument-left"
                                     ref={scrollInstrument => this.scrollInstrument = scrollInstrument}
                                     dangerouslySetInnerHTML={{ __html: instrumentItemData.main }}>
                                </div>
                                <div className="right"
                                     ref={scrollInstrumentRight => this.scrollInstrumentRight = scrollInstrumentRight}>
                                    <div><span
                                        className="mark-t">诉讼当事人：</span>{fieldAnomaly(instrumentItemData.litigant)}
                                    </div>
                                    <div><span
                                        className="mark-t">法院当事人：</span>{fieldAnomaly(instrumentItemData.courtLitigant)}
                                    </div>
                                    <div><span
                                        className="mark-t">起诉方当事人：</span>{fieldAnomaly(instrumentItemData.proLitigant)}
                                    </div>
                                    <div><span
                                        className="mark-t">被诉方当事人：</span>{fieldAnomaly(instrumentItemData.defLitigant)}
                                    </div>
                                    <div><span
                                        className="mark-t">起诉方其他相关人：</span>{fieldAnomaly(instrumentItemData.proOtherRelated)}
                                    </div>
                                    <div><span
                                        className="mark-t">被诉方其他相关人：</span>{fieldAnomaly(instrumentItemData.defOtherRelated)}
                                    </div>
                                    <div><span
                                        className="mark-t">实用法条：</span>{fieldAnomaly(instrumentItemData.applicableLaw)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div>
        );
    }
}