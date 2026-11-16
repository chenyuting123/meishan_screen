/*
* author:TanJun
* describe:整个项目的入口
* createTime:2018/6/20
* */

import React, { Component } from 'react';
import './app.scss';
import CommonLoading from '../../components/common/commonLoading';

export default class App extends Component {
    render() {
        return (
            <div className="wrapper">
                {this.props.children}
                <CommonLoading/>
            </div>);
    }
}