/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息-分支机构
 */

import './basicBranchOffice.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';
import { uuid } from 'Utils/util';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailBaseDataAPI } from 'Services/detail';

const { DETAIL_BASE_DATA_FZJGEXTEND } = Services;
export default class BasicBranchOffice extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.basicBranchOffice = null;
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
     * 查询分支机构信息
     * @return {[type]} [description]
     */
    getList() {
        let { companyId, current, size } = this.state;
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_FZJGEXTEND,
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
            this.basicBranchOffice && this.props.getNum('basicBranchOffice', totalCount || 0);
            this.basicBranchOffice && this.setState({
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
            <div className="basic-branch-office" ref={c => this.basicBranchOffice = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="30%">分支机构名称</td>
                            <td width="20%">登记状态</td>
                            <td width="20%">法定代表人</td>
                            <td width="15%">成立日期</td>
                            <td width="15%">住所</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map(office =>
                                    <tr key={uuid()}>
                                        <td width="30%">
                                            <span className="text-ellipsis"
                                                  style={{ width: '300px' }}
                                                  title={fieldAnomaly(office.name)}>{fieldAnomaly(office.name)}</span>
                                        </td>
                                        <td width="20%">{fieldAnomaly(office.enterpriseStatus)}</td>
                                        <td width="20%">{fieldAnomaly(office.frname)}</td>
                                        <td width="15%">{fieldAnomaly(office.esdate)}</td>
                                        <td width="15%">
                                            <span className="text-ellipsis" style={{ width: '350px' }}
                                                  title={fieldAnomaly(office.address)}>{fieldAnomaly(office.address)}</span>
                                        </td>

                                    </tr>
                                ) : <tr>
                                    <td colSpan="5" className="textC">{this.state.listLoading}</td>
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
                                    &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num}
                                                 size="xm" type="text"/>
                            &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                                  </span>
                    </div>
                </div>
            </div>
        );
    }
}