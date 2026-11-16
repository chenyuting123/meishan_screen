/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 我的关注-风险变动提示
 */

import './riskChange.scss';
import React, { Component } from 'react';
import { HJPromise } from 'Utils/hjPromise';
import { uuid } from 'Utils/util';
import { switchIndustry, switchIndustryYW } from 'Utils/formatter';
import { PageList, Input, Button } from 'mtui/index';
import classname from 'classnames';
import emitter from 'Utils/emitter';
import { DEFAULT_DETAIL } from 'RouterPath';

export default class RiskChange extends Component {
    constructor(props) {
        super(props);
        this.num = null;
        this.pagelist = null;
        this.state = {
            changes: [],
            current: 1, // 当前页
            size: 10, // 每页数
            total: 0, // 总量
            listData: [], // 所有数据
            listLoading: '数据载入中...' // 列表加载
        };
        this.toPage = this.toPage.bind(this);
        this.pageCallback = this.pageCallback.bind(this);
        this.getList = this.getList.bind(this);
    }

    componentDidMount() {
        emitter.on('REFRESH_USER_DATA', this.getList); // 更新用户信息
        this.getList();
    }

    componentWillUnmount() {
        emitter.removeListener('REFRESH_USER_DATA', this.getList);
    }

    /**
     * 获取数据
     */
    getList() {
        let _this = this;
        HJPromise({
            url: '/personal/risk/change.do',
            data: {
                page: this.state.current,
                pageSize: this.state.size
            }
        }).then((result) => {
            if (result.code === 200) {
                if (result.content === null || result.content.items === null) {
                    result.content = {
                        items: []
                    };
                }
                emitter.emit('ITEM_NUMBER_CHANGE', 'attentionNum', result.content.totalCount);
                _this.setState({
                    listData: result.content.items,
                    total: result.content.totalCount,
                    listLoading: '暂无相关数据！'
                });
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
        let _this = this;
        this.setState({
            current: pageInfo.current
        }, function () {
            _this.getList();
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
        HJPromise({
            url: '/personal/look/over/risk/company.do',
            data: {
                id: id,
                company: company
            }
        }).then(() => {
            // GetUserLog({
            //     page: '个人中心', // 页面类型
            //     operation: '我的关注', // 使用日志
            //     detail: '风险变动列表点击' + company + '进入详情'// 详情记录
            // });
            _this.getList();
            window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${company}/${routeId}/${switchIndustryYW(industry)}`);
        });
    }

    render() {
        let { listData } = this.state;
        return (
            <div className="risk-change">
                <div className="tab-item ">
                    <table className="table-theme">
                        <tbody>
                        {
                            listData.length > 0 ?
                                listData.map(function (item, index) {
                                    {
                                        let companyDetail = JSON.parse(item.companyDetail);
                                        return (
                                            <tr key={index}>
                                                <td width="15%" className="pl30 textL  cursor-pointer">
                                                <span title={item.company}
                                                      onClick={this.goToDetail.bind(this, item.companyId, item.id, item.company, item.industry)}
                                                      className="name text-ellipsis">{item.company}
                                                </span>
                                                </td>
                                                <td width="10%">
                                                    <em className="type radius-btn">{item.industry}</em>
                                                </td>
                                                <td width="20%">
                                                    <div className={classname('conpany-soure', {
                                                        yellow: item.riskLevel === '重点关注',
                                                        sky: item.riskLevel === '持续监控',
                                                        orange: item.riskLevel === '高危预警'
                                                    })}>
                                                        <span className="danger-text min">{item.riskLevel}</span>
                                                        {
                                                            item.rise === 0 ?
                                                                <em className="danger-flag iconfont icon-up2 hidden"></em> : null
                                                        }
                                                        {
                                                            item.rise === 1 ?
                                                                <em className="danger-flag iconfont icon-up2"></em> : null
                                                        }
                                                        {
                                                            item.rise === -1 ?
                                                                <em className="danger-flag iconfont icon-down2"></em> : null
                                                        }
                                                        <span className="danger-num min">{item.riskIndex}</span>
                                                    </div>
                                                </td>
                                                {
                                                    companyDetail.map((list) =>
                                                        <td key={uuid()}>
                                                            <div>
                                                                <p className={classname('info-number', { isUpdate: list.isupdate === 1 })}>{list.value}</p>
                                                                <p className="info-title">{list.type}</p>
                                                            </div>
                                                        </td>
                                                    )
                                                }
                                            </tr>
                                        );
                                    }
                                }.bind(this)) : <tr>
                                    <td width="100%" className="textC">{this.state.listLoading}</td>
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