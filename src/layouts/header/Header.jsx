/**
 * Created by hejie on 2017/4/17.
 * Remark 头部公共部分
 */
import './header.scss';
import '../../styles/common.scss';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { DownLoadIframe } from 'Utils/hjPromise';
import { setLocal, getLocal, remove } from 'Utils/storage';
import { shouldUpdate } from 'Utils/util';
import emitter from 'Utils/emitter';
import { TopMenu } from 'CommonComponents';
import { MAIN, OVERALL, SPECIAL_EVENT, MISTAKE_RULE, ANALYSIS, MONITOR } from 'RouterPath';
import { logout } from '../../services/login';
import { Services } from 'Constants/common';
import { personalCenterPAPI } from 'Services/personal';

const { PERSONAL_CENTER_BLACK_UNLOOK, PERSONAL_CENTER_PROCESS_UNLOOK } = Services;
const mainPath = `/${MAIN}/`, menuItems = [
    { key: mainPath + OVERALL, info: '全局实时监测预警' },
    { key: mainPath + MISTAKE_RULE, info: '企业违规预警' },
    { key: mainPath + SPECIAL_EVENT, info: '特征事件预警' },
    { key: mainPath + ANALYSIS, info: '智能检索分析' },
    { key: mainPath + MONITOR, info: '重点企业实时监控' }
    ];

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}, // 当前用户信息
            placeholderText: '请输入企业名、法人/股东/董监高、注册地址进行搜索',
            Unblack: 0,
            unProcess: 0
        };
    }

    componentDidMount() {
        let dataSession = getLocal('user');
        this.setState({ userInfo: dataSession ? dataSession : '' }); // 识别当前用户
        emitter.on('GETKER', this.getKey);
        this.getBlackUnLook();
        this.getProcessUnLook();
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }
    
    componentWillUnmount() {
        emitter.removeListener('GETKER', this.getKey);
    }
    
    getKey = (key) => {
        this._menu.updateKey(key);
    };
    /**
     * 退出登录
     * @return {[type]} [description]
     */
    loginOut = () => {
        logout({
            url: '/login/logout.do',
            urlType: 'outer',
            data: {}
        }).then(({ statusCode }) => {
            if (statusCode === '0000') {
                setLocal('user', '');
                remove('areaChange');
                browserHistory.push('/');
            }
        });
    };

    // /**
    //  * 头部邮件图标的消息提醒
    //  * @return {[type]} [description]
    //  */
    // getTopMsg() {
    //     let _this = this;
    //     HJPromise({
    //         url: '/common/top/msg.do',
    //         data: {}
    //     }).then((response) => {
    //         _this.setState({
    //             topMsg: response.content
    //         });
    //     });
    // }
    // 未查看黑名单统计
    getBlackUnLook = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_BLACK_UNLOOK
        }).then(({ data }) => {
            this.setState({
                Unblack: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 未查看进程统计
    getProcessUnLook = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_PROCESS_UNLOOK
        }).then(({ data }) => {
            this.setState({
                unProcess: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };

    /**
     * 下载用户操作手册
     * @return {[type]} [description]
     */
    downLoadUserPdf() {
        let userPdfUrl = '/operationGuide/download.do';
        DownLoadIframe(userPdfUrl);
    }

    goSearch() {
        let inputVal = this.searchInput.value.trim();
        if (inputVal !== '' && !/[.~!@#$%\^\+\*&\\\/\?\|:\.{}()';="]/.test(inputVal)) {
            browserHistory.push(`/main/search/${this.state.selectTypeText}/${inputVal}`);
        }
    }

    /**
     * 跳转首页
     * @return {[type]} [descriptiono]
     */
    goHomePage() {
        emitter.emit('goHomePage', true);
        let home = mainPath + OVERALL;
        browserHistory.push(home);
    }

    render() {
        let { userInfo } = this.state;

        return (
            <div className="header">
                <div className="header-left left">
                    <Link className="logo-box left" onClick={this.goHomePage.bind(this)}>
                    </Link>
                    <Link className="title left" onClick={this.goHomePage.bind(this)}>
                        金服科技类金融大数据监测预警平台
                    </Link>
                    <div className="left">
                        <TopMenu ref={menu => this._menu = menu} menuItems={menuItems}/>
                    </div>
                </div>
                <div className="header-right right">
                    {/* <span className="active iconfont icon-user-cz" onClick={this.downLoadUserPdf.bind(this)}*/}
                          {/* title="用户操作手册"></span> */}
                    <Link to={{ pathname: '/main/userContent/blackList' }} className="message" href="javascript:;">
                        <i className="iconfont icon-xiaoxi"/>
                        <b className="color-yellow">{this.state.Unblack === 0 && this.state.unProcess === 0 ? '' : '●'}</b>
                    </Link>
                    <Link to={{ pathname: '/main/userContent/blackList' }} className="user" href="javascript:;">
                        <i className="iconfont icon-user"/>
                        <span className="">{userInfo ? userInfo.username : null}</span>
                    </Link>
                    {
                        userInfo ?
                            <a href="javascript:void(null);" onClick={this.loginOut}>
                                <i className="iconfont icon-tuichu"/>
                            </a> : null
                    }
                </div>
            </div>
        );
    }
}
