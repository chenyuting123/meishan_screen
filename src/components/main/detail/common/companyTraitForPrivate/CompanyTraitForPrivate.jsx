/**
 * Created by ashima on 2017/4/17.
 * Remark 企业特征-私募
 */
import './companyTraitForPrivate.scss';
import React, { Component } from 'react';
import { Services } from 'Constants/common';
import { detailFeatureAPI, detailBaseDataAPI } from 'Services/detail';
import FundManager from './fundManager';
import FundProduct from './fundProduct';
import { LoadingBox } from 'mtui/index';

const { FEATURE_PRIVATE_FUND, DETAIL_BASE_DATA_OVERVIEW } = Services;

export default class CompanyTraitForPrivate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            executiveInfoList: [], // 高管信息 
            manageInfoList: [], // 基金管理信息
            executiveLoading: '数据载入中...', // 列表加载
            manageLoading: '数据载入中...', // 列表加载
            isFundManager: false,
            fundType: '私募基金',
            isLoadingData: true
        };
    }

    componentDidMount() {
        this.companyTraitForPrivateList();
        this.getBaseDataOverview();
    }

    /**
     * 获取基本信息
     * @return {[type]} [description]
     */
    getBaseDataOverview() {
        let { companyId } = this.state;
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_OVERVIEW,
            data: {
                companyId
            }
        }).then((res) => {
            if (res.data.content.industry === '私募基金/基金管理人') {
                this.setState({
                    isLoadingData: false,
                    fundType: '私募基金/基金管理人'
                });
            } else if (res.data.content.industry === '私募基金/基金产品') {
                this.setState({
                    isLoadingData: false,
                    fundType: '私募基金/基金产品'
                });
            } else if (res.data.content.industry === '私募基金') {
                this.setState({
                    isLoadingData: false,
                    fundType: '私募基金'
                });
            }
        });
    }

    /**
     * 企业特征-私募
     * @return {[type]} [description]
     */
    companyTraitForPrivateList() {
        let { companyId } = this.state;

        detailFeatureAPI({
            type: FEATURE_PRIVATE_FUND,
            data: {
                companyId
            }
        }).then(({ data }) => {
            if (data) {
                this.setState({
                    executiveInfoList: data.executiveInfoList,
                    manageInfoList: data.manageInfoList,
                    executiveLoading: '暂无相关数据！',
                    manageLoading: '暂无相关数据！'
                });
            } else {
                this.setState({
                    executiveInfoList: [],
                    manageInfoList: []
                });
            }
        });
    }

    componentWillUnmount = () => {
        // 避免异步请求调用setState时组件已经被销毁的错误.
        this.setState = () => {};
    }

    render() {
        var { executiveInfoList, executiveLoading, manageLoading, manageInfoList, isFundManager, fundType, isLoadingData, companyId } = this.state;

        return (
            <div className="company-trait-private">
                {
                    isLoadingData
                    ? <div className="u-loading-box">
                        <LoadingBox info="数据加载中" type="loading2"/>
                    </div> :
                    <div>
                        {
                            fundType === '私募基金' ? 
                            <div>
                                <div className="tab-item">
                                    <div className="header">高管信息</div>
                                    <table className="table-theme">
                                        <thead>
                                        <tr>
                                            <td width="10%" className="textC">高管姓名</td>
                                            <td width="50%" className="padding-l150">职务</td>
                                            <td width="40%">是否具有基金从业资格</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !(executiveInfoList.length > 0) ? (<tr><td colSpan="3" className="textC">{executiveLoading}</td></tr>) :
                                                executiveInfoList.map(function (item, index) {
                                                    {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="textC">{item.name}</td>
                                                                <td className="padding-l150">{item.job}</td>
                                                                <td>{item.occupationalRequirements}</td>
                                                            </tr>
                                                        );
                                                    }
                                                })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-item">
                                    <div className="header">基金信息管理</div>
                                    <table className="table-theme">
                                        <thead>
                                        <tr>
                                            <td width="10%" className="textC">基金编号</td>
                                            <td width="20%">基金名称</td>
                                            <td width="15%">基金类型</td>
                                            <td width="20%">托管人名称</td>
                                            <td width="10%">管理类型</td>
                                            <td width="10%">运作状态</td>
                                            <td width="15%">基金备案阶段</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !(manageInfoList.length > 0) ? (<tr><td colSpan="7" className="textC">{manageLoading}</td></tr>) :
                                                manageInfoList.map(function (item, index) {
                                                    {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="textC">{item.fundNumber ? item.fundNumber : '--'}</td>
                                                                <td>{item.fundName ? item.fundName : '--'}</td>
                                                                <td>{item.fundType ? item.fundType : '--'}</td>
                                                                <td><span className="text-ellipsis" title={item.custodian}>{item.custodian ? item.custodian : '--'}</span></td>
                                                                <td>{item.managementType ? item.managementType : '--'}</td>
                                                                <td>{item.operationalStatus ? item.operationalStatus : '--'}</td>
                                                                <td>{item.fundFilingStage ? item.fundFilingStage : '--'}</td>
                                                            </tr>
                                                        );
                                                    }
                                                })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div> : 
                            fundType === '私募基金/基金管理人' ? <FundManager companyId={companyId} /> :  
                            fundType === '私募基金/基金产品' ? <FundProduct companyId={companyId} /> : null
                        }
                    </div>
                }
            </div>
        );
    }
}