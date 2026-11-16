/**
 * Created by fuzhihong on 2017/4/21.
 * Remark 我的关注
 */
import './attention.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';
import { Tabs } from 'mtui/index';
import { DownLoadIframe } from 'Utils/hjPromise';
import { getLocal } from 'Utils/storage';
import AttentionList from './attentionList/AttentionList';
import RiskChange from './riskChange/RiskChange';

const TabItem = Tabs.TabItem;
export default class Attention extends Component {
    constructor(props) {
        super(props);
        this.exportModalRef = null;
        let { username } = getLocal('user');
        this.state = {
            hide: true,
            selectedTab: 0,
            totalList: 0,
            exportVisible: false,
            userName: username
        };
    }
    changeBack(tabIndex){
        this.setState({
            selectedTab: tabIndex
        });
    }

    /**
     * 打开modal
     * @private
     */
    showExportModal(){
        this.setState({
            exportVisible: true
        });
    }
    /**
     * 关闭modal
     * @private
     */
    closeExportModal(){
        this.setState({
            exportVisible: false
        });
    }

    /**
     * 获取列表总数
     * @param num
     */
    getTotalList(num){
        this.setState({
            totalList: num
        });
    }

    /**
     * 取消关注回调
     */
    cancelFocus(){
        let num = this.state.totalList - 1;
        this.setState({
            totalList: num
        });
    }

    /**
     * 确认导出列表
     */
    confirmExport(){
        let exportUrl = '/exportExcel/personalFocus.do?username=' + encodeURIComponent(this.state.userName) + '&exportType=' + encodeURIComponent('我的关注') + '&operationPage=' + encodeURIComponent('个人中心');
        DownLoadIframe(exportUrl);
        this.closeExportModal();
    }

    render() {
        return (
            <div className="attention">
                <Tabs type="top" activeIndex={0} changeBack={this.changeBack.bind(this)}>
                    <TabItem   name="关注列表" > <AttentionList getTotalList={ this.getTotalList.bind(this)} cancelFocus={ this.cancelFocus.bind(this)} /> </TabItem>
                    <TabItem   name="风险变动提示" > <RiskChange/> </TabItem>
                </Tabs>
                {
                    this.state.selectedTab === 0 && this.state.totalList > 0 ?
                        <div className="export" onClick={this.showExportModal.bind(this)}><em className="iconfont icon-xiangxi"> </em>&nbsp;导出列表</div> :
                        null
                }

                <Modal
                    visible={this.state.exportVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    okText={'提交'}
                    title={'导出列表'}
                    onCancel={this.closeExportModal.bind(this)}
                    onOk={this.confirmExport.bind(this)}>
                    <div className="mt-panel-box">
                        <p className = "font16 color-gray line"></p>
                        <p className = "font16 color-gray line">共<b className = "color-blue">{ this.state.totalList }</b>条企业信息</p>
                        <p className = "font16 color-gray line">是否确认导出?</p>
                    </div>
                </Modal>
            </div>
        );
    }
}