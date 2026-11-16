/**
 * Created by fuzhihong on 2017/4/18.
 * Remark 网络借贷正常平台
 */
import './network.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import emitter from 'Utils/emitter';
import Remark from '../common/remark/Remark';// 备注
import Radar from '../common/radar/Radar';// 易燃指数雷达图
import Line from '../common/line/Line';// 易燃指数时序图
import Scanning from '../common/scanning/Scanning';// 风险扫描
import CompanyTraitForNetwork from '../common/companyTraitForNetwork/CompanyTraitForNetwork'; // 企业特征-交易
import BasicMsg from '../common/basicMsg/BasicMsg';// 基本信息
import BusinessMsg from '../common/businessMsg/BusinessMsg';// 经营信息
import CreditMsg from '../common/creditMsg/CreditMsg';// 信用信息
import RelatedParty from '../common/relatedParty/RelatedParty';// 关联方信息
import PoItemPanel from '../common/publicOpinion/poItemPanel/PoItemPanel'; // 占位用
import RealityAddrCheck from '../common/realityAddrCheck/RealityAddrCheck'; // 地址&投向核查信息
import PublicOpinion from '../common/publicOpinion/PublicOpinion';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailFeatureAPI } from 'Services/detail';
import { isNotBlank } from 'Utils/util';
import { HJPromise } from '../../../../utils/hjPromise';

const { FEATURE_P2P } = Services;
const TabItem = Tabs.TabItem;
export default class Emerging extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsIndex: 0, // tab切换默认下标
            tabsName: '', // tab切换默认值
            platData: [], // 平台数据
            platDataSelect: null, // 选中的平台数据
            platName: [], // 平台数名称
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            problem: true, // 是否问题平台
            problemFlag: false, // 一开始什么都不加载
            type: 'network',
            serious: true, // 是否严重问题平台，false需要显示雷达图这些
            topIndex: 0,
            basicIndex: 0,
            businessIndex: 0,
            creditIndex: 0,
            degreesThreeFalg: false,
            loadingStatus: true,
            flag: false
        };
        this.getTabsData = this.getTabsData.bind(this);
    }

    componentDidMount() {
        this.getTabsData();
        this.getList();
    }

    /**
     * tabs回调函数
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeBack(index) {
        let _this = this;
        _this.setState({
            topIndex: index
        }, () => {
            this.getTabsData();
        });
        // let tableList = _this.state.problemFlag ? 
        //                 _this.state.problem ? ['关联方信息', '基本信息', '经营信息', '信用信息', '舆情信息', '备注']
        //                 : ['关联方信息', '特征信息', '基本信息', '经营信息', '信用信息', '舆情信息', '备注'] : [];
        let tableList = _this.state.problemFlag ? ['关联方信息', '特征信息', '基本信息', '经营信息', '信用信息', '舆情信息', '地址&投向核查信息', '备注'] : [];
        if (tableList.length !== 0) {

            // GetUserLog({
            //     page: '企业页面', // 页面类型
            //     operation: '点击企业信息', // 使用日志
            //     detail: tableList[index] + '详细记录'// 详情记录
            // });
        }
    }

    /**
     * 查询平台
     * @return {[type]} [description]
     */
    getTabsData() {
        let { companyId, tabsIndex, problem } = this.state;
        this.setState({ loadingStatus: true });
        detailFeatureAPI({
            type: FEATURE_P2P,
            data: {
                companyId
            }
        }).then(({ data }) => {
            let content = data;
            if (content) {
                let platName = [];
                let len = content.length;
                for (let i = 0; i < len; i++) {
                    platName.push({ name: content[i].platformName, serious: content[i].serious });
                }
                if(content.length){
                    this.setState({
                        tabsName: content[0].platformName,
                        platName: platName,
                        platData: content,
                        platDataSelect: content[tabsIndex],
                        problemFlag: true,
                        problem: content[tabsIndex]['problem'],
                        serious: content[0].serious, // 是否严重问题平台，如果为false也是需要显示雷达图，风险扫描的
                        loadingStatus: false
                    }, () => {
                        emitter.emit('PROBLEM_PLATFORM', problem, len);
                    });
                } else{
                    this.setState({
                        problemFlag: true,
                        problem: false,
                        loadingStatus: false
                    });

                }

            }
        });
    }
    /**
     * tab切换 重置选中的index
     * @param  {[type]} index [description]
     * @param  {[type]} ele   [description]
     * @return {[type]}       [description]
     */
    chooseOne(index, ele, serious) {
        let _this = this;
        this.setState({
            tabsIndex: index,
            tabsName: ele,
            platDataSelect: this.state.platData[index],
            problem: this.state.platData[index]['problem'],
            problemFlag: true,
            serious: serious
        }, function () {
            if (_this.state.problem) {
                emitter.emit('PROBLEM_PLATFORM', true);  // 判断是或否为问题平台
            } else {
                emitter.emit('PROBLEM_PLATFORM', false);  // 判断是或否为问题平台
            }
        });
    }

    /**
     * 风险扫描跳转针对【正常平台】
     * @param top
     * @param down
     */
    changeTab(top, down, degreesThreeFalg) {
        let threeFalg = false;
        if (degreesThreeFalg) {
            threeFalg = true;
        }
        this.setState({
            // topIndex: 0,
            degreesThreeFalg: threeFalg
        });
        let index = 0;
        if (this.state.problem && this.state.problemFlag) {
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

    /**
     * 真实办公地址核查
     * @return {[type]} [description]
     */
    getList() {
        let { companyId } = this.state;
        HJPromise({
            url: '/api/v1.0/companyDetail/checkActualOfficeAddress',
            data: {
                bbdId: companyId
            }
        }).then((res) => {
            let { statusCode, data } = res;
            if (statusCode === '0000') {
                let { code, content } = data;
                if (code === 200) {
                    let { flag } = content;
                    this.setState({
                        flag
                    });
                }
            }
        });
    }

    render() {
        let { topIndex, basicIndex, businessIndex, creditIndex, degreesThreeFalg, noData, flag } = this.state;
        return (
            <div className="network test-flag">
                <div className="center-info">
                    <div className="network-tabs">
                        {
                            this.state.platName.map((ele, index) => {
                                let itemName = index === this.state.tabsIndex ? 'font16 color-gray active' : 'font16 color-gray';
                                return <a key={index} className={itemName} href="javascript:;"
                                          onClick={this.chooseOne.bind(this, index, ele.name, ele.serious)}>
                                    {ele.name}
                                </a>;
                            })
                        }
                    </div>
                    {
                        this.state.problemFlag ?
                            this.state.problem ?
                                this.state.serious ?
                                    <div className="problem-msg problem-serious">
                                        {/** 如果是问题平台并且是严重问题平台 需要显示风险扫描并且原因以及发生日期**/}
                                        <Scanning type={this.state.type}
                                                  networkFlag="serious"
                                                  changeTab={this.changeTab.bind(this)}
                                                  {...this.props}
                                                  tabsName={this.state.tabsName}/>
                                        <div className="problem-tips">
                                            <span className="problem-png"></span>
                                            <div className="problem-content">
                                                <div className="problem-content-v">
                                                    <div className="item-box left" style={{ marginRight: '255px' }}>
                                                        <div className="item-name font16">
                                                            <i className="arrow"></i>
                                                        </div>
                                                        <div className="item-answer">
                                                            {this.state.platDataSelect ? this.state.platDataSelect.problemReason ? this.state.platDataSelect.problemReason : '- -' : '- -'}
                                                        </div>
                                                    </div>
                                                    <div className="item-box left">
                                                        <div className="item-name font16">
                                                            发生日期
                                                            <i className="arrow"></i>
                                                        </div>
                                                        <div className="item-answer">
                                                            {this.state.platDataSelect ? this.state.platDataSelect.problemTime ? this.state.platDataSelect.problemTime : '- -' : '- -'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> :
                                    <div>
                                        {/** 如果是仅仅是问题平台；显示原因以及发生日期以及雷达图，风险扫描。风险时序图**/}
                                        <div className="problem-tips problem-problem">
                                            <span className="problem-png"></span>
                                            <div className="problem-content">
                                                <div className="item-box left" style={{ marginRight: '255px' }}>
                                                    <div className="item-name font16">
                                                        原因
                                                        <i className="arrow"></i>
                                                    </div>
                                                    <div className="item-answer">
                                                        {this.state.platDataSelect ? this.state.platDataSelect.problemReason ? this.state.platDataSelect.problemReason : '- -' : '- -'}
                                                    </div>
                                                </div>
                                                <div className="item-box left">
                                                    <div className="item-name font16">
                                                        发生日期
                                                        <i className="arrow"></i>
                                                    </div>
                                                    <div className="item-answer">
                                                        {this.state.platDataSelect ? this.state.platDataSelect.problemTime ? this.state.platDataSelect.problemTime : '- -' : '- -'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tabs-content ">
                                            <Radar {...this.props} tabsName={this.state.tabsName}/>
                                            <Scanning type={this.state.type}
                                                      networkFlag="problem"
                                                      changeTab={this.changeTab.bind(this)}
                                                      {...this.props}
                                                      tabsName={this.state.tabsName}/>
                                            <Line {...this.props} tabsName={this.state.tabsName}/>
                                        </div>
                                    </div>
                                :
                                <div className="tabs-content problem-base">{/** 网络借贷正常平台**/}
                                    <Radar {...this.props} tabsName={this.state.tabsName}/>
                                    <Scanning
                                        type={this.state.type}
                                        networkFlag="normal"
                                        changeTab={this.changeTab.bind(this)}
                                        {...this.props}
                                        tabsName={this.state.tabsName}/>
                                    <Line {...this.props} tabsName={this.state.tabsName}/>
                                </div> :
                            <div className="clearfix mb15">
                                <PoItemPanel itemName="风险指数雷达图" positionRelative={true} itemSize="col-1-3"
                                             margin="col-1-描" positionRelative={true} itemSize="col-1-3"
                                             margin="col-1-3-m3-margin"><LoadingBox type="loading2"/></PoItemPanel>
                                <PoItemPanel itemName="风险扫描"><LoadingBox type="loading2"/></PoItemPanel>
                                <PoItemPanel itemName="风险指数时序图" positionRelative={true} itemSize="col-1-3"><LoadingBox
                                    type="loading2"/></PoItemPanel>
                            </div>
                    }
                </div>
                <div className="tab-bottom">
                    <Tabs type="top" key={topIndex} activeIndex={topIndex} changeBack={this.changeBack.bind(this)}>
                        <TabItem name="关联方信息">
                            {
                                topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg} {...this.props}/> : null
                            }
                        </TabItem>
                        <TabItem name="特征信息">
                            {
                                topIndex === 1 ? <CompanyTraitForNetwork {...this.props}
                                loadingStatus={this.state.loadingStatus}
                                platDataSelect={this.state.platDataSelect}/> : null
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
                        {
                            flag ?
                            <TabItem name="地址&投向核查信息"> <RealityAddrCheck {...this.props}/> </TabItem> : ''
                        }
                        <TabItem name="备注"><Remark {...this.props} tabsName={this.state.tabsName}/></TabItem>
                    </Tabs>
                </div>
            </div>
        );
    }
}