/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息
 */
import './basicMsg.scss';
import React, { Component } from 'react';
import { Tabs } from 'mtui/index';
import BasicBusinessInfo from './basicBusinessInfo/BasicBusinessInfo'; // 工商资料
import BasicShareholder from './basicShareholder/BasicShareholder'; // 股东
import BasicBoardOfDirectors from './basicBoardOfDirectors/BasicBoardOfDirectors'; // 董事会
import BasicBoardOfSupervisors from './basicBoardOfSupervisors/BasicBoardOfSupervisors'; // 监事会
import BasicExecutive from './basicExecutive/BasicExecutive'; // 高管
import BasicBranchOffice from './basicBaranchOffice/BasicBranchOffice'; // 分支机构
import BasicInvestment from './basicInvestment/BasicInvestment'; // 海外投资机构
import { uuid } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import emitter from 'Utils/emitter';
import { Services } from 'Constants/common';
import { detailBaseDataAPI } from 'Services/detail';

const { DETAIL_BASE_DATA_JBXX } = Services;

const TabItem = Tabs.TabItem;
export default class BasicMsg extends Component {
    constructor(props) {
        super(props);
        this.basicMsg = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            baseInfo: null,
            loading: true,
            basicBusinessInfo: 0,
            basicShareholder: 0,
            basicBoardOfDirectors: 0,
            basicBoardOfSupervisors: 0,
            basicExecutive: 0,
            basicBranchOffice: 0,
            basicInvestment: 0,
            tableList: ['工商资料', '股东', '董事会', '监事会', '高管', '分支机构', '海外投资机构']
        };
        this.getNum = this.getNum.bind(this);
    }

    /**
     * 返回tabItem的格式 样式
     * @param itemName
     * @param itemNum
     * @returns {XML}
     * @private
     */
    _getItemName(itemName, itemNum) {
        return (
            <div key={uuid()} className="clearfix"><span>{itemName}</span>
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
        let _this = this;
        _this.basicMsg && _this.setState({
            activeIndex: index
        });
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '点击企业信息', // 使用日志
        //     detail: '基本信息--' + _this.state.tableList[index] + '详细记录'// 详情记录
        // });
    }

    componentDidMount() {
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_JBXX,
            data: {
                companyId: this.state.companyId
            }
        }).then(({ data }) => {
            let content = data.content;
            if (content) {
                emitter.emit('GET_XZCF_INFO', content.xzcf); // 分发行政处罚的消息 => credit => punishment中接收
                this.basicMsg && this.setState({
                    baseInfo: content,
                    loading: false
                });
            }
        });
    }

    componentWillUnmount() {
        // 避免异步请求调用setState时组件已经被销毁的错误.
        this.setState = () => {};
    }

    /**
     * 获取itemNum 数
     * @param type
     * @param num
     */
    getNum(type, num) {
        this.setState({
            [type]: num
        });
    }

    render() {
        let { activeIndex } = this.props;
        let { baseInfo } = this.state;
        return (
            <div className="basic-msg" ref={c => this.basicMsg = c}>
                {
                    this.state.loading ?
                        <div className="u-loading-box">
                            <LoadingBox info="数据载入中" type="loading2"/>
                        </div> :
                        <Tabs className="small-tab" type="top" key={activeIndex} activeIndex={activeIndex}
                              changeBack={this.changeBack.bind(this)}>
                            <TabItem name={'工商资料'}>
                                <BasicBusinessInfo itemHeight={this.props.itemHeight} info={baseInfo.jbxx}/>
                            </TabItem>
                            <TabItem name={this._getItemName('股东', this.state.basicShareholder)}>
                                <BasicShareholder getNum={this.getNum} info={baseInfo.gdxx}/>
                            </TabItem>
                            <TabItem name={this._getItemName('董事会', this.state.basicBoardOfDirectors)}>
                                <BasicBoardOfDirectors getNum={this.getNum} info={baseInfo.directors}/>
                            </TabItem>
                            <TabItem name={this._getItemName('监事会', this.state.basicBoardOfSupervisors)}>
                                <BasicBoardOfSupervisors getNum={this.getNum} info={baseInfo.supervisors}/>
                            </TabItem>
                            <TabItem name={this._getItemName('高管', this.state.basicExecutive)}>
                                <BasicExecutive getNum={this.getNum} info={baseInfo.executives}/>
                            </TabItem>
                            <TabItem name={this._getItemName('分支机构', this.state.basicBranchOffice)}>
                                <BasicBranchOffice getNum={this.getNum} {...this.props}/>
                            </TabItem>
                            <TabItem name={this._getItemName('海外投资机构', this.state.basicInvestment)}>
                                <BasicInvestment getNum={this.getNum} {...this.props}/>
                            </TabItem>
                        </Tabs>
                }
            </div>
        );
    }
}