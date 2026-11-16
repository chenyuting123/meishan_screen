/**
 * Created by fuzhihong on 2017/4/18.
 * Remark 交易场所
 */
import './trading.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import Radar from '../common/radar/Radar';
import Line from '../common/line/Line';
import Scanning from '../common/scanning/Scanning';
import BusinessMsg from '../common/businessMsg/BusinessMsg'; // 经营信息
import CompanyTraitForTrading from '../common/companyTraitForTrading/CompanyTraitForTrading'; // 企业特征-交易
import BasicMsg from '../common/basicMsg/BasicMsg'; // 基本信息
import CreditMsg from '../common/creditMsg/CreditMsg'; // 基本信息
import RealityAddrCheck from '../common/realityAddrCheck/RealityAddrCheck'; // 真实办公地址核查
import Remark from '../common/remark/Remark'; // 备注
import RelatedParty from '../common/relatedParty/RelatedParty';// 关联方信息
import PublicOpinion from '../common/publicOpinion/PublicOpinion';
import { HJPromise } from '../../../../utils/hjPromise';

const TabItem = Tabs.TabItem;
export default class Trading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'trading',
            topIndex: 0,
            basicIndex: 0,
            businessIndex: 0,
            creditIndex: 0,
            degreesThreeFalg: false,
            tableList: ['关联方信息', '特征信息', '基本信息', '经营信息', '信用信息', '舆情信息', '地址&投向核查信息', '备注'],
            companyId: this.props.params.companyId,
            flag: false
        };
    }

    componentDidMount () {
        this.getList();
    }

    /**
     * tabs回调函数
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeBack(index){
        let _this = this;
        _this.setState({
            topIndex: index
        });
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '点击企业信息', // 使用日志
        //     detail: _this.state.tableList[index] + '详细记录'// 详情记录
        // });
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
    
    /**
     * 雷达图回调跳转
     * @param top
     * @param down
     */
    changeTab(top, down, degreesThreeFalg){
        let threeFalg = false;
        if(degreesThreeFalg){
            threeFalg = true;
        }
        this.setState({
            // topIndex: top,
            degreesThreeFalg: threeFalg
        });
        if(down || down === 0){
            switch (top){
                case 2:
                    this.setState({
                        basicIndex: down
                    });
                    break;
                case 3:
                    this.setState({
                        businessIndex: down
                    });
                    break;
                case 4:
                    this.setState({
                        creditIndex: down
                    });
                    break;
                default:
                    return;
            }
        }
    }
    render() {
        let { topIndex, basicIndex, businessIndex, creditIndex, degreesThreeFalg, flag } = this.state;
        return (
            <div className="trading test-flag">
                <div className="top clearfix">
                    <Radar {...this.props}/>
                    <Scanning changeTab={this.changeTab.bind(this)} type={this.state.type} {...this.props}/>
                    <Line  {...this.props}/>
                </div>
                <div className="bottom">
                    <Tabs type="top" key={topIndex} activeIndex={topIndex} changeBack={this.changeBack.bind(this)}>
                        <TabItem name="关联方信息" >
                        {
                            topIndex === 0 ? <RelatedParty degreesThreeFalg={degreesThreeFalg} {...this.props}/> : null 
                        }
                        </TabItem>
                        <TabItem name="特征信息" >
                        {
                            topIndex === 1 ? <CompanyTraitForTrading {...this.props}/> : null 
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
                        <TabItem name="备注"> <Remark {...this.props}/> </TabItem>
                    </Tabs>
                </div>
            </div>
        );
    }
}