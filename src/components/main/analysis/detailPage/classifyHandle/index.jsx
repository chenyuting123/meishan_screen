/*
* author:TanJun
* describe:ClassifyHandle
* createTime:2018/7/5
* */
import './index.scss';
import React, { Component } from 'react';
import { higgschartsType } from 'Constants/higgscharts';
import { getSession } from 'Utils/storage';
import { Icon } from 'antd';
import appData from 'Utils/appData';

const { CIRCLE, COMMUNITY, STOCK, NATURAL, SEEK, INDUSTRY, COUNT } = higgschartsType;
const items = [
    { key: 1, name: '关联风险分析', type: CIRCLE },
    { key: 2, name: '关键路径分析', type: COMMUNITY },
    { key: 3, name: '股权穿透分析', type: STOCK },
    // {key: 4, name: '核心自然人分析', type: NATURAL},
    { key: 5, name: '关系探寻分析', type: SEEK },
    { key: 6, name: '地域分布分析', type: INDUSTRY },
    { key: 7, name: '关联方统计分析', type: COUNT }
];

class ClassifyHandle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.type || CIRCLE,
            item: items
        };
        appData.setAppData({ type: 'higgschartsType', info: props.type || CIRCLE });
    }

    render() {
        let { toggleExplain, isShowAtlas } = this.props;
        return <div className="c-classfiy-handle">
            <ul>
                {this._getItem()}
            </ul>
            {isShowAtlas ? <p className="c-classfiy-handle__explain" onClick={() => {
                toggleExplain && toggleExplain();
            }
            }>
                <span><Icon type="question-circle"/>操作说明</span>
                {/* <Icon type="up-circle"/>*/}
            </p> : null}
        </div>;
    }

    handleClickItem = (type) => {
        this.props.updateAtlas({ type });
        this.setState({ 
            current: type 
        });
        
        appData.setAppData({ 
            type: 'higgschartsType', 
            info: type 
        });
    }

    _getItem() {
        let { item, current } = this.state;
        return item.map((ite, index) => {
            let { name, type } = ite;
            return <li key={index} className={`${current === type ? 'active' : ''}`} onClick={() => this.handleClickItem(type)}>{name}</li>;
        });
    }

}

export default ClassifyHandle;