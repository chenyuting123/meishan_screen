/*
* author:TanJun
* describe:CommonLoading
* createTime:2018/7/20
* */
import './index.scss';
import loading from 'Images/loading.gif';
import React, { Component } from 'react';
import emitter from 'Utils/emitter';

class CommonLoading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }

    componentDidMount() {
        emitter.on('TOGGLE_COMMON_LOADING', this._toggleShow);
    }

    componentWillUnmount() {
        emitter.remove('TOGGLE_COMMON_LOADING', this._toggleShow);
    }

    render() {
        let { isShow } = this.state;
        return <div className="c-common-loading" style={{ display: (isShow ? 'block' : 'none') }}>
            <img src={loading}/>
        </div>;
    }

    _toggleShow = (type) => {
        this.setState({ isShow: type });
    };

}

export default CommonLoading;