/**
 * Created by ashima on 2017/4/17.
 * Remark 企业特征-交易
 */
import './companyTraitForTrading.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';
import { Tabs } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailFeatureAPI } from 'Services/detail';

const { FEATURE_EXCHANGE } = Services;

const TabItem = Tabs.TabItem;
export default class CompanyTraitForTrading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            tradingList: [], // 交易所 
            activeType: '',
            listLoading: '数据载入中...', // 列表加载
            TypeLoading: '数据载入中...',
            tradingVarietyLegend: [], // 交易产品类型
            tradingVarietyInfos: [], // 基金管理信息
            thisTypeData: [] // 当前交易产品类型详细信息
        };
    }

    componentDidMount() {
        this.companyTraitForList();
    }

    /**
     * 企业特征-交易
     * @return {[type]} [description]
     */
    companyTraitForList() {
        let { companyId } = this.state;
        detailFeatureAPI({
            type: FEATURE_EXCHANGE,
            data: {
                companyId
            }
        }).then(({ data }) => {
            let content = data;
            this.setState({
                listLoading: '暂无相关数据！',
                TypeLoading: '暂无相关数据！',
                tradingList: []
            }, () => {
                if (content !== null) {
                    let { exchangeShort, govDoc, exchangeType, tradingVarietyInfos } = content;
                    let tradingList = [
                        {
                            exchangeShort,
                            govDoc,
                            exchangeType
                        }
                    ];
                    let tradingVarietyInfo = {};
                    let tradingVarietyLegend = [];
                    let tradingTypeName = ''; // 交易品种名称
                    if(tradingVarietyInfos) {
                        for (let i = 0; i < tradingVarietyInfos.length; i++) {
                            tradingTypeName = tradingVarietyInfos[i].tradeType;
                            tradingVarietyLegend.push(tradingTypeName);
                            tradingVarietyInfo[tradingTypeName] = tradingVarietyInfos[i];
                            if (i === 0) {
                                // GetUserLog({
                                //     page: '企业页面', // 页面类型
                                //     operation: '点击企业信息', // 使用日志
                                //     detail: '特征信息--交易品种--' + tradingVarietyInfos[1].tradeType // 详情记录
                                // });
                            }
                        }
                    }

                    this.setState({
                        tradingList: tradingList,
                        activeType: tradingVarietyLegend[0],
                        tradingVarietyLegend: tradingVarietyLegend,
                        tradingVarietyInfos: tradingVarietyInfo,
                        thisTypeData: tradingVarietyLegend.length === 0 ? [] : [tradingVarietyInfos[tradingVarietyLegend[0]]]
                    });
                }
            });

        });
    }

    /**
     * 用户日志
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getUserLog(data) {
        // HJPromise({
        //     url: '/userLog/save.do',
        //     data: {
        //         page: data.page, // 页面类型
        //         operation: data.operation, // 使用日志
        //         detail: data.detail// 详情记录
        //     }
        // }).then((response) => {
        //     // TODO
        // });
    }

    /**
     * 交易类型切换
     * @return {[type]} [description]
     */
    tradingTypeChange(type) {
        let _this = this;
        _this.setState({
            activeType: type,
            thisTypeData: [_this.state.tradingVarietyInfos[type]]
        }, function () {
            // GetUserLog({
            //     page: '企业页面', // 页面类型
            //     operation: '点击企业信息', // 使用日志
            //     detail: '特征信息--交易品种--' + type // 详情记录
            // });
        });
    }

    render() {
        return (
            <div className="company-trait-trading">
                <div className="tab-item">
                    <div className="header">交易所信息</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="30%" className="textL">交易所简称</td>
                            <td width="35%">政府批文</td>
                            <td width="35%">交易所类型</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.tradingList.length > 0) ? (<tr>
                                    <td colSpan="3" className="textC">{this.state.listLoading}</td>
                                </tr>) :
                                this.state.tradingList.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textL">{item.exchangeShort}</td>
                                                <td>{item.govDoc}</td>
                                                <td>{item.exchangeType}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="tab-item">
                    <div className="header">交易品种</div>
                    <div className="legnd">
                        {
                            this.state.tradingVarietyLegend.map(function (item, index) {
                                {
                                    let activeClassName = '';
                                    if (this.state.activeType === item) {
                                        activeClassName = 'active';
                                    }
                                    return (
                                        <span className={activeClassName}
                                              onClick={this.tradingTypeChange.bind(this, item)}
                                              key={index}>{item}</span>
                                    );
                                }
                            }.bind(this))
                        }
                    </div>
                    <div>
                        {
                            !(this.state.thisTypeData.length > 0) ? (
                                    <div className="textC no-data">{this.state.TypeLoading}</div>) :
                                this.state.thisTypeData.map(function (item, index) {
                                    {
                                        if(item) {
                                            return (
                                                <table className="table-theme" key={index}>
                                                    <tbody>
                                                    <tr className="table-th">
                                                        <td className="textL" width="25%">交易单位</td>
                                                        <td width="25%">最少交易量</td>
                                                        <td width="25%">报价单位</td>
                                                        <td width="25%">最小变动价</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="textL">{fieldAnomaly(item.tradeUnit)}</td>
                                                        <td>{fieldAnomaly(item.minTradeNum)}</td>
                                                        <td>{fieldAnomaly(item.offerUnit)}</td>
                                                        <td>{fieldAnomaly(item.minChangePrice)}</td>
                                                    </tr>

                                                    <tr className="table-th">
                                                        <td className="textL">手续费</td>
                                                        <td>每日波动价格限制</td>
                                                        <td>最低保证金</td>
                                                        <td>最大单边交易量</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="textL">{fieldAnomaly(item.handlingCharge)}</td>
                                                        <td>{fieldAnomaly(item.priceChangeLimitDaily)}</td>
                                                        <td>{fieldAnomaly(item.minCashDeposit)}</td>
                                                        <td>{fieldAnomaly(item.maxTradeNum)}</td>
                                                    </tr>

                                                    <tr className="table-th">
                                                        <td className="textL">最大单边持仓量</td>
                                                        <td>交易时间</td>
                                                        <td>最小/大交收量</td>
                                                        <td>交收时间</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="textL">{item.maxInventory}</td>
                                                        <td><span className="text-ellipsis"
                                                                  title={fieldAnomaly(item.tradeDate)}>{fieldAnomaly(item.tradeDate)}</span>
                                                        </td>
                                                        <td>{fieldAnomaly(item.minDeliveryNum)}/{fieldAnomaly(item.maxDeliveryNum)}</td>
                                                        <td>{fieldAnomaly(item.deliveryDate)}</td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            );
                                        }
                                    }
                                }.bind(this))
                        }
                    </div>
                </div>
            </div>
        );
    }
}