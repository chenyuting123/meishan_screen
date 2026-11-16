/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息-工商资料
 */

import './basicBusinessInfo.scss';
import React, { Component } from 'react';
import { fieldAnomaly } from 'Utils/formatter';

export default class BasicBusinessInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { info } = this.props;
        return (
            <div className="basic-business-info" >
                <div className="tab-item">
                    <table className="table-theme textL td-pl20">
                        <tbody>
                        <tr>
                            <td style={{ width: '20%' }}>
                                <span className="text-ellipsis" style={{ width: '350px', cursor: 'default' }} title={fieldAnomaly(info.companyName)}>公司名称 : {fieldAnomaly(info.companyName)}</span>
                            </td>
                            <td style={{ width: '20%' }}>登记状态 : {fieldAnomaly(info.companyEnterpriseStatus)}</td>
                            <td style={{ width: '20%' }}>公司类型 : {fieldAnomaly(info.companyType)}</td>
                            <td style={{ width: '20%' }}>法定代表人 : {fieldAnomaly(info.frname)}</td>
                        </tr>
                        <tr>
                            <td>统一社会信用代码 : {fieldAnomaly(info.creditCode)}</td>
                            <td>组织机构代码 : {fieldAnomaly(info.jgdm)}</td>
                            <td>注册号 : {fieldAnomaly(info.regno)}</td>
                            <td>营业期限 : {info.openfrom} - {info.opento ? info.opento : '至今'}</td>
                        </tr>
                        <tr>
                            <td>成立日期 : {fieldAnomaly(info.esdate)}</td>
                            <td>核准日期 : {fieldAnomaly(info.approvalDate)}</td>
                            <td>注册资本 : {fieldAnomaly(info.regcap)}</td>
                            <td>实缴资本 : {fieldAnomaly(info.paidContribution)}</td>
                        </tr>
                        <tr>
                            <td  colSpan={2}><span className="text-ellipsis" style={{ width: '600px', cursor: 'default' }} title={info.regorg}>登记机关 : {fieldAnomaly(info.regorg)}</span></td>
                            <td  colSpan={2}><span className="text-ellipsis" style={{ width: '600px',  cursor: 'default' }} title={info.address}>企业地址 : {fieldAnomaly(info.address)}</span></td>
                        </tr>
                        <tr>
                            <td  colSpan={4}><span style={{ width: '1200px' }}>经营范围 : {info.operateScope || '--'}</span></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}