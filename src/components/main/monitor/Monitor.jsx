/*
* author:TanJun
* describe:Monitor
* createTime:2018/6/20
* */

import React, { Component } from 'react';

class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Monitor'
        };
    }
    render() {
        return <div>{this.props.children}</div>;
    }
}

export default Monitor;