/**
 * Created by ashima on 2017/4/17.
 * Remark 公司详情入口
 */
import './detail.scss';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Tip } from 'mtui/index';
import DetailHead from './common/detailHead/DetailHead';

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageShow: false// 判断是否有权限查看
        };
    }

    changePageShow(flag, msg) {
        if (flag) {
            this.setState({
                pageShow: true
            });
        } else {
            Tip.warning(msg, 2000, function () {
                browserHistory.push('/main/overall');
            });
        }
    }

    render() {
        return (
            <div className="detail" style={{ visibility: this.state.pageShow ? 'visible' : 'hidden' }}>
                <div className="company-msg">
                    <DetailHead {...this.props} pageShow={this.changePageShow.bind(this)}/>
                </div>
                <div className="company-content">{this.props.children}</div>
            </div>
        );
    }
}