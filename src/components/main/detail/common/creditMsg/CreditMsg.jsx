/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息
 */
import './creditMsg.scss';
import React, { Component } from 'react';
import { Tabs, LoadingBox } from 'mtui/index';
import Punishment from './punishment/Punishment'; // 行政处罚
import ToCourtAnnouncement from './toCourtAnnouncement/ToCourtAnnouncement'; // 开庭公告
import Instrument from './instrument/Instrument'; // 裁判文书
import CourtAnnouncement from './courtAnnouncement/CourtAnnouncement'; // 法院公告
import Executed from './executed/Executed'; // 被执行人
import DishonestyExecuted from './dishonestyExecuted/DishonestyExecuted'; // 失信被执行人
import JudicialAuction from './judicialAuction/JudicialAuction'; // 司法拍卖
import OperateUnusual from './operateUnusual/OperateUnusual'; // 经营异常
import DebtSituation from './debtSituation/DebtSituation'; // 欠税情况
import LiquidationSituation from './liquidationSituation/LiquidationSituation'; // 清算情况
import EquityOut from './equityOut/EquityOut'; // 股权出质
import PropertyMortgage from './propertyMortgage/PropertyMortgage'; // 动产抵押
import ExecutedIncCount from './executedIncCount/ExecutedIncCount.jsx';
import DistrustIncCount from './distrustIncCount/DistrustIncCount.jsx';
import JudgeDocsCount from './judgeDocsCount/JudgeDocsCount.jsx';
import emitter from 'Utils/emitter';
import cls from 'classnames';
import { HJPromise } from 'Utils/hjPromise';

import { uuid } from 'Utils/util';
import { SSL_OP_SINGLE_DH_USE } from 'constants';

const TabItem = Tabs.TabItem;
export default class CreditMsg extends Component{
    constructor(props){
        super(props);
        this.creditMsg = null;
        this.state = {
            punishment: 0,
            toCourtAnnouncement: 0,
            instrument: 0,
            courtAnnouncement: 0,
            executed: 0,
            dishonestyExecuted: 0,
            judicialAuction: 0,
            operateUnusual: 0,
            debtSituation: 0,
            liquidationSituation: 0,
            equityOut: 0,
            propertyMortgage: 0,
            tableList: ['行政处罚', '开庭公告', '裁判文书', '法院公告', '被执行人', '失信被执行人', '司法拍卖', '经营异常', '欠税情况', '清算情况', '股权出质', '动产抵押'],
            selectType: '主体信用信息',
            scrollList: [],
            companyOrPeopleType: '',
            executed_inc_count: 0,
            distrust_inc_count: 0,
            judge_docs_count: 0,
            session_docs_count: 0,
            entityId: '',
            currentCompanyId: '',
            companyNameType: '',
            isLoadingData: true
        };
        this.getNum = this.getNum.bind(this);
        this.getFirstItem = this.getFirstItem.bind(this);
    }
    _getItemName(itemName, itemNum){
        return (
            <div key={uuid()} className="clearfix"><span>{itemName}</span><button className="small-tab-count">{itemNum}</button></div>
        );
    }
    // 获取 开庭公告 裁判文书 法院公告当中按顺序有值得item
    getFirstItem(bigIndex){
        if(this.state.toCourtAnnouncement > 0){
            return emitter.emit('POST_FIRST_ITEM', bigIndex, 1);
        }else if(this.state.instrument > 0){
            return emitter.emit('POST_FIRST_ITEM', bigIndex, 2);
        }else if(this.state.courtAnnouncement > 0){
            return emitter.emit('POST_FIRST_ITEM', bigIndex, 3);
        }
    }
    componentDidMount(){
        emitter.on('GET_FIRST_ITEM', this.getFirstItem);
        this.creditMsg && this.setState({
            businessInfoNum: 3
        });
    }

    /**
     * tabs回调函数
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeBack(index){
        let _this = this;
        _this.setState({
            activeIndex: index
        });
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '点击企业信息', // 使用日志
        //     detail: '信用信息--' + _this.state.tableList[index] + '详细记录'// 详情记录
        // });
    }

    componentWillUnmount() {
        emitter.removeListener('GET_FIRST_ITEM', this.getFirstItem);
    }
    getNum(type, num){
        this.setState({
            [type]: num
        });
    }

    changeSelectType = (e) => {
        let { params } = this.props;
        let { companyId, companyName } = params;
        this.setState({
            selectType: e
        });
        if( e === '主体信用信息' ) {
            this.setState({
                currentCompanyId: companyId
            });
        } else if (e === '一度关联企业信用') {
            HJPromise({
                url: '/api/v1.0/relation/getRelationNodeAndLink.do',
                data: {
                    qyxxId: companyId,
                    degree: 1
                },
                type: 'post'
            }).then((response) => {
                if (response.statusCode === '0000') {
                    let scrollList = [];
                    let arrayList = response.data.nodes;
                    for (let i = 0; i < arrayList.length; i++) {
                        if (arrayList[i].symbol === 'rect') {
                            if(arrayList[i].cname !== companyName) {
                                scrollList.push(arrayList[i]);
                            }
                        }
                    }
                    this.setState({
                        scrollList,
                        companyNameType: scrollList[0].cname,
                        currentCompanyId: scrollList[0].name,
                        isLoadingData: false
                    });
                }
            });
        } else if (e === '一度关联人信用') {
            HJPromise({
                url: '/credit/queryOneDegreePerson',
                data: {
                    companyName: companyName
                }
            }).then((response) => {
                if (response.statusCode === '0000') {
                    let scrollList = response.data;
                    if (response.data.length > 0){
                        this.setState({
                            scrollList,
                            companyOrPeopleType: response.data[0].orgin_name_member,
                            isLoadingData: false,
                            entityId: response.data[0].id_no_member
                        });
                        HJPromise({
                            url: '/credit/getPersonTotalCount',
                            data: {
                                entityId: response.data[0].id_no_member
                            }
                        }).then((response) => {
                            if (response.statusCode === '0000') {
                                if(response.data){
                                    this.setState({
                                        executed_inc_count: response.data.executed_inc_count,
                                        distrust_inc_count: response.data.distrust_inc_count,
                                        judge_docs_count: response.data.judge_docs_count,
                                        session_doc_count: response.data.session_doc_count
                                    });
                                }
                            }
                        });
                    } else {
                        this.setState({
                            scrollList,
                            isLoadingData: false
                        });
                    }
                } else if(!scrollList) {
                    this.setState({
                        scrollList: [],
                        executed_inc_count: 0,
                        distrust_inc_count: 0,
                        judge_docs_count: 0,
                        session_doc_count: 0,
                        isLoadingData: false
                    });
                }
            });
        }
    }

    selectCompanyOrPeople = (e) => {
        HJPromise({
            url: '/credit/getPersonTotalCount',
            data: {
                entityId: e.id_no_member
            }
        }).then((response) => {
            if (response.statusCode === '0000') {
                this.setState({
                    executed_inc_count: response.data.executed_inc_count,
                    distrust_inc_count: response.data.distrust_inc_count,
                    judge_docs_count: response.data.judge_docs_count,
                    session_docs_count: response.data.session_docs_count
                });
            }
        });
        this.setState({
            companyOrPeopleType: e.orgin_name_member,
            entityId: e.id_no_member
        });
    }

    selectCompany = (e) => {
        this.setState({
            currentCompanyId: e.name,
            companyNameType: e.cname
        });
    }

    render(){
        let { activeIndex } = this.props;
        let { selectType, scrollList, companyOrPeopleType, companyNameType, entityId, isLoadingData } = this.state;
        return(
            <div className="credit-msg" ref={c => this.creditMsg = c}>
                <div className="selectButtomItem">
                    <div 
                        className={cls('selectDiv', selectType === '主体信用信息' ? 'active' : '')} 
                        onClick={() => this.changeSelectType('主体信用信息')}>
                        主体信用信息
                    </div>
                    <div 
                        className={cls('selectDiv', selectType === '一度关联企业信用' ? 'active' : '')} 
                        onClick={() => this.changeSelectType('一度关联企业信用')}>
                        一度关联企业信用
                    </div>
                    <div 
                        className={cls('selectDiv', selectType === '一度关联人信用' ? 'active' : '')} 
                        onClick={() => this.changeSelectType('一度关联人信用')}>
                        一度关联人信用
                    </div>
                </div>
                
                {
                    selectType === '主体信用信息' ? '' : 
                        selectType === '一度关联企业信用' ? 
                            <div className="companyAndPeopleDiv1">
                                <div className="companyAndPeopleContainer1">
                                    {
                                        scrollList && scrollList.length > 0 ? scrollList.map((item, index) => {
                                            return (
                                                <div className={cls('srcollItem1', companyNameType === item.cname ? 'active' : '')} 
                                                    key={index} 
                                                    onClick={() => {this.selectCompany(item);}}>
                                                    {item.cname}
                                                </div>
                                            );
                                        }) : <div className="itemNoData1">暂无数据</div>
                                    }
                                </div>
                            </div> : 
                            <div className="companyAndPeopleDiv2">
                                <div className="companyAndPeopleContainer2">
                                    {
                                        scrollList.length > 0 ? scrollList.map((item, index) => {
                                            return (
                                                <div className={cls('srcollItem2', companyOrPeopleType === item.orgin_name_member ? 'active' : '')} 
                                                    key={index} 
                                                    onClick={() => {this.selectCompanyOrPeople(item);}}>
                                                    {item.orgin_name_member}
                                                </div>
                                            );
                                        }) : <div className="itemNoData2">暂无数据</div>
                                    }
                                </div>
                            </div>
                }
                {
                    selectType === '一度关联人信用' ? 
                    <Tabs className="small-tab" type="top" key={activeIndex} activeIndex={activeIndex}  changeBack={this.changeBack.bind(this)}>
                        <TabItem name={this._getItemName('个人失信被执行人', this.state.executed_inc_count)} > <ExecutedIncCount getNum={this.getNum} {...this.props} entityId={entityId}/> </TabItem>
                        <TabItem name={this._getItemName('个人被执行人', this.state.distrust_inc_count)} > <DistrustIncCount  getNum={this.getNum} {...this.props} entityId={entityId}/> </TabItem>
                        <TabItem name={this._getItemName('个人裁判文书', this.state.judge_docs_count)}> <JudgeDocsCount getNum={this.getNum} {...this.props} entityId={entityId}/> </TabItem>
                        <TabItem name={this._getItemName('个人司法诉讼', this.state.session_docs_count)}> </TabItem>
                    </Tabs>
                    : 
                    <Tabs className="small-tab 1" type="top" key={activeIndex} activeIndex={activeIndex}  changeBack={this.changeBack.bind(this)}>
                        <TabItem name={this._getItemName('行政处罚', this.state.punishment)} > <Punishment getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('开庭公告', this.state.toCourtAnnouncement)} > <ToCourtAnnouncement  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('裁判文书', this.state.instrument)}> <Instrument getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('法院公告', this.state.courtAnnouncement)}> <CourtAnnouncement getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('被执行人', this.state.executed)}> <Executed  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('失信被执行人', this.state.dishonestyExecuted)}> <DishonestyExecuted  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('司法拍卖', this.state.judicialAuction)}> <JudicialAuction  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('经营异常', this.state.operateUnusual)}> <OperateUnusual  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('欠税情况', this.state.debtSituation)}> <DebtSituation  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('清算情况', this.state.liquidationSituation)}> <LiquidationSituation  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('股权出质', this.state.equityOut)}> <EquityOut getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                        <TabItem name={this._getItemName('动产抵押', this.state.propertyMortgage)}> <PropertyMortgage  getNum={this.getNum} {...this.props} currentCompanyId={this.state.currentCompanyId}/> </TabItem>
                    </Tabs> 
                }
            </div>
        );
    }
}