/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息-海外投资机构
 */

import './basicInvestment.scss';
import React, { Component } from 'react';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailBaseDataAPI } from 'Services/detail';

const { DETAIL_BASE_DATA_OVERSEASINV } = Services;
export default class BasicInvestment extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.basicInvestment = null;
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

    /**
     * 查询境外投资信息
     * @return {[type]} [description]
     */
    getList() {
        let { companyId, current, size } = this.state;
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_OVERSEASINV,
            data: {
                companyId: companyId,
                page: current,
                pageSize: size
            }
        }).then(({ data }) => {
            let content = data;
            if (content === null || content.items === null) {
                content = {
                    items: []
                };
            }
            let { items, totalCount, page } = content;
            this.basicInvestment && this.props.getNum('basicInvestment', totalCount || 0);
            this.basicInvestment && this.setState({
                listData: items,
                total: totalCount,
                listLoading: '暂无相关数据！',
                requestBackPage: page
            });
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
            <div className="basic-investment" ref={c => this.basicInvestment = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="20%" className="textC pl50">海外分支机构名称</td>
                            <td width="10%">核准日期</td>
                            <td width="20%">经营范围</td>
                            <td width="20%">境内投资主体</td>
                            <td width="15%">国家地区</td>
                            <td width="15%">省市</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map((investments, index) =>
                                    <tr key={uuid()}>
                                        <td width="20%"
                                            className="textC pl50">{fieldAnomaly(investments.foreignInvestEnterprises)}</td>
                                        <td width="10%">{fieldAnomaly(investments.approvalDate)}</td>
                                        <td width="20%">{fieldAnomaly(investments.operateScope)}</td>
                                        <td width="20%">
                                            <span className="text-ellipsis subject"
                                                  style={{ width: '250px' }}
                                                  title={fieldAnomaly(investments.domesticInvestSubject)}>{fieldAnomaly(investments.domesticInvestSubject)}</span>
                                        </td>
                                        <td width="15%">{fieldAnomaly(investments.countryRegion)}</td>
                                        <td width="15%">{fieldAnomaly(investments.province)}</td>
                                    </tr>
                                ) :
                                <tr>
                                    <td colSpan="6" className="textC">{this.state.listLoading}</td>
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