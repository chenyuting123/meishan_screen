/**
 * Created by 何洁 on 2017/4/18.
 * Remark 备注
 */
import './remark.scss';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import { uuid } from 'Utils/util';
import { Button, Grid } from 'mtui/index';
import { getLocal } from 'Utils/storage';
import { DEFAULT_DETAIL, BLACK, NETWORK } from 'RouterPath';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_DELETE_REMARK, DETAIL_FIND_REMARK_LIST, DETAIL_SAVE_REMARK } = Services;

let Immutable = require('immutable');
export default class Remark extends Component {
    constructor(props) {
        super(props);
        let dataSession = getLocal('user');
        this.remark = null;
        this.state = {
            userId: dataSession ? dataSession.id : '', // 用户id
            data: null,
            companyId: this.props.params.companyId || '',
            val: '',
            remarkVisible: false,
            operateId: null // 操作备注id
        };
        this.remarkInput = null;
        this.getData = this.getData.bind(this);
        this.saveMark = this.saveMark.bind(this);
    }

    componentDidMount() {
        // 网络借贷和问题平台需要平台字段
        if (this.props.location.pathname !== `${DEFAULT_DETAIL}/${NETWORK}` && this.props.location.pathname !== `${DEFAULT_DETAIL}/problem`) {
            this.getData();
        }
    }

    componentWillReceiveProps(nextProps, props) {
        let isEqualData = Immutable.is(nextProps.tabsName, this.props.tabsName);
        if (!isEqualData) {
            this.getData(nextProps.tabsName);
        }
    }

    /**
     * 根据公司id查询拉黑关注数量信息和备注(需登录)
     * @return {[type]} [description]
     */
    getData(platform) {
        let { companyId } = this.state;
        detailPageAPI({
            type: DETAIL_FIND_REMARK_LIST,
            data: {
                companyId,
                platform
            }
        }).then(({ data }) => {
            let content = data.content;
            if (content) {
                this.remark && this.setState({
                    data: content
                });
            }
        });
    }

    /**
     * 根据id删除备注
     * @return {[type]}    [description]
     */
    deleteRemark() {
        let { operateId } = this.state;
        let { tabsName } = this.props;
        detailPageAPI({
            type: DETAIL_DELETE_REMARK,
            data: {
                id: operateId
            }
        }).then(() => {
            this.getData(tabsName);
            this.closeDeleteModal();
        });

    }

    /**
     * 用户对公司保存备注信息
     * @param  {[type]} mark [备注]
     **/
    saveMark() {
        let { companyId, val } = this.state;
        let { tabsName } = this.props;
        if (!this.remarkInput.value.trim()) {
            this.setState({
                emptyValue: true
            });
        } else {
            detailPageAPI({
                type: DETAIL_SAVE_REMARK,
                data: {
                    companyId,
                    platform: tabsName,
                    mark: val,
                    emptyValue: false
                }
            }).then(() => {
                this.getData(tabsName);
                this.setState({
                    val: ''
                });
            });
        }
    }

    /**
     * 改变输入框的值
     * @return {[type]} [description]
     */
    handleChange(e) {
        let hasValue = !!e.target.value.trim().length;
        this.setState({
            val: e.target.value,
            emptyValue: !hasValue
        });
    }

    /**
     * 打开modal
     * @param id
     */
    showDeleteModal(id) {
        this.setState({
            operateId: id,
            remarkVisible: true
        });
    }

    /**
     * 关闭modal
     */
    closeDeleteModal() {
        this.setState({
            remarkVisible: false
        });
    }

    render() {
        return (
            <div className="remark detail-self" ref={c => this.remark = c}>
                <div className="bottom">
                    <div className="label-box">
                        <i className="iconfont icon-qianbi"></i>
                        <label className="font16">备注信息：</label>
                    </div>
                    <div className="textarea-box">
                        <textarea name="beizhu" ref={(ipt) => {
                            this.remarkInput = ipt;
                        }} className="beizhu-text font16" placeholder="请输入备注信息" id="submitText" onChange={
                            this.handleChange.bind(this)} value={this.state.val}>
                        </textarea>
                        {
                            this.state.emptyValue ?
                                <p className="font16 warning">请输入备注内容！</p> :
                                null
                        }
                        <Grid width="2/2" className="btns">
                            <Button disabled={this.state.userId === ''} type="success"
                                    onClick={this.saveMark}>提交</Button>
                        </Grid>
                        <ul className="beizhu-list font16">
                            {
                                this.state.data ? this.state.data.map((ele, index) => {
                                    return <li className="list-item" key={uuid()}>
                                        <span className="left">{ele.remark}</span>
                                        <span className="right color-gray">
                                                <span>{ele.gmtCreate}</span>
                                                <i className="iconfont icon-trash"
                                                   onClick={this.showDeleteModal.bind(this, ele.id)}></i>
                                            </span>
                                    </li>;
                                }) : null
                            }
                        </ul>
                    </div>
                </div>

                <Modal
                    visible={this.state.remarkVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'删除确认'}
                    onCancel={this.closeDeleteModal.bind(this)}
                    onOk={this.deleteRemark.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div className="remark textL">确定删除该条备注？</div>
                    </div>
                </Modal>

            </div>
        );
    }
}