/**
 * Created by ashima on 2017/4/20.
 * Remark 年报
 */
import './annualReport.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailManageDataAPI } from 'Services/detail';

const { DETAIL_MANAGE_NB } = Services;
export default class AnnualReport extends Component {
    constructor(props) {
        super(props);
        this.annualReport = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...', // 列表加载
            total: 0, // 总量
            listData: {},
            listYear: [],
            activeYear: '',
            thisYearData: {
                qyxxNbCzxx: [], // 出资信息
                qyxxNbZcxx: [], // 资产信息
                qyxxNbDbxx: [], // 担保信息
                qyxxNbBgxx: [], // 股权变更信息
                qyxxNbGzsm: [] // 年报更正声明
            },
            start: 1,
            size: 10
        };
    }

    componentDidMount() {
        this.annualReportList();
    }

    /**
     * 年报数据列表
     * @return {[type]} [description]
     */
    annualReportList() {
        let { companyId, start, size } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_NB,
            data: {
                companyId: companyId,
                page: start,
                pageSize: size
            }
        }).then(({ data }) => {
            let content = data;
            if (content.length !== 0) {
                this.props.getNum('annualReportNum', content.length);
                let items = {};
                let year = [];
                for (let i = 0; i < content.length; i++) {

                    if (content[i].qyxxNbCzxx === null) {
                        content[i].qyxxNbCzxx = [];
                    }
                    if (content[i].qyxxNbZcxx === null) {
                        content[i].qyxxNbZcxx = [];
                    }
                    if (content[i].qyxxNbDbxx === null) {
                        content[i].qyxxNbDbxx = [];
                    }
                    if (content[i].qyxxNbBgxx === null) {
                        content[i].qyxxNbBgxx = [];
                    }
                    if (content[i].qyxxNbGzsm === null) {
                        content[i].qyxxNbGzsm = [];
                    }

                    items[content[i].year] = content[i];
                    year.push(content[i].year);
                }

                this.annualReport && this.setState({
                    listData: items,
                    listYear: year,
                    activeYear: year[0],
                    thisYearData: items[year[0]]
                });
            }
        });
    }

    /**
     * 年份事件
     * @return {[type]} [description]
     */
    yearChange(year) {
        let _this = this;
        _this.setState({
            activeYear: year,
            thisYearData: _this.state.listData[year]
        });
    }

    render() {
        return (
            <div className="annual-report" ref={c => this.annualReport = c}>
                <div className="year-change">
                    {
                        this.state.listYear.map(function (item, index) {
                            {
                                let activeClassName = '';
                                if (this.state.activeYear === item) {
                                    activeClassName = 'active';
                                }
                                return (
                                    <span className={activeClassName} onClick={this.yearChange.bind(this, item)}
                                          key={index}>{item}</span>
                                );
                            }
                        }.bind(this))
                    }
                </div>
                <div className="tab-item">
                    <div className="header">股东及出资信息</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="15%" className="textC">股东</td>
                            <td width="15%">认缴出资（万元）</td>
                            <td width="15%">认缴出资时间</td>
                            <td width="10%">认缴出资方式</td>
                            <td width="15%">实缴出资（万元）</td>
                            <td width="15%">实缴出资时间</td>
                            <td width="15%">实缴出资方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.thisYearData.qyxxNbCzxx.length > 0) ? (<tr>
                                    <td colSpan="7" className="textC">暂无相关数据！</td>
                                </tr>) :
                                this.state.thisYearData.qyxxNbCzxx.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textC"><span className="text-ellipsis"
                                                                            title={fieldAnomaly(item.shareholderName0)}>{fieldAnomaly(item.shareholderName)}</span>
                                                </td>
                                                <td>{fieldAnomaly(item.subscribedCapital)}</td>
                                                <td>{fieldAnomaly(item.subscribedDate)}</td>
                                                <td>{fieldAnomaly(item.subscribedType)}</td>
                                                <td>{fieldAnomaly(item.paidinCapital)}</td>
                                                <td>{fieldAnomaly(item.paidinDate)}</td>
                                                <td>{fieldAnomaly(item.paidinType)}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="tab-item">
                    <div className="header">企业资产状况信息</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="15%" className="pl50">资产负债情况</td>
                            <td width="20%"></td>
                            <td width="17%">收入情况</td>
                            <td width="18%"></td>
                            <td width="10%">纳税情况</td>
                            <td width="20%"></td>
                        </tr>
                        </thead>
                        {
                            this.state.thisYearData.qyxxNbZcxx.map(function (item, index) {
                                {
                                    return (
                                        <tbody key={index}>
                                        <tr>
                                            <td className="pl50">资产总额：</td>
                                            <td>{fieldAnomaly(item.assetsTotal)}</td>
                                            <td>营业总收入：</td>
                                            <td>{fieldAnomaly(item.totalBusinessIncome)}</td>
                                            <td>纳税总额：</td>
                                            <td>{fieldAnomaly(item.taxTotal)}</td>
                                        </tr>
                                        <tr>
                                            <td className="pl50">负债总额：</td>
                                            <td>{fieldAnomaly(item.liabilitiesTotal)} </td>
                                            <td>营业总收入中主营业务收入：</td>
                                            <td>{fieldAnomaly(item.totalBusinessIncome)} </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td className="pl50">所有者权益合计：</td>
                                            <td>{fieldAnomaly(item.equityTotal)} </td>
                                            <td>利润总额：</td>
                                            <td>{fieldAnomaly(item.profitTotal)} </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td className="pl50"></td>
                                            <td></td>
                                            <td>净利润：</td>
                                            <td>{fieldAnomaly(item.profitNet)} </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    );
                                }
                            })
                        }
                    </table>
                </div>

                <div className="tab-item">
                    <div className="header">担保信息</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="12.5%" className="textC">债权人</td>
                            <td width="12.5%">债务人</td>
                            <td width="12.5%">主债权种类</td>
                            <td width="12.5%">主债权数额</td>
                            <td width="12.5%">履行债务的期限</td>
                            <td width="12.5%">保证的期间</td>
                            <td width="12.5%">保证的方式</td>
                            <td width="12.5%">保证担保的范围</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.thisYearData.qyxxNbDbxx.length > 0) ? (<tr>
                                    <td colSpan="8" className="textC">暂无相关数据！</td>
                                </tr>) :
                                this.state.thisYearData.qyxxNbDbxx.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textC">{fieldAnomaly(item.creditor)}</td>
                                                <td>{fieldAnomaly(item.debtor)}</td>
                                                <td>{fieldAnomaly(item.creditorType)}</td>
                                                <td>{fieldAnomaly(item.creditorNum)}</td>
                                                <td>{fieldAnomaly(item.debtDeadline)}</td>
                                                <td>{fieldAnomaly(item.guaranteePeriod)}</td>
                                                <td>{fieldAnomaly(item.guaranteeType)}</td>
                                                <td>{fieldAnomaly(item.guaranteeScope)}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="tab-item">
                    <div className="header">股权变更信息</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="25%" className="textC">股东</td>
                            <td width="25%">变更前股权比例</td>
                            <td width="25%">变更后股权比例</td>
                            <td width="25%">股权变更日期</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.thisYearData.qyxxNbBgxx.length > 0) ? (<tr>
                                    <td colSpan="4" className="textC">暂无相关数据！</td>
                                </tr>) :
                                this.state.thisYearData.qyxxNbBgxx.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textC">{fieldAnomaly(item.shareholderName)}</td>
                                                <td>{fieldAnomaly(item.contentBeforeChange)}</td>
                                                <td>{fieldAnomaly(item.contentAfterChange)}</td>
                                                <td>{fieldAnomaly(item.changeDate)}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                </div>

                <div className="tab-item">
                    <div className="header">年报信息更正说明</div>
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="40%" className="textC">修改事项</td>
                            <td width="40%">修改理由</td>
                            <td width="20%">修改时间</td>

                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.thisYearData.qyxxNbGzsm.length > 0) ? (<tr>
                                    <td colSpan="4" className="textC">暂无相关数据！</td>
                                </tr>) :
                                this.state.thisYearData.qyxxNbGzsm.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textC">{fieldAnomaly(item.gzsmContent)}</td>
                                                <td>{fieldAnomaly(item.gzsmReason)}</td>
                                                <td>{fieldAnomaly(item.gzsmDate)}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }
}