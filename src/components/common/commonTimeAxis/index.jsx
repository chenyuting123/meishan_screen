/*
* author:TanJun
* describe:CommonTimeAxis
* createTime:2018/7/9
* */
import './index.scss';
import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { browserHistory } from 'react-router';

const { TabPane } = Tabs;

class CommonTimeAxis extends Component {

    constructor(props) {
        super(props);
        let list = this._getTimeList();
        this.state = {
            item: list,
            current: list[list.length - 1].value
        };
    }

    render() {
        let { item, current } = this.state;
        let { initAtlas, type } = this.props;
        return <div className="c-time-axis">
            <span>时间轴</span>
            <Tabs defaultActiveKey={current} size="small" className="c-time-axis__ant" onChange={(e) => {
                this.state.current = e;
                initAtlas && initAtlas({ type });
            }}>
                {item.map(({ tab, value }, index) => <TabPane tab={tab} key={value}/>)}
            </Tabs>
        </div>;
    }

    getTime() {
        let { current } = this.state;
        return current;
    }

    _getTimeList = () => {
        // 通过当前时间 倒退14个月
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            dateList = [];
        for (let i = 0; i < 14; i++) {
            let monthStr = month >= 10 ? month : '0' + month;
            dateList.push({ tab: `${year}-${monthStr}`, value: `${year}${monthStr}01` });
            month--;
            if (month <= 0) {
                year--;
                month = 12;
            }
        }
        return dateList.reverse();
    };

}

export default CommonTimeAxis;