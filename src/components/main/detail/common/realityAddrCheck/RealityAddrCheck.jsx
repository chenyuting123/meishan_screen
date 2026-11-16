/**
 * Created by fuzhihong on 2017/4/20.
 * Remark 信用信息
 */
import './RealityAddrCheck.scss';
import React, { Component } from 'react';
import emitter from 'Utils/emitter';
import { HJPromise } from '../../../../../utils/hjPromise';
import { LoadingBox } from 'mtui/index';

export default class RealityAddrCheck extends Component{
    constructor(props){
        super(props);
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            companyActualAddress: '',
            useRegAddresCompany: '',
            relationShip: '',
            equalActualAddress: false,
            isLoadingData: true,
            realInvestmentContent: ''
        };
    }

    componentDidMount(){
        this.getList();
        this.getRealInvestmentInfo();
    }

    /**
     * tabs回调函数
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    changeBack(index){
        let _this = this;
        _this.setState({
            activeIndex: index
        });
    }

    /**
     * 地址&投向核查信息
     * @return {[type]} [description]
     */
    getList() {
        let { companyId } = this.state;
        HJPromise({
            url: '/api/v1.0/companyDetail/checkActualOfficeAddress',
            data: {
                bbdId: companyId
            }
        }).then((res) => {
            let { statusCode, data } = res;
            if (statusCode === '0000') {
                let { code, content } = data;
                if (code === 200) {
                    let { companyActualAddress, useRegAddresCompany, relationShip, equalActualAddress } = content;
                    this.setState({
                        companyActualAddress,
                        useRegAddresCompany,
                        relationShip,
                        equalActualAddress
                    }, () => {
                        this.getRealInvestmentInfo();
                    });
                }
            }
        });
    }

    // 获取真实投资信息
    getRealInvestmentInfo(){
        let { companyId, companyName } = this.state;
        HJPromise({
            url: `/api/v1.0/relation/getRealInvestment.do?qyxxId=${companyId}&&companyName=${companyName}`,
            type: 'post',
            cache: true
        }).then((res) => {
            if (res.statusCode === '0000') {
                if(res.data.code === 200) {
                    this.setState({
                        realInvestmentContent: res.data.content,
                        isLoadingData: false
                    });
                }
            }
        });
    }

    render(){
        let { companyActualAddress, useRegAddresCompany, relationShip, equalActualAddress, isLoadingData, realInvestmentContent } = this.state;
        return(
            <div className="realityWorkAddrCheck">
                {
                    isLoadingData
                    ? <div className="u-loading-box">
                        <LoadingBox info="数据加载中" type="loading2"/>
                    </div>
                    :
                    <div>
                        {
                            realInvestmentContent ?
                            <div>
                                <p className="titleLine">
                                    <span className="blueBlock"></span>
                                    真实投资行为
                                </p>
                                <p className="containerStyle">{realInvestmentContent}</p>
                            </div> : ''
                        }
                        <div>
                            <p className="titleLine">
                                <span className="blueBlock"></span>
                                真实办公地址核查
                            </p>
                            {
                                equalActualAddress ? 
                                <p className="containerStyle">实际经营注册地址一致</p> : 
                                <p className="containerStyle unSame">实际经营注册地址不一致</p>
                            }
                            {
                                (!equalActualAddress && companyActualAddress !== '-') ? 
                                <div>
                                    <p className="lineTitle">实际经营地址：</p>
                                    <p className="containerStyle">{companyActualAddress}</p>
                                </div>
                                 : ''
                            }
                            {
                                (!equalActualAddress && useRegAddresCompany !== '-') ? 
                                <div>
                                    <p className="lineTitle">注册地实际经营公司：</p>
                                    <p className="containerStyle">{useRegAddresCompany}</p>
                                </div>
                                 : ''
                            }
                            {
                                (!equalActualAddress && relationShip !== '-') ? 
                                <div>
                                    <p className="lineTitle">与目标公司关联关系：</p>
                                    <p className="containerStyle">{relationShip}</p>
                                </div>
                                : ''
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}