import React, { Component } from 'react';
import { HJPromise } from '../../../../../../utils/hjPromise';
import cls from 'classnames';
import './style.scss';

export default class FundManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: '基金管理人',
            managerList: {}, // 管理人数据
            productList: [],  // 产品数据
            productNameList: [], // 产品名称列表
            productInfoList: [],  // 产品信息列表
            activeProductName: '',  // 当前选中的产品名
            activeProductList: [],  // 当前选中的产品信息
            inversionType: '投资企业',
            allMap: [], // 全部企业
            recordedtMap: [], // 已备案企业
            unfiledMap: [] // 未备案企业
        };
    }

    componentDidMount() {
        this.getFundManagerInfo();
        this.getInversionInfo();
    }

    chooseFundType = (item) => {
        this.setState({
            selectType: item
        });
    }

    // 获取基金产品及其对应管理人的信息
    getFundManagerInfo(){
        let { companyId } = this.props;
        HJPromise({
            url: '/api/v1.0/feature/getPrivateFundManagerFeature.do?companyId=' + companyId,
            type: 'post',
            cache: true
        }).then((res) => {
            if (res.statusCode === '0000') {
                this.setState({
                    managerList: res.data.manager,
                    productList: res.data.product
                }, () => {
                    this.disposeProductInfo();
                });
            }
        });
    }

    // 处理产品信息
    disposeProductInfo() {
        let { productList } = this.state;
        if (productList.length > 0) {
            let len = productList.length, productNameList = [], productInfoList = [];
            for (let i = 0; i < len; i++) {
                productNameList.push(productList[i].productName);
                productInfoList.push(productList[i]);
            }
            this.setState({
                productNameList,
                productInfoList, 
                activeProductName: productList[0].productName,
                activeProductList: productList[0]
            });
        }else {
            this.setState({
                productNameList: [],
                productInfoList: [], 
                activeProductName: '',
                activeProductList: []
            });
        }
    }

    checkProductName = (e) => {
        let { productInfoList } = this.state;
        this.setState({
            activeProductName: e
        });
        for (let i = 0; i < productInfoList.length; i++) {
            if (productInfoList[i].productName === e) {
                this.setState({
                    activeProductList: productInfoList[i]
                });
            }
        }
    }

    // 获取基金产品及其对应管理人的信息
    getInversionInfo(){
        let { companyId } = this.props;
        HJPromise({
            url: '/api/v1.0/relation/getRecordCompany.do?qyxxId=' + companyId,
            type: 'post',
            cache: true
        }).then((res) => {
            let dataSource = res.data.content;
            if (res.data.code === 200) {
                this.setState({
                    allMap: dataSource.allMap,
                    recordedtMap: dataSource.recordedtMap,
                    unfiledMap: dataSource.unfiledMap
                });
            }
        });
    }

    // 切换投资人类型
    changeInverstType = (e) => {
        this.setState({
            inversionType: e
        });
    } 

    render() {
        let { selectType, managerList, productNameList, productInfoList, activeProductName, activeProductList, inversionType, allMap,
            recordedtMap, unfiledMap } = this.state;
        let { managerChineseName, managerEnglishName, registerCode, organizationalCode, registerDate, establishmentDate, registerAddress,
            officeAddress, registerCapital, actualCapital, enterprisesType, actualCapitalScale, managerType, businessType, sumEmployeesNumber,
            getManagerNumber, isMember, legalOpinionsStatus, corporationName, isQualification, qualificationMode, corporationIntroduction,
            seniorIntroduction, interimMeasuresBefore, interimMeasuresAfter, lastUpdatedDate, associationTips, managerCreditInfo, enterprisesWebsite,
            enterprisesThirdInvestment, memberRepresentative, memberType, admission_date, lawInstitutionName, lawName } = managerList;
        return (
            <div className="fundManageTableDiv">
                <div className="selectBtnDiv">
                    <span className={selectType === '基金管理人' ? 'active' : ''} onClick={() => this.chooseFundType('基金管理人')}>基金管理人</span>
                    <span className={selectType === '基金产品' ? 'active' : ''} onClick={() => this.chooseFundType('基金产品')}>基金产品</span>
                    <span className={selectType === '管理人投资备案情况' ? 'active' : ''} onClick={() => this.chooseFundType('管理人投资备案情况')}>管理人投资备案情况</span>
                </div>
                {
                    selectType === '基金管理人' ? 
                    <div className="fundManageTableDivContainer">
                        {
                            managerCreditInfo ? 
                            <table className="creditInfoTable">
                                <tbody>
                                    <tr>
                                        <td width="25%">机构诚信信息：</td>
                                        <td width="75%">{managerCreditInfo ? managerCreditInfo : '--'}</td>
                                    </tr>
                                </tbody>
                            </table> : ''   
                        }
                        <table className="fundManageTable">
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>机构信息</td>
                                </tr>
                                <tr>
                                    <td>基金管理人全称（中文）：</td>
                                    <td colSpan="3">{managerChineseName ? managerChineseName : '--'}</td>
                                </tr>
                                <tr>
                                    <td>基金管理人全称（英文）：</td>
                                    <td colSpan="3">{managerEnglishName ? managerEnglishName : '--'}</td>
                                </tr>
                                <tr>
                                    <td>登记编号：</td>
                                    <td colSpan="3">{registerCode ? registerCode : '--'}</td>
                                </tr>
                                <tr>
                                    <td>组织机构代码：</td>
                                    <td colSpan="3">{organizationalCode ? organizationalCode : '--'}</td>
                                </tr>
                                <tr>
                                    <td>登记时间：</td>
                                    <td>{registerDate ? registerDate : '--'}</td>
                                    <td>成立时间：</td>
                                    <td>{establishmentDate ? establishmentDate : '--'}</td>
                                </tr>
                                <tr>
                                    <td>注册地址：</td>
                                    <td colSpan="3">{registerAddress ? registerAddress : '--'}</td>
                                </tr>
                                <tr>
                                    <td>办公地址：</td>
                                    <td colSpan="3">{officeAddress ? officeAddress : '--'}</td>
                                </tr>
                                <tr>
                                    <td>注册资本（万元）（人民币）：</td>
                                    <td>{registerCapital ? registerCapital : '--'}</td>
                                    <td>实缴资本：</td>
                                    <td>{actualCapital ? actualCapital : '--'}</td>
                                </tr>
                                <tr>
                                    <td>企业性质：</td>
                                    <td>{enterprisesType ? enterprisesType : '--'}</td>
                                    <td>实缴资本比例：</td>
                                    <td>{actualCapitalScale ? actualCapitalScale : '--'}</td>
                                </tr>
                                <tr>
                                    <td>机构类型：</td>
                                    <td>{managerType ? managerType : '--'}</td>
                                    <td>业务类型：</td>
                                    <td>{businessType ? businessType : '--'}</td>
                                </tr>
                                <tr>
                                    <td>全职员工人数：</td>
                                    <td>{sumEmployeesNumber ? sumEmployeesNumber : '--'}</td>
                                    <td>取得基金从业人数：</td>
                                    <td>{getManagerNumber ? getManagerNumber : '--'}</td>
                                </tr>
                                <tr>
                                    <td>机构网址：</td>
                                    <td colSpan="3">{enterprisesWebsite ? enterprisesWebsite : '--'}</td>
                                </tr>
                                <tr>
                                    <td>是否为符合提供投资建议的第三方机构：</td>
                                    <td colSpan="3">{enterprisesThirdInvestment ? enterprisesThirdInvestment : '--'}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>会员信息</td>
                                </tr>
                                <tr>
                                    <td>是否为会员：</td>
                                    <td>{isMember ? isMember : '--'}</td>
                                    <td>会员代表：</td>
                                    <td>{memberRepresentative ? memberRepresentative : '--'}</td>
                                </tr>
                                <tr>
                                    <td>当前会员类型：</td>
                                    <td>{memberType ? memberType : '--'}</td>
                                    <td>入会时间：</td>
                                    <td>{admission_date ? admission_date : '--'}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>法律意见书信息</td>
                                </tr>
                                <tr>
                                    <td>法律意见书状态：</td>
                                    <td colSpan="3">{legalOpinionsStatus ? legalOpinionsStatus : '--'}</td>
                                </tr>
                                <tr>
                                    <td>律师事务所名称：</td>
                                    <td colSpan="3">{lawInstitutionName ? lawInstitutionName : '--'}</td>
                                </tr>
                                <tr>
                                    <td>律师姓名：</td>
                                    <td colSpan="3">{lawName ? lawName : '--'}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>高管信息</td>
                                </tr>
                                <tr>
                                    <td>法定代表人/执行事务合伙人（委派代表）姓名：</td>
                                    <td colSpan="3">{corporationName ? corporationName : '--'}</td>
                                </tr>
                                <tr>
                                    <td>是否有基金从业资格：</td>
                                    <td>{isQualification ? isQualification : '--'}</td>
                                    <td>资格获取方式：</td>
                                    <td>{qualificationMode ? qualificationMode : '--'}</td>
                                </tr>
                                <tr>
                                    <td>法定代表人/执行事务合伙人（委派代表）工作履历：</td>
                                    <td colSpan="3">{corporationIntroduction ? corporationIntroduction : '--'}</td>
                                </tr>
                                <tr>
                                    <td>高管情况：</td>
                                    <td colSpan="3">{seniorIntroduction ? seniorIntroduction : '--'}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>产品信息</td>
                                </tr>
                                <tr>
                                    <td>暂行办法实施成立前的基金：</td>
                                    <td colSpan="3">{interimMeasuresBefore ? interimMeasuresBefore : '--'}</td>
                                </tr>
                                <tr>
                                    <td>暂行办法实施成立后的基金：</td>
                                    <td colSpan="3">
                                        <div style={{ 'width': '100%', 'height': '100px', 'overflowY': 'scroll' }}>
                                            <div className="useFunctionFund" style={{ 'minHeight': '100px' }}>
                                                {interimMeasuresAfter ? interimMeasuresAfter : '--'}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="tdTitle"><span className="blueBlock"></span>诚信信息</td>
                                </tr>
                                <tr>
                                    <td>机构信息最后更新时间：</td>
                                    <td colSpan="3">{lastUpdatedDate ? lastUpdatedDate : '--'}</td>
                                </tr>
                                <tr>
                                    <td>特别提示信息：</td>
                                    <td colSpan="3">{associationTips ? associationTips : '--'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    : selectType === '基金产品' ? 
                    <div className="fundProductContainerDiv">
                        <div className="fundProductShowDiv">
                            <div className="fundProductShow">
                                {
                                    productNameList.length > 0 ? productNameList.map((item, index) => {
                                        return(
                                            <div className={cls('productNameItem', activeProductName === item ? 'active' : '')} 
                                                key={index} 
                                                onClick={() => this.checkProductName(item)}>
                                                {item}
                                            </div>   
                                        );
                                    }) : <div className="itemNoData">暂无数据</div>
                                }
                            </div>
                        </div>
                        <div className="fundProductTableDiv">
                            {
                                productNameList.length > 0 ?
                                <table className="fundProductTable">
                                    <tbody>
                                        <tr>
                                            <td>基金名称：</td>
                                            <td>{activeProductList.productName ? activeProductList.productName : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金编号：</td>
                                            <td>{activeProductList.productCode ? activeProductList.productCode  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>成立时间：</td>
                                            <td>{activeProductList.establishmentDate ? activeProductList.establishmentDate  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>备案时间：</td>
                                            <td>{activeProductList.filingDate ? activeProductList.filingDate  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金备案阶段：</td>
                                            <td>{activeProductList.filingStage ? activeProductList.filingStage  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金类型：</td>
                                            <td>{activeProductList.productType ? activeProductList.productType  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>币种：</td>
                                            <td>{activeProductList.currency ? activeProductList.currency  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金管理人名称：</td>
                                            <td>{activeProductList.managerName ? activeProductList.managerName  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>管理类型：</td>
                                            <td>{activeProductList.managementType ? activeProductList.managementType  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>托管人名称：</td>
                                            <td>{activeProductList.custodian ? activeProductList.custodian  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>运作状态：</td>
                                            <td>{activeProductList.operateStatus ? activeProductList.operateStatus  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金信息最后更新时间：</td>
                                            <td>{activeProductList.lastUpdatedDate ? activeProductList.lastUpdatedDate  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>基金协会特别提示（针对基金）：</td>
                                            <td>{activeProductList.associationTips ? activeProductList.associationTips  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="tdTitle"><span className="blueBlock"></span>信息批量情况</td>
                                        </tr>
                                        <tr>
                                            <td>当月月报：</td>
                                            <td>{activeProductList.monthReport ? activeProductList.monthReport  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>季报：</td>
                                            <td>{activeProductList.quarterReport ? activeProductList.quarterReport  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>半年报：</td>
                                            <td>{activeProductList.halfYearReport ? activeProductList.halfYearReport  : '--'}</td>
                                        </tr>
                                        <tr>
                                            <td>年报：</td>
                                            <td>{activeProductList.yearReport ? activeProductList.yearReport  : '--'}</td>
                                        </tr>
                                    </tbody>
                                </table> : <div className="itemNoTableData">暂无数据</div>
                            }   
                        </div>
                    </div> :
                    <div className="manageInversionDiv">
                        <div className="inversionTitle">
                            <span 
                                className={inversionType === '投资企业' ? 'active' : ''} 
                                onClick={() => this.changeInverstType('投资企业')}>
                                投资企业（{allMap.length}）
                            </span>
                            <span 
                                className={inversionType === '已备案' ? 'active' : ''} 
                                onClick={() => this.changeInverstType('已备案')}>
                                已备案（{recordedtMap.length}）
                            </span>
                            <span 
                                className={inversionType === '未备案' ? 'active' : ''} 
                                onClick={() => this.changeInverstType('未备案')}>
                                未备案（{unfiledMap.length}）
                            </span>
                        </div>
                        <table className="inversionQuasition">
                            {
                                inversionType && inversionType === '投资企业' ?
                                <tbody>
                                    {
                                        allMap && allMap.length > 0 ? allMap.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td width="50%">{item.name}</td>
                                                    <td width="50%">{item.status}</td>
                                                </tr>
                                            );
                                        }) : <tr>
                                                <td width="50%">--</td>
                                                <td width="50%">--</td>
                                            </tr>
                                    }
                                </tbody> : inversionType === '已备案' ?
                                <tbody>
                                    {
                                        recordedtMap && recordedtMap.length > 0 ? recordedtMap.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td width="50%">{item.name}</td>
                                                    <td width="50%">{item.status}</td>
                                                </tr>
                                            );
                                        }) : <tr>
                                                <td width="50%">--</td>
                                                <td width="50%">--</td>
                                            </tr>
                                    }
                                </tbody> :
                                <tbody>
                                    {
                                        unfiledMap && unfiledMap.length > 0 ? unfiledMap.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td width="50%">{item.name}</td>
                                                    <td width="50%">{item.status}</td>
                                                </tr>
                                            );
                                        }) : <tr>
                                                <td width="50%">--</td>
                                                <td width="50%">--</td>
                                            </tr>
                                    }
                                </tbody>
                            }
                        </table>
                    </div>
                }
            </div>
        );
    }
}