/**
 * Created by hejie on 2017/4/19.
 * Remark 用户中心入口
 */
import './userContent.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import BasicInfo from './basicInfo/BasicInfo';
import emitter from 'Utils/emitter';
import classname from 'classnames';
import { Services } from 'Constants/common';
import { personalCenterPAPI } from 'Services/personal';
import { Tip } from 'mtui/index';

const { PERSONAL_CENTER_USER_NUM, PERSONAL_CENTER_BULLETIN_NUM, PERSONAL_CENTER_BLACK_COUNT, PERSONAL_CENTER_QUERY_STATUS, PERSONAL_CENTER_BLACK_UNLOOK, PERSONAL_CENTER_PROCESS_UNLOOK } = Services;
export default class UserContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportNum: null, // 研报数量
            blackCount: null, // 黑名单企业数量
            bulletinNum: null, // 简报数量
            checkedCount: null, // 已排查
            disposal: null, // 已处置
            lookCount: null, // 已查看
            unBlack: 0, // 未查看黑名单
            unProcess: 0 // 未查看进程
        };
    }

    componentDidMount() {
        this.getReportDownloadNumber();
        this.getBulletinNumber();
        this.getBlackCount();
        this.getCheckedCount();
        this.getDisposalCount();
        this.getLookCount();
        this.getBlackUnLook();
        this.getProcessUnLook();
    }

    // 研报统计
    getReportDownloadNumber = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_USER_NUM
        }).then(({ data }) => {
            this.setState({
                reportNum: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 简报统计
    getBulletinNumber = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_BULLETIN_NUM
        }).then(({ data }) => {
            this.setState({
                bulletinNum: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 黑名单企业-统计
    getBlackCount = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_BLACK_COUNT
        }).then(({ data }) => {
            this.setState({
                blackCount: data
            });
            emitter.emit('BLACKCOUNT', data);
        }, (error) => {
            console.error(error.message);
        });
    };
    // 已查看
    getLookCount = () => {
        personalCenterPAPI({
            data: {
                dealStatus: 1
            },
            type: PERSONAL_CENTER_QUERY_STATUS
        }).then(({ data }) => {
            this.setState({
                lookCount: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };

    // 已排查
    getCheckedCount = () => {
        personalCenterPAPI({
            data: {
                dealStatus: 2
            },
            type: PERSONAL_CENTER_QUERY_STATUS
        }).then(({ data }) => {
            this.setState({
                checkedCount: data
            });
        }, (error) => {
            console.error(error.message);
        });

    };
    // 已处置
    getDisposalCount = () => {
        personalCenterPAPI({
            data: {
                dealStatus: 3
            },
            type: PERSONAL_CENTER_QUERY_STATUS
        }).then(({ data }) => {
            this.setState({
                disposal: data
            });
        }, (error) => {
            console.error(error.message);
        });
    };
    // 未查看黑名单统计
    getBlackUnLook = () => {
        personalCenterPAPI({
            type: PERSONAL_CENTER_BLACK_UNLOOK
        }).then(({ data }) => {
            this.setState({
                unBlack: data  
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
    setUserCenterLog = (type) => {
        // GetUserLog({
        //     page: '个人中心', // 页面类型
        //     operation: '点击' + type, // 使用日志
        //     detail: type + '详情'// 详情记录
        // });
    };

    render() {
        let { reportNum, bulletinNum, blackCount, checkedCount, disposal, lookCount, unBlack, unProcess } = this.state;
        let info = {
            reportNum,
            bulletinNum,
            blackCount,
            checkedCount,
            disposal
        };
        return (
            <div className="userContent">
                <div className="basic-info">
                    <BasicInfo {...info}/>
                </div>
                <div className="bottom">
                    <div className="menu left">
                        <ul>
                            {/* <li className="item">
                                <Link activeClassName="active" 
                                onClick={this.setUserCenterLog.bind(this, '我的关注')}
                                className={classname('menu-nav', {active: this.props.location.pathname.indexOf('attention') !== -1 })} 
                                to={{ pathname: '/main/userContent/attention', query: {id: userData.userPo.id}}}>
                                    <span className = "center">
                                        <span className = "iconfont-box">
                                            <i className="iconfont icon-attention font-same"></i>
                                            {
                                                attentionNum > 0 ?
                                                    <i className="item-num">{attentionNum}</i> : null
                                            }
                                        </span>
                                        <span className="menu-name">
                                            我的关注
                                        </span>
                                    </span>
                                </Link>
                            </li> */}
                            <li className="item">
                                <Link to={{ pathname: '/main/userContent/blackList' }}
                                      onClick={this.setUserCenterLog.bind(this, '我的黑名单')}
                                      activeClassName="active"
                                      className={classname('menu-nav', { active: this.props.location.pathname.indexOf('blackList') !== -1 })}>
                                    <span className="center">
                                        <span className="iconfont-box">
                                            <i className="iconfont icon-heimingdan font-same"></i>
                                            {
                                                unBlack > 0 ?
                                                    <i className="item-num">{unBlack}</i> : null
                                            }
                                        </span>
                                        <span className="menu-name">
                                            我的黑名单
                                        </span>
                                    </span>
                                </Link>
                            </li>
                            <li className="item">
                                <Link to={{ pathname: '/main/userContent/report', query: { reportNum: reportNum } }}
                                      onClick={this.setUserCenterLog.bind(this, '我的报告')}
                                      activeClassName="active"
                                      className={classname('menu-nav', { active: this.props.location.pathname.indexOf('report') !== -1 })}>
                                    <span className="center">
                                        <span className="iconfont-box">
                                            <i className="iconfont icon-yonghuxingweibaogao font-same"></i>
                                            {/* {
                                                reportNum > 0 ?
                                                    <i className="item-num">{reportNum}</i> : null
                                            } */}
                                        </span>
                                        <span className="menu-name">
                                            我的报告
                                        </span>
                                    </span>
                                </Link>
                            </li>
                            <li className="item">
                                <Link to={{
                                    pathname: '/main/userContent/process',
                                    query: { checkedCount: checkedCount, disposal: disposal, lookCount: lookCount }
                                }}
                                      onClick={this.setUserCenterLog.bind(this, '我的进程')}
                                      activeClassName="active"
                                      className={classname('menu-nav', { active: this.props.location.pathname.indexOf('process') !== -1 })}>
                                    <span className="center">
                                        <span className="iconfont-box">
                                            <i className="iconfont icon-yonghuxingweibaogao font-same"></i>
                                            {
                                                unProcess > 0 ?
                                                    <i className="item-num">{unProcess}</i> : null
                                            }
                                        </span>
                                        <span className="menu-name">
                                            我的进程
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="right-list right">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
} 