/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-清算情况
 */

import './liquidationSituation.scss';
import React, { Component } from 'react';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailCreditAPI } from 'Services/detail';
import Immutable from 'immutable';

const { CREDIT_LIQUIDATION } = Services;
export default class LiquidationSituation extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.liquidationSituation = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            instruments: null,
            current: 1, // 当前页
            size: 10, // 每页数
            total: 0, // 总量
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
     * 获取被执行人列表
     * @return {[type]} [description]
     */
    getList(nextProps) {
        let { currentCompanyId } = nextProps || this.props;
        if (!currentCompanyId) {
            let { companyId, current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_LIQUIDATION,
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
                this.liquidationSituation && this.props.getNum('liquidationSituation', totalCount || 0);
                this.liquidationSituation && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        } else {
            let { current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_LIQUIDATION,
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
                this.liquidationSituation && this.props.getNum('liquidationSituation', totalCount || 0);
                this.liquidationSituation && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        }
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
        }, () => {
            this.getList();
        });
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        const { listData } = this.state;
        return (
            <div className="liquidation-situation" ref={c => this.liquidationSituation = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td>序号</td>
                            <td>清算责任人</td>
                            <td>清算完结情况</td>
                            <td>清算负责人</td>
                            <td>清算完结日期</td>
                            <td>债务承接人</td>
                            <td>债权承接人</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map((situation, index) =>
                                    <tr key={uuid()}>
                                        <td>{(this.state.requestBackPage - 1) * 10 + (index + 1)}</td>
                                        <td>{fieldAnomaly(situation.ligentity)}</td>
                                        <td>{fieldAnomaly(situation.ligst)}</td>
                                        <td>{fieldAnomaly(situation.ligprincipal)}</td>
                                        <td>{fieldAnomaly(situation.ligenddate)}</td>
                                        <td>{fieldAnomaly(situation.debttranee)}</td>
                                        <td>{fieldAnomaly(situation.claimtranee)}</td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td colSpan="7">{this.state.listLoading}</td>
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
                </div>
            </div>
        );
    }
}