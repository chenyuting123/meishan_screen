import React, { Component } from 'react';
import { HJPromise } from '../../../../../../utils/hjPromise';
import './style.scss';

export default class FundProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: '基金产品',
            managerList: {}, // 管理人数据
            productList: {}  // 产品数据
        };
    }

    componentDidMount() {
        this.getFundProductInfo();
    }

    chooseFundType = (item) => {
        this.setState({
            selectType: item
        });
    }

    // 获取基金产品及其对应管理人的信息
    getFundProductInfo(){
        let { companyId } = this.props;
        HJPromise({
            url: '/api/v1.0/feature/getPrivateFundProductFeature.do?companyId=' + companyId,
            type: 'post',
            cache: true
        }).then((res) => {
            if (res.statusCode === '0000') {
                this.setState({
                    managerList: res.data.manager,
                    productList: res.data.product
                });
            }
        });
    }

    render() {
        let { selectType, managerList, productList } = this.state;
        let { managerChineseName, managerEnglishName, registerCode, organizationalCode, registerDate, establishmentDate, registerAddress,
            officeAddress, registerCapital, actualCapital, enterprisesType, actualCapitalScale, managerType, businessType, sumEmployeesNumber,
            getManagerNumber, isMember, legalOpinionsStatus, corporationName, isQualification, qualificationMode, corporationIntroduction,
            seniorIntroduction, interimMeasuresBefore, interimMeasuresAfter, lastUpdatedDate, associationTips, managerCreditInfo, enterprisesWebsite,
            enterprisesThirdInvestment, memberRepresentative, memberType, admission_date, lawInstitutionName, lawName } = managerList;
        return (
            <div className="fundProductTableDiv">
                <div className="selectBtnDiv">
                    <span className={selectType === '基金产品' ? 'active' : ''} onClick={() => this.chooseFundType('基金产品')}>基金产品</span>
                    <span className={selectType === '基金管理人' ? 'active' : ''} onClick={() => this.chooseFundType('基金管理人')}>基金管理人</span>
                </div>
                <div className="tableContainerPanelDiv">
                {
                    selectType === '基金产品' ?
                    <table className="fundProductTable">
                        <tbody>
                            <tr>
                                <td>基金名称：</td>
                                <td>{productList.productName ? productList.productName : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金编号：</td>
                                <td>{productList.productCode ? productList.productCode  : '--'}</td>
                            </tr>
                            <tr>
                                <td>成立时间：</td>
                                <td>{productList.establishmentDate ? productList.establishmentDate  : '--'}</td>
                            </tr>
                            <tr>
                                <td>备案时间：</td>
                                <td>{productList.filingDate ? productList.filingDate  : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金备案阶段：</td>
                                <td>{productList.filingStage ? productList.filingStage  : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金类型：</td>
                                <td>{productList.productType ? productList.productType  : '--'}</td>
                            </tr>
                            <tr>
                                <td>币种：</td>
                                <td>{productList.currency ? productList.currency  : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金管理人名称：</td>
                                <td>{productList.managerName ? productList.managerName  : '--'}</td>
                            </tr>
                            <tr>
                                <td>管理类型：</td>
                                <td>{productList.managementType ? productList.managementType  : '--'}</td>
                            </tr>
                            <tr>
                                <td>托管人名称：</td>
                                <td>{productList.custodian ? productList.custodian  : '--'}</td>
                            </tr>
                            <tr>
                                <td>运作状态：</td>
                                <td>{productList.operateStatus ? productList.operateStatus  : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金信息最后更新时间：</td>
                                <td>{productList.lastUpdatedDate ? productList.lastUpdatedDate  : '--'}</td>
                            </tr>
                            <tr>
                                <td>基金协会特别提示（针对基金）：</td>
                                <td>{productList.associationTips ? productList.associationTips  : '--'}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="tdTitle"><span className="blueBlock"></span>信息批量情况</td>
                            </tr>
                            <tr>
                                <td>当月月报：</td>
                                <td>{productList.monthReport ? productList.monthReport  : '--'}</td>
                            </tr>
                            <tr>
                                <td>季报：</td>
                                <td>{productList.quarterReport ? productList.quarterReport  : '--'}</td>
                            </tr>
                            <tr>
                                <td>半年报：</td>
                                <td>{productList.halfYearReport ? productList.halfYearReport  : '--'}</td>
                            </tr>
                            <tr>
                                <td>年报：</td>
                                <td>{productList.yearReport ? productList.yearReport  : '--'}</td>
                            </tr>
                        </tbody>
                    </table> :
                    <div className="fundManageTableDiv">
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
                                    <td>基金管理人全程（中文）：</td>
                                    <td colSpan="3">{managerChineseName ? managerChineseName : '--'}</td>
                                </tr>
                                <tr>
                                    <td>基金管理人全程（英文）：</td>
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
                }
                </div>
            </div>
        );
    }
}