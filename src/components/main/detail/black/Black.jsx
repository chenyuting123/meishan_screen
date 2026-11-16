/**
 * Created by fuzhihong on 2017/4/21.
 * Remark 黑名单
 */
import './black.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import Scanning from '../common/scanning/Scanning';// 风险扫描
import CompanyTraitForPrivate from '../common/companyTraitForPrivate/CompanyTraitForPrivate'; // 企业特征-私募
import CompanyTraitForTrading from '../common/companyTraitForTrading/CompanyTraitForTrading'; // 企业特征-交易
import CompanyTraitForNetwork from '../common/companyTraitForNetwork/CompanyTraitForNetwork'; // 企业特征-网络借贷
import Remark from '../common/remark/Remark';// 备注
import BasicMsg from '../common/basicMsg/BasicMsg';// 基本信息
import BusinessMsg from '../common/businessMsg/BusinessMsg';// 经营信息
import CreditMsg from '../common/creditMsg/CreditMsg';// 信用信息
import RelatedParty from '../common/relatedParty/RelatedParty';// 关联方信息
import PublicOpinion from '../common/publicOpinion/PublicOpinion';
import emitter from 'Utils/emitter';
import { isNotBlank } from 'Utils/util';

import { Services } from 'Constants/common';
import { detailFeatureAPI } from 'Services/detail';
const { FEATURE_P2P } = Services;

const TabItem = Tabs.TabItem;

export default class Black extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: true,
            tabsIndex: 0, // tab切换默认值
            basicIndex: 0,
            businessIndex: 0,
            creditIndex: 0,
            addBlackDate: '',
            blackReasons: '',
            degreesThreeFalg: false,
            pageScanningType: 'blackBase', // 跳转识别值
            type: this.props.params.type,
            companyId: this.props.params.companyId || '',
            featureData: [] // 特征信息数据
        };
        this.setBlackDetail = this.setBlackDetail.bind(this);
    }

    componentDidMount (){
        this.getBlackFeature();
    }
    componentWillMount() {
        emitter.on('POST_BLACK_DETAIL', this.setBlackDetail);
        let getType = this.state.type;
        if (getType !== 'trading' && getType !== 'private') {
            this.setState({ pageScanningType: 'blackElse' });
        }
    }

    componentWillUnmount() {
        emitter.removeListener('POST_BLACK_DETAIL', this.setBlackDetail);

    }

    setBlackDetail(date, reasons) {
        this.setState({
            addBlackDate: date,
            blackReasons: reasons
        });
    }

    changeBack(index) {
        let _this = this;
        let tableList = [];
        if (_this.state.type === 'trading' || this.state.type === 'private' || this.state.type === 'network') {
            tableList = ['关联方信息', '特征信息', '基本信息', '经营信息', '信用信息', '舆情信息', '备注'];
        } else {
            tableList = ['关联方信息', '基本信息', '经营信息', '信用信息', '舆情信息', '备注'];
        }
        this.setState({
            topIndex: index
        });
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '点击企业信息', // 使用日志
        //     detail: tableList[index] + '详细记录'// 详情记录
        // });
    }

    /**
     * 风险扫描
     * @param top
     * @param down
     */
    changeTab(top, down, degreesThreeFalg) {
        let threeFalg = false;
        if (degreesThreeFalg) {
            threeFalg = true;
        }
        this.setState({
            // topIndex: top,
            degreesThreeFalg: threeFalg
        });
        let index = 0;
        if (this.state.type !== 'trading' || this.state.type !== 'private') {
            index = 1;
        }
        if (down || down === 0) {
            switch (top) {
                case (2 - index):
                    this.setState({
                        basicIndex: down
                    });
                    break;
                case (3 - index):
                    this.setState({
                        businessIndex: down
                    });
                    break;
                case (4 - index):
                    this.setState({
                        creditIndex: down
                    });
                    break;
                default:
                    return;
            }
        }
    }

    // 黑名单特征信息数据获取
    getBlackFeature = async() => {
        try {
            const { companyId, tabsIndex } = this.state;
            const res = await detailFeatureAPI({
                type: FEATURE_P2P,
                data: {
                    companyId
                }
            });
            let data = res.data;
            if (isNotBlank(res)) {
                this.setState({
                    featureData: data[tabsIndex]
                });
            } else {
                this.setState({
                    featureData: []
                });
            }
        } catch (e) {
            this.setState({
                featureData: []
            });
        }

    }
    render() {
        let { topIndex, basicIndex, businessIndex, creditIndex, degreesThreeFalg, addBlackDate, blackReasons, featureData } = this.state;
        if (!addBlackDate) {
            addBlackDate = '';
        }
        if (!blackReasons) {
            blackReasons = [];
        }
        let pt52 = blackReasons.length === 2;
        let pt40 = blackReasons.length === 3 || blackReasons.length === 4;
        let fs22 = blackReasons.length === 2;
        let fs20 = blackReasons.length === 3 || blackReasons.length === 4;
        let industryType = this.state.type;
        let tabItemInfo = '';
        if (industryType === 'trading') {
            tabItemInfo = <Tabs type="top" activeIndex={this.state.topIndex} changeBack={this.changeBack.bind(this)}>
                <TabItem name="关联方信息">
                    {
                        topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="特征信息">
                    {
                        topIndex === 1 ? <CompanyTraitForTrading  {...this.props} platDataSelect={this.state.platDataSelect}/> : null
                    }
                </TabItem>
                <TabItem name="基本信息">
                    {
                        topIndex === 2 ? <BasicMsg activeIndex={basicIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="经营信息">
                    {
                        topIndex === 3 ? <BusinessMsg activeIndex={businessIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="信用信息">
                    {
                        topIndex === 4 ? <CreditMsg activeIndex={creditIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="舆情信息"> 
                    {
                        topIndex === 5 ? <PublicOpinion {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="备注">
                    {
                        topIndex === 6 ? <Remark {...this.props} tabsName={this.state.tabsName}/> : null
                    }
                </TabItem>
            </Tabs>;
        } else if (industryType === 'private') {
            tabItemInfo = <Tabs type="top" activeIndex={this.state.topIndex} changeBack={this.changeBack.bind(this)}>
                <TabItem name="关联方信息">
                    {
                        topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg}  {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="特征信息">
                    {
                        topIndex === 1 ? <CompanyTraitForPrivate  {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="基本信息">
                    {
                        topIndex === 2 ? <BasicMsg activeIndex={basicIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="经营信息">
                    {
                        topIndex === 3 ? <BusinessMsg activeIndex={businessIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="信用信息">
                    {
                        topIndex === 4 ? <CreditMsg activeIndex={creditIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="舆情信息"> 
                    {
                        topIndex === 5 ? <PublicOpinion {...this.props}/> : null 
                    }
                </TabItem>
                <TabItem name="备注">
                    {
                        topIndex === 6 ? <Remark {...this.props} tabsName={this.state.tabsName}/> : null
                    }
                </TabItem>
            </Tabs>;
        } else if (industryType === 'network') {
            tabItemInfo = <Tabs type="top" activeIndex={this.state.topIndex} changeBack={this.changeBack.bind(this)}>
                <TabItem name="关联方信息">
                    {
                        topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg}  {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="特征信息">
                    {
                        topIndex === 1 ? <CompanyTraitForNetwork  {...this.props} platDataSelect = {this.state.featureData}/> : null
                    }
                </TabItem>
                <TabItem name="基本信息">
                    {
                        topIndex === 2 ? <BasicMsg activeIndex={basicIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="经营信息">
                    {
                        topIndex === 3 ? <BusinessMsg activeIndex={businessIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="信用信息">
                    {
                        topIndex === 4 ? <CreditMsg activeIndex={creditIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="舆情信息"> 
                    {
                        topIndex === 5 ? <PublicOpinion {...this.props}/> : null 
                    }
                </TabItem>
                <TabItem name="备注">
                    {
                        topIndex === 6 ? <Remark {...this.props} tabsName={this.state.tabsName}/> : null
                    }
                </TabItem>
            </Tabs>;
        } else {
            tabItemInfo = <Tabs type="top" activeIndex={this.state.topIndex} changeBack={this.changeBack.bind(this)}>
                <TabItem name="关联方信息">
                    {
                        topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg}  {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="基本信息">
                    {
                        topIndex === 1 ? <BasicMsg activeIndex={basicIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="经营信息">
                    {
                        topIndex === 2 ? <BusinessMsg activeIndex={businessIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="信用信息">
                    {
                        topIndex === 3 ? <CreditMsg activeIndex={creditIndex} {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="舆情信息">
                    {
                        topIndex === 4 ? <PublicOpinion {...this.props}/> : null
                    }
                </TabItem>
                <TabItem name="备注">
                    {
                        topIndex === 5 ? <Remark {...this.props} tabsName={this.state.tabsName}/> : null
                    }
                </TabItem>
            </Tabs>;
        }
        return (
            <div className="black-detail">
                <div className="tabs">
                    <div className="black-msg clearfix">
                        <Scanning changeTab={this.changeTab.bind(this)} pageScanningType={this.state.pageScanningType}
                                  type={this.state.type} {...this.props}/>
                        <div className="black-tips">
                            <span className="black-png"></span>
                            <div className="black-content clearfix">
                                <div className="black-content-v">
                                    <div className="item-box left" style={{ marginRight: '255px' }}>
                                        <div className="item-name font16">
                                            原因
                                            <i className="arrow"></i>
                                        </div>
                                        <div className="item-answer">
                                            {blackReasons.length > 0 ? blackReasons.map((item, index) =>
                                                <p title={item} className="text-ellipsis"
                                                   style={{ width: '200px', display: 'block' }} key={index}> {item} </p>
                                            ) : '--'}
                                        </div>
                                    </div>
                                    <div className="item-box left">
                                        <div className="item-name font16">
                                            发生时间
                                            <i className="arrow"></i>
                                        </div>
                                        <div className="item-answer">
                                            {addBlackDate ? addBlackDate : '--'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        {tabItemInfo}
                    </div>
                </div>
            </div>
        );
    }
}