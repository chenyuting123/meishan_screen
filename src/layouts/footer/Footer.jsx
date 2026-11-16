import './footer.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Modal } from 'antd';
import { Services } from 'Constants/common';
import { feedbackAPI } from 'Services/detail';
import { MAIN, ANALYSIS, DEFAULT_DETAIL, BLACK } from 'RouterPath';

const { FEEDBACK } = Services;

export default class Footer extends Component {

    constructor(props) {
        super(props);
        this.suggestInput = null;
        this.state = {
            suggestSuccess: false,
            emptyValue: false,
            suggestVisible: false
        };
    }

    showSuggestModal() {
        this.setState({
            suggestSuccess: false,
            emptyValue: false,
            suggestVisible: true
        });
    }

    cancelSuggestModal() {
        this.setState({
            suggestVisible: false
        });
    }

    // textArea change回调
    textAreaChange(e) {
        let hasValue = !!e.target.value.trim().length;
        this.setState({
            emptyValue: !hasValue
        });
    }

    confirm() {
        if (!this.suggestInput.value.trim()) {
            this.setState({
                emptyValue: true
            });
        } else {
            feedbackAPI({
                type: FEEDBACK,
                data: {
                    feedback: this.suggestInput.value.trim()
                }
            }).then(() => {
                this.setState({
                    suggestSuccess: true
                });
            });
        }
    }

    render() {
        return (
            <div className="footer">
                <Link to="" className="feedback" onClick={this.showSuggestModal.bind(this)}>意见反馈</Link>
                <div className="baseMsg">
                    <span>客服联系电话：0574-86708715</span>
                    <span>客服联系邮箱：jinfu512@163.com</span>
                    <span>公司地址：浙江省宁波市北仑区梅山七星路88号6号楼C幢</span>
                    <p>2018版权所有@金服科技 浙ICP备18030914号 建议浏览器：Chrome核心浏览器
                        建议分辨率：1920*1080</p>
                </div>

                <Modal
                    visible={this.state.suggestVisible}
                    wrapClassName="vertical-center-modal footer-model"
                    width={460}
                    title={'意见反馈'}
                    onOk={this.cancelSuggestModal.bind(this)}
                    onCancel={this.cancelSuggestModal.bind(this)}
                >
                    {
                        !this.state.suggestSuccess ?

                            <div className="mt-panel-box">
                                <div className="remark textL">反馈内容：</div>
                                <div className="textC">
                                        <textarea name="modify" ref={(ipt) => {
                                            this.suggestInput = ipt;
                                        }} onChange={this.textAreaChange.bind(this)} id="modifyM" cols="60" rows="8"
                                                  placeholder="请反馈您的建议,我们非常希望听到您的声音！">
                                        </textarea>
                                    {
                                        this.state.emptyValue ?
                                            <p className="font14 warning">请输入反馈内容！</p> :
                                            null
                                    }
                                </div>
                                <div className="model-active">
                                    <div className="btn blue" onClick={this.confirm.bind(this)}>提交</div>
                                    <div className="btn gray" onClick={this.cancelSuggestModal.bind(this)}>取消</div>
                                    <p className="font16 color-gray line"></p>
                                </div>
                            </div>
                            :
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>我们已经收到您的反馈信息，非常感谢您的支持！</p>
                                </div>
                                <div className="model-active">
                                    <p className="font16 color-gray line"></p>
                                    <div className="btn blue" onClick={this.cancelSuggestModal.bind(this)}>确定</div>
                                </div>
                            </div>
                    }
                </Modal>
            </div>
        );
    }
}

