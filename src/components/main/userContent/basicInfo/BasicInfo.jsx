import './basicInfo.scss';
import React, { Component } from 'react';
import { getLocal } from 'Utils/storage';
import { Tip } from 'mtui/index';
import { isNotEmpty } from 'Utils/util';
import { Services } from 'Constants/common';
import { personalCenterPAPI } from 'Services/personal';
import emitter from '../../../../utils/emitter';
const { PERSONAL_CENTER_USER_PLUS } = Services;
export default class BasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: {} // 用户到期与剩余次数统计,
        };
    }
    componentDidMount() {
        this.getUserCount();
    }
    // 用户到期与剩余次数统计
    getUserCount = () =>{
        personalCenterPAPI({
            type: PERSONAL_CENTER_USER_PLUS
        }).then(({ data })=>{
            this.setState({
                userCount: data
            }, ()=>{
                let count = isNotEmpty(this.state.serCount) && this.state.userCount.residue_degree;
                emitter.emit('GETDEGREE', count);
            });
        }, (error)=>{
            console.error(error.message);
        });
    }
  
    render(){
        let { userCount } = this.state;
        let { reportNum, bulletinNum, blackCount, checkedCount, disposal } = this.props;
        return (
            <div className = "basicInfo">
                <div className = "left">
                    <div className="item-box">
                        <div className="item">
                            <span className="item-num"><b>{ blackCount ? blackCount : 0}</b>家</span>
                            <span className="item-name">黑名单企业</span>
                        </div>
                        <div className="item">
                            <span className="item-num"><b>{checkedCount ? checkedCount : 0}</b>家</span>
                            <span className="item-name">已排查企业</span>
                        </div>
                        <div className="item">
                            <span className="item-num"><b>{disposal ? disposal : 0}</b>家</span>
                            <span className="item-name">已处置企业</span>
                        </div>
                        <div className="item">
                            <span className="item-num"><b>{bulletinNum ? bulletinNum : 0}</b>份</span>
                            <span className="item-name">简报</span>
                        </div>
                    </div>
                </div>
                <div className="left lineBox"><span className="lineStyle"></span></div>
                <div className="right">
                    <span className="user-icon"></span>
                    <span className="user-name">{getLocal('user').username}</span>
                    <div className="item-box">
                        <span className="item">绑定邮箱：<span>{ isNotEmpty(userCount) &&  userCount.email ? userCount.email : '暂未绑定邮箱' }</span></span><br/>
                        <span className="item">账户到期时间：<span>{ isNotEmpty(userCount) && userCount.expiration_date ? userCount.expiration_date : '无限期' }</span></span><br/>
                    </div>
                </div>
            </div>
        );
    }
}