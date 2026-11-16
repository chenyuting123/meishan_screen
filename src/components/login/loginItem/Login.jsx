/**
 * Created by ashima on 2017/4/17.
 * Remark 登录
 */
import './login.scss';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { setLocal, remove } from 'Utils/storage';

import { login } from '../../../services/login';
import config from '../../../config/config';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMgs: '',
            username: '',
            password: '',
            ip: '127.0.0.1',
            ipLocation: '南京'
        };
    }
    /**
     * 登录
     * @return {[type]} [description]
     */
    handleLogin = () => {
        let _this = this;
        let username = _this.state.username.trim();
        let password = _this.state.password.trim();

        if (username === '' || password === '') {
            _this.setState({ errorMgs: '账号或密码错误，请重新输入！' });
            return;
        }

        login({
            name: username,
            password: password
        }).then((res) => {
            setLocal('user', res.data);
            setTimeout(function () {
                browserHistory.push('/main/overall');
            }, 0);
        }, (error) => {
            if (error) {
                if (error.message.indexOf('账户已到期') !== -1) {
                    _this.setState({ errorMgs: error.message });
                } else {
                    _this.setState({ errorMgs: '账号或密码错误，请重新输入！' });
                }
            }
        });
    }

    inputChange = (event) => {
        let inputDom = event.target;
        this.setState({ errorMgs: '' }, function () {
            if (inputDom.className === 'login_username') {
                this.setState({ username: inputDom.value });
            } else {
                this.setState({ password: inputDom.value });
            }
        });
    }

    render() {
        return (
            <div className="login-root" onKeyDown={(e) => {
                if (e.keyCode === 13) {
                    this.handleLogin();
                }
            }}>
                <div className="login_box">
                    <div className="login_logo">
                        <div className="login_earth"></div>
                    </div>
                    <div className="login_form">
                        <div className="login-main">
                            <div className="login_title">金服科技类金融大数据监测预警平台</div>

                            <div className="login-input username">
                                <em className="iconfont icon-user"></em>
                                <input id="login_username" type="text" onChange={this.inputChange} placeholder="账号"
                                       className="login_username"/>
                            </div>

                            <div className="login-input">
                                <em className="iconfont icon-password"></em>
                                <input id="login_password" type="password" onChange={this.inputChange} placeholder="密码"
                                       className="login_password"/>
                            </div>

                            <p className="login_error">{this.state.errorMgs}</p>
                            <a href="javascript:void(null)" className="login-btn" onClick={this.handleLogin}>登 录</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}