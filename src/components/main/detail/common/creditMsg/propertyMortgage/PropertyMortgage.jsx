/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-动产抵押
 */

import './propertyMortgage.scss';
import React, { Component } from 'react';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailCreditAPI } from 'Services/detail';
import Immutable from 'immutable';

const { CREDIT_MORDETAIL } = Services;

export default class PropertyMortgage extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.propertyMortgage = null;
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
                type: CREDIT_MORDETAIL,
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
                this.propertyMortgage && this.props.getNum('propertyMortgage', totalCount || 0);
                this.propertyMortgage && this.setState({
                    listData: items,
                    total: totalCount,
                    listLoading: '暂无相关数据！',
                    requestBackPage: page
                });
            });
        } else {
            let { current, size } = this.state;
            detailCreditAPI({
                type: CREDIT_MORDETAIL,
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
                this.propertyMortgage && this.props.getNum('propertyMortgage', totalCount || 0);
                this.propertyMortgage && this.setState({
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
            <div className="property-mortgage" ref={c => this.propertyMortgage = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td>序号</td>
                            <td>申请抵押原因</td>
                            <td>抵押权人</td>
                            <td>抵押人</td>
                            <td>抵押ID</td>
                            <td>登记证号</td>
                            <td>状态标识</td>
                            <td>履约起止日期</td>
                            <td>抵押物名称</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map((mortagageInfo, index) =>
                                    <tr key={uuid()}>
                                        <td>{(this.state.requestBackPage - 1) * 10 + (index + 1)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.appregrea)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.more)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.mortgagor)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.morregId)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.morregcno)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.mortype)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.pefperform) + ' - ' + fieldAnomaly(mortagageInfo.pefperto)}</td>
                                        <td>{fieldAnomaly(mortagageInfo.guaname)}</td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td colSpan="9">{this.state.listLoading}</td>
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