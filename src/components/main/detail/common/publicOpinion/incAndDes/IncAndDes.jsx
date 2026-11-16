/**
 * Created by fuzhihong on 2017/7/7.
 * IncAndDes 上升最快 下降最快
 */
import './incAndDes.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import { isEmpty } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import { sortArrJson } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;
let pubSen = require('Utils/d3/pubSenRelative');
const TabItem = Tabs.TabItem;

export default class IncAndDes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: {
                dynamic_down_list: [],
                dynamic_up_list: []
            }, // 数据载体
            requestDone: null // 加载完成
        };
    }

    componentDidMount() {
        this.getData();
    }

    /**
     * 获取数据
     */
    getData() {
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'dataapi_hongjing_yqglgxbd',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            let content = data.data;
            let dataBase = null;
            if (!isEmpty(content)) {
                let dynamic_down_list = content.dynamic_down_list ? content.dynamic_down_list : [];
                let dynamic_up_list = content.dynamic_up_list ? content.dynamic_up_list : [];
                dataBase = {
                    dynamic_down_list: dynamic_down_list.sort(sortArrJson('relation_trend_d_order_desc', 'isAsc')),
                    dynamic_up_list: dynamic_up_list.sort(sortArrJson('relation_trend_d_order_asc', 'isAsc'))
                };
            } else {
                dataBase = {
                    dynamic_down_list: [],
                    dynamic_up_list: []
                };
            }
            this.setState({
                listData: dataBase,
                requestDone: true
            });
        });
    }

    render() {
        const { listData, requestDone } = this.state;
        return (
            <div className="inc-and-des">
                <Tabs type="top">
                    {/* 上升*/}
                    <TabItem name="上升最快">
                        <div className="inc-and-des-box">
                            <div>
                                {
                                    requestDone ?
                                        <table className="table-theme table-bg textC">
                                            <thead>
                                            <tr>
                                                <td width="40%">关键字</td>
                                                <td width="20%">上升幅度</td>
                                                <td width="40%">相关舆情条数</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                listData.dynamic_up_list.length > 0 ?
                                                    listData.dynamic_up_list.map((item, index) =>
                                                        <tr key={index}>
                                                            <td><span className="text-ellipsis"
                                                                      title={item.relation_name}>{item.relation_name}</span>
                                                            </td>
                                                            <td>{item.relation_trend_d_asc}
                                                                <div className="iconfont icon-shangsheng"
                                                                     style={{ color: '#f76d43' }}></div>
                                                            </td>
                                                            <td>{item.relation_count}</td>
                                                        </tr>
                                                    ) : <tr>
                                                        <td colSpan="3">暂无相关数据。</td>
                                                    </tr>
                                            }
                                            </tbody>
                                        </table>
                                        : <LoadingBox type="loading2"/>
                                }
                            </div>
                        </div>
                    </TabItem>
                    {/* 下降*/}
                    <TabItem name="下降最快">
                        <div className="inc-and-des-box">
                            <div>
                                <table className="table-theme table-bg textC">
                                    <thead>
                                    <tr>
                                        <td width="40%">关键字</td>
                                        <td width="20%">下降幅度</td>
                                        <td width="40%">相关舆情条数</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        requestDone ?
                                            listData.dynamic_down_list.length > 0 ?
                                                listData.dynamic_down_list.map((item, index) =>
                                                    <tr key={index}>
                                                        <td><span className="text-ellipsis"
                                                                  title={item.relation_name}>{item.relation_name}</span>
                                                        </td>
                                                        <td>{item.relation_trend_d_desc}
                                                            <div className="iconfont icon-shangsheng reverse"
                                                                 style={{ color: '#7ef4e1' }}></div>
                                                        </td>
                                                        <td>{item.relation_count}</td>
                                                    </tr>
                                                ) : <tr>
                                                    <td colSpan="3">暂无相关数据。</td>
                                                </tr>
                                            : <tr>
                                                <td colSpan="3"><LoadingBox type="loading2"/></td>
                                            </tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabItem>
                </Tabs>
            </div>
        );
    }
}