/**
 * Created by fuzhihong on 2017/4/18.
 * Remark 其他 非新金融
 */
import './other.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import BusinessMsg from '../common/businessMsg/BusinessMsg'; // 经营信息
import RelatedParty from '../common/relatedParty/RelatedParty'; // 关联方
import BasicMsg from '../common/basicMsg/BasicMsg'; // 基本信息
import CreditMsg from '../common/creditMsg/CreditMsg'; // 基本信息
import RealityAddrCheck from '../common/realityAddrCheck/RealityAddrCheck'; // 真实办公地址核查
import Remark from '../common/remark/Remark'; // 备注
import PublicOpinion from '../common/publicOpinion/PublicOpinion';
import { HJPromise } from '../../../../utils/hjPromise';

const TabItem = Tabs.TabItem;
export default class Private extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: this.props.params.companyId,
            tableList: [ '关联方信息', '基本信息', '经营信息', '信用信息', '舆情信息', '地址&投向核查信息', '备注'],
            flag: false,
            topIndex: 0
        };
    }

    componentDidMount () {
        this.getList();
    }
    
    /**
     * tabs回调函数
     * @param  {[type]} index [tab下标]
     * @return {[type]}       [description]
     */
    changeBack(index){
        let _this = this;
        this.setState({
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

    render() {
        let { flag, topIndex } = this.state;
        return (
            <div className="other">
                <div className="bottom">
                    <Tabs type="top" activeIndex={topIndex} changeBack={this.changeBack.bind(this)}>
                        <TabItem name="关联方信息" > 
                        {
                            topIndex === 0 ? <RelatedParty {...this.props}/> : null
                        } 
                        </TabItem>
                        <TabItem name="基本信息"> 
                        {
                            topIndex === 1 ? <BasicMsg {...this.props}/> : null 
                        } 
                        </TabItem>
                        <TabItem name="经营信息"> 
                        {
                            topIndex === 2 ? <BusinessMsg {...this.props}/> : null
                        } 
                        </TabItem>
                        <TabItem name="信用信息"> 
                        {
                            topIndex === 3 ? <CreditMsg {...this.props}/> : null
                        } 
                        </TabItem>
                        <TabItem name="舆情信息"> 
                        {
                            topIndex === 4 ? <PublicOpinion {...this.props}/> : null
                        } 
                        </TabItem>
                        {
                            flag ?
                            <TabItem name="地址&投向核查信息"> <RealityAddrCheck {...this.props}/> </TabItem> : ''
                        }
                        <TabItem name="备注">
                            <Remark {...this.props}/>
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        );
    }
}