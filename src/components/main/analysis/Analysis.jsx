/*
* author:TanJun
* describe:Analysis
* createTime:2018/6/20
* */
import './analysis.scss';
import React, { Component } from 'react';

class Analysis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Analysis'
        };
    }

    render() {
        return <div>{this.props.children}</div>;
    }

}

export default Analysis;