import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { setLocal, setSession } from '../../../utils/storage';
import { message } from 'antd/lib/index';
import { HJPromise } from '../../../utils/hjPromise';

class NoLandfallToRiskMonitor extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.noLandFallLogin();
    }

    noLandFallLogin = () => {
        let { card: userName, isShowChart, riskColor } = this.props.params;
        if (userName === '') {
            message.error('账号不能为空!请填写完整');
            return;
        }
        let condition = {};
        condition.username = userName;
        HJPromise({
            url: '/login/userLoginNoPassword.do',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: condition
        }).then((response) => {
            let userInfo = response.content;
            let { city } = userInfo;
            city = city === null ? '' : city;
            setSession('userInfo', userInfo);
            // 设置store内部的city值
            // monitorIndexStore.setCurrentMapClickCity(city);
            setLocal('user', response.content);
            browserHistory.push(`/main/riskMonitor/2/${riskColor}`);
        }).catch((err) => {
            let msg = { err };
            this.setState({
                errMsg: msg
            });
        });
    };

    render() {
        return (
            <div/>
        );
    }
}

export default NoLandfallToRiskMonitor;
