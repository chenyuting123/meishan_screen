/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息-监事会
 */

import './basicBoardOfSupervisors.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';
import { fieldAnomaly } from 'Utils/formatter';
import { uuid } from 'Utils/util';

export default class BasicBoardOfSupervisors extends Component {
    constructor(props) {
        super(props);
        this.supervisorDetailModalRef = null;
        this.state = {
            selectedResume: props.info[0], // 选中的简历
            supervisorVisible: false // model 显示状态
        };
    }

    /**
     * 打开model
     * @param index
     */
    supervisorModel(index){
        this.setState({
            selectedResume: this.props.info[index],
            supervisorVisible: true
        });
    }

    /**
     * 关闭model
     */
    closeSupervisorModel(){
        this.setState({
            supervisorVisible: false
        });
    }
    componentDidMount(){
        this.props.getNum('basicBoardOfSupervisors', this.props.info.length);
    }
    render() {
        const { info } = this.props;
        return (
            <div className="basic-business-info">
                {
                    info.length ?
                        <div>
                            <div className="tab-item">
                                <table className="table-theme textC">
                                    <thead>
                                    <tr>
                                        <td width="30%">姓名</td>
                                        <td width="30%">职务</td>
                                        <td width="40%">任职起始日期</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        info.map( (director, index) =>
                                            <tr key={uuid()}>
                                                <td>{fieldAnomaly(director.name)}<em onClick={() => this.supervisorModel(index)} className="iconfont icon-user color-blue hover-icon"> </em></td>
                                                <td>{fieldAnomaly(director.position)}</td>
                                                <td>{fieldAnomaly(director.asstarting)}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <Modal
                                visible={this.state.supervisorVisible}
                                wrapClassName="vertical-center-modal peolple-model"
                                width={460}
                                title={'简历'}
                                onCancel={this.closeSupervisorModel.bind(this)}
                                onOk={this.closeSupervisorModel.bind(this)}
                            >
                                <div className="mt-panel-box">
                                        <div className="mt-panel-box-content">
                                            <div className="clearfix">
                                                <div className="fl">
                                                    <em className="fwb">{this.state.selectedResume.name} </em>
                                                    <em>{this.state.selectedResume.position} </em>
                                                </div>
                                                <div className="fr">
                                                    <em>{this.state.selectedResume.asstarting} 开始任职</em>
                                                </div>
                                            </div>
                                            <div className="min-h100">
                                                {this.state.selectedResume.resume ? this.state.selectedResume.resume + ' 。' : '暂无介绍...'} 
                                            </div>
                                        </div>
                                    </div>
                            </Modal>
                        </div> :
                        <div className="tab-item">
                            <table className="table-theme textC">
                                <thead>
                                <tr>
                                    <td>姓名</td>
                                    <td>职务</td>
                                    <td>任职起始日期</td>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr><td colSpan={3} className="textC">暂无相关数据！</td></tr>
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        );
    }
}