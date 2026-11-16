/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-失信被执行人
 */

import './distrustIncCount.scss';
import React, { Component } from 'react';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailCreditAPI } from 'Services/detail';
import { HJPromise } from 'Utils/hjPromise';
import Immutable from 'immutable';
const { CREDIT_DISHONESTY } = Services;

export default class DistrustIncCount extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.dishonestyExecuted = null;
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

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(nextProps) {
        let { entityId } = nextProps;
        let isEntityId = Immutable.is(entityId, this.props.entityId);
        if (!isEntityId) {
            this.getList(nextProps);
        }
    }

    /**
     * 获取被执行人列表
     * @return {[type]} [description]
     */
    getList(nextProps) {
        let { current, size } = this.state;
        let { entityId } = nextProps || this.props;
        
        HJPromise({
            url: '/credit/getPersonExecByEntityId',
            data: {
                entityId: entityId,
                page: current,
                size: size
            }     
        }).then(({ data }) => {
            let content = data;
            if (content === null || content.items === null || 0) {
                content = {
                    items: []
                };
            }
            let { items, totalCount, page } = content;
            this.dishonestyExecuted && this.setState({
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
        }, function () {
            this.getList();
        });
    }

    render() {
        const { listData } = this.state;
        return (
            <div className="dishonest-executed" ref={c => this.dishonestyExecuted = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="15%">姓名</td>
                            <td width="20%">证件号码</td>
                            <td width="15%">立案时间</td>
                            <td width="20%">法院</td>
                            <td width="10%">执⾏行标的</td>
                            <td width="20%">案号</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length ?
                                listData.map((office, index) =>
                                    <tr key={uuid()}>
                                        <td>{fieldAnomaly(office.entity_name)}</td>
                                        <td>{fieldAnomaly(office.entity_id)}</td>
                                        <td>{fieldAnomaly(office.build_date)}</td>
                                        <td>{fieldAnomaly(office.court_name)}</td>
                                        <td>{fieldAnomaly(office.exec_money)}</td>
                                        <td>{fieldAnomaly(office.case_code)}</td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td colSpan="6">{this.state.listLoading}</td>
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