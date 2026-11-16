/**
 * Created by ashima&fuzhihong on 2017/4/17.
 * Remark 风险扫描
 */
import './scanning.scss';
import React, { Component } from 'react';
import perfectScrollbar from 'perfect-scrollbar';
import { scanMap } from 'Constants/common';
import emitter from 'Utils/emitter';
import { setScrollTop } from 'Utils/formatter';
import { getLocal, setSession } from 'Utils/storage';
import { HJPromise } from 'Utils/hjPromise';
import { Services } from 'Constants/common';
import { companyDetailAPI } from 'Services/detail';
import Immutable from 'immutable';
import { Modal, Button } from 'antd';
import { CIRCLE, ANALYSIS_DETAIL, STOCK, COUNT } from 'RouterPath';

const { COMPANY_DETAIL_SCAN } = Services;

Array.prototype.removeByValue = function (val) {
    for (let i = this.length; i >= 0; i--) {
        if (this[i] === val) {
            this.splice(i, 1);
            break;
        }
    }
};

export default class Scanning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsName: this.props.tabsName || '--',
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            riskScanList: [],
            riskScanLegend: [],
            listLoading: '数据载入中...',
            qyxxId: '',
            title: '',
            value: '',
            visible: false,
            path: '',
            companyNumTotal: 0,
            companyNumOne: 0,
            companyNumTwo: 0,
            companyNumThree: 0,
            oneDegreeList: [],
            twoDegreeList: [],
            threeDegreeList: [],
            modelIsLoading: false,
            modelLoading: '数据加载中。。。'
        };
        this.setFirstItem = this.setFirstItem.bind(this);
        this.goTo = this.goTo.bind(this);
    }

    /**
     * 设置 企业诉讼文书数量较多 index
     * @param bigIndex
     * @param num
     */
    setFirstItem(bigIndex, num) {
        this.props.changeTab(bigIndex, num);
    }

    componentDidMount() {
        emitter.on('POST_FIRST_ITEM', this.setFirstItem);
        perfectScrollbar.initialize(this.scrollListBox);
        this.scanningData();
    }

    componentDidUpdate() {
        perfectScrollbar.update(this.scrollListBox);
    }

    componentWillUnmount() {
        emitter.removeListener('POST_FIRST_ITEM', this.setFirstItem);
        perfectScrollbar.destroy(this.scrollListBox);
    }

    componentWillReceiveProps(nextProps, props) {
        let isEqualData = Immutable.is(nextProps.tabsName, this.props.tabsName);
        if (!isEqualData) {
            this.setState({ tabsName: nextProps.tabsName }, () => {
                this.scanningData();
            });
        }
    }

    /**
     * 风险扫描
     * @return {[type]} [description]
     */
    scanningData() {
        let { companyId, tabsName } = this.state;
        companyDetailAPI({
            type: COMPANY_DETAIL_SCAN,
            data: {
                companyId
            }
        }).then(({ data }) => {
            let content = data;
            this.setState({
                listLoading: '暂无相关数据！'
            }, () => {
                if (content) {
                    let { riskScan, qyxxId } = content;
                    riskScan = JSON.parse(riskScan || {}); // 雷达图JSON转换
                    if (typeof riskScan === 'string') {
                        riskScan = JSON.parse(riskScan || {}); // 雷达图JSON转换
                    }
                    let riskScanList = [];
                    let riskScanLegend = [];

                    if (tabsName !== '') {
                        riskScan = riskScan['--' || tabsName];
                    }
                    let riskLevel = getLocal('riskLevel');
                    if (riskLevel === '高危预警') {
                        for (let items in riskScan) {
                            if (riskScan.hasOwnProperty(items)) {
                                if (items === '综合实力风险') {
                                    riskScan[items].removeByValue('低学历人员招聘比例较高');
                                }
                                riskScanList.push({
                                    name: items,
                                    items: riskScan[items]
                                });
                            }
                        }
                    } else {
                        for (let items in riskScan) {
                            if (riskScan.hasOwnProperty(items)) {
                                if (items === '综合实力风险') {
                                    riskScan[items].removeByValue('与黑名单企业存在利益一致行动关系');
                                    riskScan[items].removeByValue('注册资本变动较大，资金来源存疑');
                                    riskScan[items].removeByValue('低学历人员招聘比例较高');
                                }
                                if (items === '企业诚信风险') {
                                    riskScan[items].removeByValue('企业存在“非法集资类”类诉讼文书');
                                }

                                riskScanList.push({
                                    name: items,
                                    items: riskScan[items]
                                });
                            }
                        }
                    }
                    this.setState({
                        riskScanList: riskScanList,
                        qyxxId: qyxxId
                    });
                }
            });
        });
    }

    /**
     * 跳转到下方对应信息
     * @param type
     * @param title
     * @param value
     */
    goTo(type, title, value) {
        let { qyxxId } = this.state;
        let { pageScanningType } = this.props; // 获取特殊处理的识别
        let mapData = scanMap[type][value];
        // if (title === '私募基金管理风险' || title === '监管合规性风险' || title === '私募综合实力风险') {
        //     this.props.changeTab(1);
        //     setScrollTop(850);
        //     return; // 如果是私募基金管理风险 没有匹配的也都跳转到企业特征
        // }
        if (mapData && mapData.length > 1) {
            if (mapData[0] === 'relationpage') {
                if(title === '静态关联方风险'){
                    if(value === '关联方中存在黑名单企业' || value === '关联方存在涉“民间借贷”类诉讼企业' || value === '关联方存在失信被执行人企业'
                    || value === '关联方存在受行政处罚企业' || value === '关联方存在经营异常企业' || value === '企业利益一致行动法人较多'
                    || value === '关联企业中存在地址相同企业' || value === '关联方存在吊销企业' || value === '关联方存在包含非法集资类裁判文书的企业') {
                        let type = mapData[1];
                        let companyName = this.props.params.companyName,
                            companyId = this.props.params.companyId;
                        let path;
                        switch (type) {
                            case 'stock': {
                                path = STOCK;
                                break;
                            }
                            case 'circle': {
                                path = CIRCLE;
                                break;
                            }
                            case 'count': {
                                path = COUNT;
                                break;
                            }
                        }
                        this.setState({
                            visible: true,
                            path,
                            title,
                            value
                        }, () => {
                            this.setState({
                                modelIsLoading: true
                            });
                            HJPromise({
                                url: '/api/getScanDetailByTip.do',
                                type: 'post',
                                data: {
                                    bbdQyxxId: qyxxId,
                                    tip: value
                                }
                            }).then((res) => {
                                let { data, message } = res;
                                if (message === '成功') {
                                    let companyNumOne = 0, companyNumTwo = 0, companyNumThree = 0, oneDegreeList = [], twoDegreeList = [], threeDegreeList = [];
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i].degree === 1) {
                                            companyNumOne += 1;
                                            oneDegreeList.push(data[i]);
                                        } else if (data[i].degree === 2) {
                                            companyNumTwo += 1;
                                            twoDegreeList.push(data[i]);
                                        } else if (data[i].degree === 3) {
                                            companyNumThree += 1;
                                            threeDegreeList.push(data[i]);
                                        }
                                    }
                                    this.setState({
                                        companyNumTotal: companyNumOne + companyNumTwo + companyNumThree,
                                        companyNumOne,
                                        companyNumTwo,
                                        companyNumThree,
                                        oneDegreeList,
                                        twoDegreeList,
                                        threeDegreeList,
                                        modelIsLoading: false
                                    });
                                }
                            });
                        });
                        // window.open(`${ANALYSIS_DETAIL}/${path}/${companyName}/${companyId}`);
                    } else {
                        let type = mapData[1];
                        let companyName = this.props.params.companyName,
                            companyId = this.props.params.companyId;
                        let path;
                        switch (type) {
                            case 'stock': {
                                path = STOCK;
                                break;
                            }
                            case 'circle': {
                                path = CIRCLE;
                                break;
                            }
                            case 'count': {
                                path = COUNT;
                                break;
                            }
                        }
                        window.open(`${ANALYSIS_DETAIL}/${path}/${companyName}/${companyId}`);
                    }
                }else{
                    let type = mapData[1];
                    let companyName = this.props.params.companyName,
                        companyId = this.props.params.companyId;
                    let path;
                    switch (type) {
                        case 'stock': {
                            path = STOCK;
                            break;
                        }
                        case 'circle': {
                            path = CIRCLE;
                            break;
                        }
                        case 'count': {
                            path = COUNT;
                            break;
                        }
                    }
                    window.open(`${ANALYSIS_DETAIL}/${path}/${companyName}/${companyId}`);
                }
            } else {
                this.props.changeTab(mapData[0], mapData[1]);
                setScrollTop(850);
            }
        }
        // if (mapData.length > 1) {
        //     if (value === '企业诉讼文书数量较多') {
        //         emitter.emit('GET_FIRST_ITEM', mapData[0]);
        //     } else {
        //         this.props.changeTab(mapData[0], mapData[1]);
        //     }
        // } else {
        //     if (title === '静态关联方风险') {
        //         this.props.changeTab(mapData[0], mapData[1], 'degreesThreeFalg');
        //     } else {
        //         this.props.changeTab(mapData[0]);
        //     }
        // }
        // GetUserLog({
        //     page: '企业页面', // 页面类型
        //     operation: '风险点击记录', // 使用日志
        //     detail: value + '详细记录'// 详情记录
        // });
    }

    handleOk = e => {
        let { path, companyName, companyId } = this.state;
        this.setState({
            visible: false
        });
        window.open(`${ANALYSIS_DETAIL}/${path}/${companyName}/${companyId}`);
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };
    
    render() {
        let { value, visible, companyNumTotal, companyNumOne, companyNumTwo, companyNumThree, oneDegreeList, twoDegreeList, threeDegreeList, modelIsLoading } = this.state;
        return (
            <div className="scanning item mid">
                <div className="header"><em className="iconfont icon-scanning"></em>风险扫描</div>
                <div className="content">
                    <div className="list-box" ref={scrollListBox => this.scrollListBox = scrollListBox}>
                        {
                            !(this.state.riskScanList.length > 0) ? (
                                    <div className="small-box v-center"><span>{this.state.listLoading}</span></div>) :
                                this.state.riskScanList.map((item, index) => {
                                    {
                                        return (

                                            <div className="small-box" key={'list' + index}>
                                                <div><em className="iconfont icon-fengxianicon"></em><span
                                                    className="list-head">{item.name} ({item.items.length})</span></div>
                                                <ul className="small-box_item">
                                                    {
                                                        item.items.map((items, index) => {
                                                            {
                                                                return (
                                                                    <li key={index}
                                                                        onClick={this.goTo.bind(this, this.props.type, item.name, items)}>
                                                                        <span
                                                                            className="left scanning__item-l">{items}</span>
                                                                        {/* <span className="right scanning__item-r">700</span> */}
                                                                    </li>
                                                                );
                                                            }
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        );
                                    }
                                })
                        }
                        {/* * <li key={index} onClick={this.goTo.bind(this, this.props.type, item.name, items)}>{items}</li> * */}
                    </div>
                </div>
                <Modal
                    className="staticRelatedPartyRiskModel"
                    title={value}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="确定"
                    okText="关系图谱查看"
                    >
                        {
                            modelIsLoading ? <div className="small-box v-center"><span>{this.state.modelLoading}</span></div> :
                            <div className="modelMainContent">
                                <p className="mainTitle"><span className="mainNum">{companyNumTotal}</span>家企业涉“{value.replace('关联方', '')}”</p>
                                {
                                    oneDegreeList.length > 0 ?
                                    <div>
                                        <p className="companyTypeTitle">一度关联方 涉“{value.replace('关联方', '')}” <span className="companyTypeNum">{companyNumOne}家</span></p>
                                        <ul className="detailCompanyInfo">
                                            {
                                                oneDegreeList.length > 0 ? oneDegreeList.map((item, index) => {
                                                    return(
                                                        <li key={index}>{item.name}</li>
                                                    );
                                                }) : <li>暂无数据</li>
                                            }
                                        </ul>
                                    </div> : ''
                                }
                                {
                                    twoDegreeList.length > 0 ?
                                    <div>
                                        <p className="companyTypeTitle">二度关联方 涉“{value.replace('关联方', '')}” <span className="companyTypeNum">{companyNumTwo}家</span></p>
                                        <ul className="detailCompanyInfo">
                                            {
                                                twoDegreeList.length > 0 ? twoDegreeList.map((item, index) => {
                                                    return(
                                                        <li key={index}>{item.name}</li>
                                                    );
                                                }) : <li>暂无数据</li>
                                            }
                                        </ul>
                                    </div> : ''
                                }
                                {
                                    threeDegreeList.length > 0 ?
                                    <div>
                                        <p className="companyTypeTitle">三度关联方 涉“{value.replace('关联方', '')}” <span className="companyTypeNum">{companyNumThree}家</span></p>
                                        <ul className="detailCompanyInfo">
                                            {
                                                threeDegreeList.length > 0 ? threeDegreeList.map((item, index) => {
                                                    return(
                                                        <li key={index}>{item.name}</li>
                                                    );
                                                }) : <li>暂无数据</li>
                                            }
                                        </ul>
                                    </div> : ''
                                }
                            </div>
                        }
                </Modal>
            </div>
        );
    }
}