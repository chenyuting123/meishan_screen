import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { setLocal, setSession } from '../../utils/storage';
import { message } from 'antd';
import { HJPromise } from '../../utils/hjPromise';
import { encode64 } from '../../utils/util';
import { ssoLogin } from '../../services/login';

class NoLandfall extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.noLandFallLogin();
    }

    noLandFallLogin = () => {
        let { tokenId } = this.props.params;
        if (tokenId === '') {
            message.error('token值不能为空!请填写完整');
            return;
        }
        ssoLogin({
            token: tokenId
        }).then((res) => {
            setLocal('user', res.data);
            setTimeout(function () {
                browserHistory.push('/main/overall');
            }, 0);
        }, (error) => {
            if (error) {
                if (error.message.indexOf('账户已到期') !== -1) {
                    message.error(error.message);
                } else {
                    message.error(error.message);
                }
                setLocal('user', '');
                browserHistory.push('/');
            }
        });
        // let condition = {};
        // condition.token = tokenId;
        // HJPromise({
        //     url: '/api/v1.0/user/sso/login.do',
        //     type: 'post',
        //     contentType: 'application/x-www-form-urlencoded',
        //     data: condition
        // }).then((res) => {
        //     if (res.statusCode === '0000') {
        //         if (res.data) {
        //             setLocal('user', res.data);
        //             setTimeout(function () {
        //                 browserHistory.push('/main/overall');
        //             }, 0);
        //         } else {
        //             setTimeout(function () {
        //                 browserHistory.push('/');
        //                 message.error(res.message);
        //             }, 0);
        //         }
        //     } else {
        //         setTimeout(function () {
        //             browserHistory.push('/');
        //             message.error(res.message);
        //         }, 0);
        //     }
        // });
    };

    render() {
        return (
            <div/>
        );
    }
}

export default NoLandfall;
