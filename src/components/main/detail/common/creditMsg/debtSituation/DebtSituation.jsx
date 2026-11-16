/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-欠税情况
 */

import './debtSituation.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';
import { uuid } from 'Utils/util';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailCreditAPI } from 'Services/detail';
import Immutable from 'immutable';

const { CREDIT_QYQSINNER } = Services;
export default class DebtSituation extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.debtSituation = null;
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
     * 获取欠税情况列表
     * @return {[type]} [description]
     */
    getList(nextProps){
        let { currentCompanyId } = nextProps || this.props;
        if (!currentCompanyId) {
            let { companyId, current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_QYQSINNER,
                data: {
                    companyId: companyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data })=>{
                let content = data;
                if (content === null || content.items === null || 0) {
                    content = {
                        items: []
                    };
                }
                let { items, totalCount, page } = content;
                this.debtSituation && this.props.getNum('debtSituation', totalCount || 0);
                this.debtSituation && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        } else {
            let { current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_QYQSINNER,
                data: {
                    companyId: currentCompanyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data })=>{
                let content = data;
                if (content === null || content.items === null || 0) {
                    content = {
                        items: []
                    };
                }
                let { items, totalCount, page } = content;
                this.debtSituation && this.props.getNum('debtSituation', totalCount || 0);
                this.debtSituation && this.setState({
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
        }, function(){
            this.getList();
        });
    }
    componentDidMount(){
        this.getList();
    }

    render() {
        const { listData } = this.state;
        return (
            <div className="debt-situation" ref={c => this.debtSituation = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="10%">序号</td>
                            <td width="15%">欠税日期</td>
                            <td width="15%">税种</td>
                            <td width="15%">欠税金额</td>
                            <td width="20%">纳税人识别号</td>
                            <td width="25%">主管税务机关</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map( (debt, index) =>
                                    <tr key={uuid()}>
                                        <td>{ (this.state.requestBackPage - 1) * 10 + (index + 1) }</td>
                                        <td>{fieldAnomaly(debt.taxesTime)}</td>
                                        <td>{fieldAnomaly(debt.taxesCategory)}</td>
                                        <td>{fieldAnomaly(debt.taxesAmount)}</td>
                                        <td>{fieldAnomaly(debt.taxpayerId)}</td>
                                        <td>{fieldAnomaly(debt.taxAuthorities)}</td>
                                    </tr>
                                )
                                :
                                <tr><td colSpan="6">{this.state.listLoading}</td></tr>
                        }
                        </tbody>
                    </table>
                    <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={ pagelist => this.pagelist = pagelist}
                                  current={this.state.current}
                                  pageSize={this.state.size}
                                  callback={this.pageCallback.bind(this)}
                                  total={this.state.total}/>
                        <span>
                            &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={ num => this.num = num} size="xm" type="text" />
                            &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}