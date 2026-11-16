/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 基本信息-股东
 */

import './basicShareholder.scss';
import React, { Component } from 'react';
import { uuid } from 'Utils/util';
import { fieldAnomaly } from 'Utils/formatter';

export default class BasicShareholder extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.props.getNum('basicShareholder', this.props.info.length); // 获取信息条数
    }
    render() {
        const { info } = this.props;
        return (
            <div className="basic-shareholder">
                <div className="tab-item">
                    <table className="table-theme textC">
                        <thead>
                        <tr>
                            <td width="20%" className="textC pl50">股东</td>
                            <td width="20%">股东类型</td>
                            <td width="10%">出资比例</td>
                            <td width="12.5%" >出资额</td>
                            <td width="12.5%">出资方式</td>
                            <td width="12.5%">认缴出资额</td>
                            <td width="12.5%">实缴出资额</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            info.length ?
                                info.map( holder =>
                                    <tr key={uuid()}>
                                        <td width="20%" className="textC pl50">
                                            <span className="text-ellipsis subject"  
                                                style={{ width: '250px' }}
                                                title={fieldAnomaly(holder.shareholderName)} >{fieldAnomaly(holder.shareholderName)}</span>
                                        </td>
                                        <td width="20%">{fieldAnomaly(holder.shareholderType)}</td>
                                        <td width="10%">{fieldAnomaly(holder.investRatio)}</td>
                                        <td width="12.5%">{fieldAnomaly(holder.investAmount)}</td>
                                        <td width="12.5%">{fieldAnomaly(holder.investName)}</td>
                                        <td width="12.5%">{fieldAnomaly(holder.subscribedCapital)}</td>
                                        <td width="12.5%">{fieldAnomaly(holder.paidContribution)}</td>
                                    </tr>
                                ) : <tr><td colSpan={7} className="textC">暂无相关数据！</td></tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}