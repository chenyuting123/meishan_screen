/*
* author:TanJun
* describe:BackHeader
* createTime:2018/6/24
* */
import './index.scss';
import React, { Component } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router';
import { MAIN, OVERALL } from 'RouterPath';

class BackHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title || '没有'
        };
    }

    render() {
        let { title } = this.props;
        return <div className="c-back-header">
            <Link to={`/${MAIN}/${OVERALL}`}><Icon type="left"/></Link>{title}
        </div>;
    }

}

export default BackHeader;