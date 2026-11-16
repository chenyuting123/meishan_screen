/**
 * Created by heji on 2017/4/20.
 * Remark 企业特征-网络借贷正常平台
 */
import './companyTraitForNetwork.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';
import { LoadingBox } from 'mtui/index';
import { isNotBlank, isEmpty } from 'Utils/util';

export default class CompanyTraitForNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [] // 公司基本信息
        };
    }

    render() {
        let { platDataSelect } = this.props;
        let data = platDataSelect;
        let { loadingStatus } = this.props;
        return <div className="company-trait-network">
            <div>
                <p className="com_title">经营数据</p>
                {
                    loadingStatus ?
                        <div className="u-loading-box">
                            <LoadingBox info="数据加载中" type="loading2"/>
                        </div>
                        :
                        isEmpty(data) ? <p style={{ fontSize: '16px', color: '#666', textAlign: 'center', padding: '15px 0' }}>暂无数据！</p>
                        :
                        <table className="table-theme">

                            <tbody>
                            <tr>
                                <td className="color-black pl30 pl30" width="15%">上线时间</td>
                                <td width="15%">{fieldAnomaly(data.onlinetime)}</td>
                                <td className="color-black pl30 pl30" width="15%">平均参考收益率</td>
                                <td width="20%">{fieldAnomaly(data.avgReturn)}</td>
                                <td className="color-black pl30 pl30" width="15%">总成交额（万）</td>
                                <td width="20%">{fieldAnomaly(data.totalTurnover)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30 pl30">银行存管</td>
                                <td>{fieldAnomaly(data.bankCustody)}</td>
                                <td className="color-black pl30 pl30">参考投资期限</td>
                                <td>{fieldAnomaly(data.investTerm)}</td>
                                <td className="color-black pl30 pl30">平均借款期限（天）</td>
                                <td>{fieldAnomaly(data.avgLendTime)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">自动投标</td>
                                <td>{fieldAnomaly(data.automaticBidding)}</td>
                                <td className="color-black pl30">成交量（万元）</td>
                                <td>{fieldAnomaly(data.dealVolume)}</td>
                                <td className="color-black pl30">平均满标时间（小时）</td>
                                <td>{fieldAnomaly(data.avgSoldoutTime)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">债权转让</td>
                                <td>{fieldAnomaly(data.claimTransfer)}</td>
                                <td className="color-black pl30">投资人数（人）</td>
                                <td>{fieldAnomaly(data.numOfLender)}</td>
                                <td className="color-black pl30">人均借款金额（万）</td>
                                <td>{fieldAnomaly(data.perBorrowingAmount)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">投标保障</td>
                                <td>{fieldAnomaly(data.bidGuarantee)}</td>
                                <td className="color-black pl30">借款人数（人）</td>
                                <td>{fieldAnomaly(data.numOfBorrower)}</td>
                                <td className="color-black pl30">人均投资金额（万）</td>
                                <td>{fieldAnomaly(data.perLendingAmount)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">保障模式</td>
                                <td>{fieldAnomaly(data.guaranteeMode)}</td>
                                <td className="color-black pl30">日资金净流入（万元）</td>
                                <td>{fieldAnomaly(data.lastFundNetInflow)}</td>
                                <td className="color-black pl30">人均借款次数（次）</td>
                                <td>{fieldAnomaly(data.perBorrowingNum)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">风险准备金存管</td>
                                <td>{fieldAnomaly(data.riskReserve)}</td>
                                <td className="color-black pl30">日待还余额（万元）</td>
                                <td>{fieldAnomaly(data.lastDailyPending)}</td>
                                <td className="color-black pl30">人均投资次数（次）</td>
                                <td>{fieldAnomaly(data.perLendingNum)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">融资记录</td>
                                <td colSpan="5">{fieldAnomaly(data.financingRecord)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">监管协会</td>
                                <td colSpan="5">{fieldAnomaly(data.superviseAssociation)}</td>
                            </tr>
                            <tr>
                                <td className="color-black pl30">担保机构</td>
                                <td colSpan="5">{fieldAnomaly(data.guaranteeInstitution)}</td>
                            </tr>
                            </tbody>
                        </table>
                }
            </div>
        </div>;
    }
}
