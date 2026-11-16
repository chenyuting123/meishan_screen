/**
 * Created by fuzhihong on 2017/7/7.
 * RelationShip 关联关系图谱
 */
import './relationShip.scss';
import React, { Component } from 'react';
import { isEmpty } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import { sortArrJson } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;
let pubSen = require('Utils/d3/pubSenRelative');

export default class RelationShip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoading: '数据加载中...',
            isNoData: false,
            listData: {}, // 数据载体
            requestDone: false // 加载完成
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
                apiId: 'dataapi_hongjie_yqglgxt',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            let content = data.data;
            this.setState({
                listLoading: '暂无相关数据。',
                requestDone: true
            }, () => {
                if (!isEmpty(content)) {
                    this.drawChart(content);
                } else {
                    this.setState({
                        isNoData: true
                    });
                }
            });
        });
    }

    drawChart(data) {
        let relationObj = {};
        let relationArr = [];

        relationObj['center'] = data.company_name;
        let relationList = data.relation_list.sort(sortArrJson('relation_order', 'isAsc')).slice(0, 20);
        let relationListLength = relationList.length;

        for (let i = 0; i < relationListLength; i++) {
            relationArr.push({
                name: relationList[i].relation_name, // 点的名字
                smallValue: 8, // 点的半径
                bigValue: relationList[i].relation_order, // 点到中心点的距离 强弱关系
                lift: relationList[i].relation_trend // 上升或者下降 1上升 0下降
            });
        }

        relationObj['list'] = relationArr;
        let layout = pubSen();
        layout.data(relationObj);
        layout.setId('relationShipChart');
        layout.setColor(['#02a7ff', '#f67d7d', '#14adff', '#333']); // 依次为 [中心点颜色, 趋势上升颜色，趋势下降颜色，周围点的文字颜色]
        layout.start();
    }

    render() {
        let { requestDone, isNoData } = this.state;
        return (
            <div className="relation-ship">
                {
                    requestDone ?

                        isNoData ?
                            <div className="v-center" style={{ width: '100%', height: '100%' }}>
                                <span>{this.state.listLoading}</span></div>
                            :
                            <div className="relation-ship-container">
                                <img src={require('Images/rbg.jpg')}/>
                                <div className="relationShipChart" id="relationShipChart"
                                     style={{ width: '100%', height: '440px' }}></div>
                            </div>
                        :
                        <div className="v-center" style={{ width: '100%', height: '100%' }}><LoadingBox type="loading2"/>
                        </div>
                }
            </div>
        );
    }
}
