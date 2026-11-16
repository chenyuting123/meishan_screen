/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息-行政处罚
 */

import './punishment.scss';
import React, { Component } from 'react';
import { PageList, Input, Button } from 'mtui/index';
import { uuid } from 'Utils/util';
import emitter from 'Utils/emitter';
import { fieldAnomaly } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailManageDataAPI } from 'Services/detail';
import Immutable from 'immutable';

const { DETAIL_MANAGE_XZCF } = Services;
export default class Punishment extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.punishment = null;
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
        let { currentCompanyId } = nextProps;
        if (currentCompanyId) {
            let isCurrentCompanyId = Immutable.is(currentCompanyId, this.props.currentCompanyId);
            if (!isCurrentCompanyId) {
                this.getList(nextProps);
            }
        }
    }

    // /**
    //  * 获取行政处罚列表
    //  * @return {[type]} [description]
    //  */
    // getList(data) {
    //     this.punishment && this.setState({
    //         listData: data || [],
    //         listLoading: '暂无相关数据！'
    //     }, () => {
    //         this.props.getNum('punishment', this.state.listData.length);
    //     });
    // }
    // componentWillMount() {
    //     emitter.on('GET_XZCF_INFO', this.getList);
    //     this.punishment && this.setState({
    //         businessInfoNum: 3
    //     });
    // }

    // componentWillUnmount() {
    //     emitter.removeListener('GET_XZCF_INFO', this.getList);
    // }

    /**
     * 获取行政处罚列表
     * @return {[type]} [description]
     */
    getList =(nextProps)=> {
        let { currentCompanyId } = nextProps || this.props;
        if (!currentCompanyId) {
            let { companyId, current, size } = this.state;
            detailManageDataAPI({
                type: DETAIL_MANAGE_XZCF,
                data: {
                    companyId: companyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data }) => {
                let content = data;
                this.punishment && this.setState({
                    listData: [],
                    listLoading: '暂无相关数据！'
                }, () => {
                    if (content !== null) {
                        let { items, totalCount } = content;
                        this.punishment && this.props.getNum('punishment', totalCount);
                        this.punishment && this.setState({
                            listData: items === null ? [] : items,
                            total: totalCount,
                            pageShow: 'block'
                        });
                    } else {
                        this.punishment && this.props.getNum('punishment', 0);
                    }
                });
            });
        } else {
            let { current, size } = this.state;
            detailManageDataAPI({
                type: DETAIL_MANAGE_XZCF,
                data: {
                    companyId: currentCompanyId,
                    page: current,
                    pageSize: size
                }
            }).then(({ data }) => {
                let content = data;
                this.punishment && this.setState({
                    listData: [],
                    listLoading: '暂无相关数据！'
                }, () => {
                    if (content !== null) {
                        let { items, totalCount } = content;
                        this.punishment && this.props.getNum('punishment', totalCount);
                        this.punishment && this.setState({
                            listData: items === null ? [] : items,
                            total: totalCount,
                            pageShow: 'block'
                        });
                    } else {
                        this.punishment && this.props.getNum('punishment', 0);
                    }
                });
            });
        }
    }

    getListNextprop =()=> {
        let { companyId, current, size } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_XZCF,
            data: {
                companyId: companyId,
                page: current,
                pageSize: size
            }
        }).then(({ data }) => {
            let content = data;
            this.punishment && this.setState({
                listData: [],
                listLoading: '暂无相关数据！'
            }, () => {
                if (content !== null) {
                    let { items, totalCount } = content;
                    this.punishment && this.props.getNum('punishment', totalCount);
                    this.punishment && this.setState({
                        listData: items === null ? [] : items,
                        total: totalCount,
                        pageShow: 'block'
                    });
                } else {
                    this.punishment && this.props.getNum('punishment', 0);
                }
            });
        });
    }
     /**
     * 分页回调
     * @param  {[type]} pageNumber [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback(page) {
        this.setState({
            current: page.current
        }, function () {
            this.getList();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        const { listData } = this.state;
        return (
            <div className="punishment" ref={c => this.punishment = c}>
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="20%">文书号</td>
                            <td width="20%">违法事实</td>
                            <td width="15%">处罚机关</td>
                            <td width="10%">发布日期</td>
                            <td width="35%">处罚结果</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listData.length > 0 ?
                                listData.map((punishment, index) =>
                                    <tr key={uuid()}>
                                        <td>{fieldAnomaly(punishment.codePunish)}</td>
                                        <td>{fieldAnomaly(punishment.typePunish)}</td>
                                        <td>{fieldAnomaly(punishment.orgPunish)}</td>
                                        <td>{fieldAnomaly(punishment.datePublic)}</td>
                                        <td dangerouslySetInnerHTML={{ __html: fieldAnomaly(punishment.contentPunish) }}></td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td colSpan="5">{this.state.listLoading}</td>
                                </tr>
                        }
                        </tbody>
                    </table>
                    <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={this.state.start}
                                  pageSize={this.state.size}
                                  callback={this.pageCallback.bind(this)}
                                  total={this.state.total}/>
                        &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                     type="text"/>
                        &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
}