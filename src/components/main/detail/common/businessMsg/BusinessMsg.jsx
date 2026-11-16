/**
 * Created by ashima on 2017/4/20.
 * Remark 经营信息
 */
import './businessMsg.scss';
import React, { Component } from 'react';
import { Tabs, LoadingBox } from 'mtui/index';
import { HJPromise } from '../../../../../utils/hjPromise';
import IndustrialChange from './industrialChange/IndustrialChange'; // 工商变更
import Record from './record/Record'; // 域名备案
import Recruitment from './recruitment/Recruitment'; // 招聘
import News from '../publicOpinion/news/News'; // 舆情
import AnnualReport from './annualReport/AnnualReport'; // 年报
import RealInvestment from './realInvestment/RealInvestment'; // 真实投资

const TabItem = Tabs.TabItem;
export default class BusinessMsg extends Component {
    constructor(props) {
        super(props);
        this.businessMsg = null;
        this.state = {
            industrialNum: 0,
            recordNum: 0,
            newsNum: 0,
            annualReportNum: 0,
            recruitmentNum: 0,
            tableList: ['工商变更', '域名备案', '招聘', '年报'],
            realInvestmentContent: '', // 真实投资信息
            isLoadingData: true
        };
        this.getNum = this.getNum.bind(this);
    }

    componentDidMount() {
        this.getRealInvestmentInfo();
    }

    getItemName(itemName, itemNum) {
        return (
            <div className="clearfix"><span>{itemName}</span>
                <button className="small-tab-count">{itemNum}</button>
            </div>
        );
    }

    /**
     * tabs回调函数
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeBack(index) {
        this.setState({
            activeIndex: index
        });
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '点击企业信息', // 使用日志
        //     detail: '经营信息--' + _this.state.tableList[index] + '详细记录'// 详情记录
        // });
    }

    getNum(type, num) {
        this.businessMsg && this.setState({
            [type]: num
        });
    }

    // 获取真实投资信息
    getRealInvestmentInfo(){
        let { params } = this.props;
        let { companyId, companyName } = params;
        HJPromise({
            url: `/api/v1.0/relation/getRealInvestment.do?qyxxId=${companyId}&&companyName=${companyName}`,
            type: 'post',
            cache: true
        }).then((res) => {
            if (res.statusCode === '0000') {
                if(res.data.code === 200) {
                    this.setState({
                        realInvestmentContent: res.data.content,
                        isLoadingData: false
                    });
                }
            }
        });
    }

    render() {
        let { activeIndex } = this.props;
        let { realInvestmentContent, isLoadingData } = this.state;
        return (
            <div className="business-msg" ref={c => this.businessMsg = c}>
                {
                    isLoadingData
                    ? <div className="u-loading-box">
                        <LoadingBox info="数据加载中" type="loading2"/>
                    </div> :
                    <Tabs type="top" key={activeIndex} activeIndex={activeIndex} changeBack={this.changeBack.bind(this)}>
                        <TabItem name={this.getItemName('工商变更', this.state.industrialNum)}>
                            <IndustrialChange getNum={this.getNum}  {...this.props}/>
                        </TabItem>
                        <TabItem name={this.getItemName('域名备案', this.state.recordNum)}>
                            <Record getNum={this.getNum} {...this.props}/>
                        </TabItem>
                        <TabItem name={this.getItemName('招聘', this.state.recruitmentNum)}>
                            <Recruitment getNum={this.getNum} {...this.props}/>
                        </TabItem>
                        {/* <TabItem name={this.getItemName('舆情', this.state.newsNum)}> */}
                            {/* <News getNum={this.getNum} {...this.props}/> */}
                        {/* </TabItem> */}
                        <TabItem name={this.getItemName('年报', this.state.annualReportNum)}>
                            <AnnualReport getNum={this.getNum} {...this.props}/>
                        </TabItem>
                        {/* {
                            realInvestmentContent ? <TabItem name="真实投资">
                                                        <RealInvestment realInvestmentContent={realInvestmentContent} />
                                                    </TabItem> : null
                        }                     */}
                    </Tabs>
                }
            </div>
        );
    }
}