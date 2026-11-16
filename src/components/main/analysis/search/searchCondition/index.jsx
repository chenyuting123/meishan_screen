/*
* author:TanJun
* describe:SearchCondition
* createTime:2018/6/21
* */
import './index.scss';
import React, { Component } from 'react';
import { Icon } from 'antd';
import ConditionItem from './ConditionItem';
import searchConditionItem from './searchCondition.json';

class SearchCondition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        let { open } = this.state;
        return <div className="c-search-condition">
            {this._getConditionList(0, 2)}
            <div className="c-search-condition__handle textC" onClick={() => {
                this.setState({ open: !open });
            }}>
                {`${open ? '收起以下' : '展开所有'}筛选条件`}
                <Icon type={`double-${open ? 'left' : 'right'}`}/>
            </div>
            {open ? this._getConditionList(2, 100) : null}
        </div>;
    }

    _getConditionList = (start, end) => {
        let data = searchConditionItem;
        return data.filter((item, index) => index < end && index >= start).map((item, index) => <ConditionItem
            key={index} {...item} getList={this.props.getList}/>);
    };

}

export default SearchCondition;