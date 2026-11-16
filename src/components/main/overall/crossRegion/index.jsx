/*
* author:TanJun
* describe:CrossRegion
* createTime:2018/6/24
* */
import './index.scss';
import React, { Component } from 'react';
import OtherTemplate from '../../otherTemplate';
import { CommonTable } from 'CommonComponents';
import { Btnswitch } from '../../../common/indexComponent/IndexComponent';
import { Services } from 'Constants/common';
import { companyDetailAPI } from 'Services/detail';

const { COMPANY_DETAIL_CROSS_REGION_COUNT, COMPANY_DETAIL_CROSS_REGION } = Services;
const btnList = [
    { text: '分支机构', value: '1', num: 0 },
    { text: '投资子公司', value: '2', num: 0 }
];

class CrossRegion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabActiveVal: '1',
            title: '在经营的外地新金融企业名单(家）',
            area: props.params.area || '全国',
            industry: props.params.industry
        };
    }

    componentDidMount() {
        this._setTableInfo();
    }

    _setTableInfo =() => {
        let { tabActiveVal, area, industry, ym } = this.state;
        const query = this.props.location.query;
        let info = {
            type: tabActiveVal,
            province: query.province,
            city: query.city,
            area: query.area,
            industry: industry === '综合监测' ? '' : industry,
            ym: query.ym
        };
        this._table.upDateURL(
            {
                url: COMPANY_DETAIL_CROSS_REGION, // 请求的借口名字
                type: tabActiveVal,
                ...info,
                tableColumns: [
                    {
                        title: tabActiveVal === '2' ? '子公司名称' : '分支机构名称',
                        dataIndex: 'subCompanyName',
                        key: 'subCompanyName'
                    },
                    {
                        title: tabActiveVal === '2' ? '子公司注册地址' : '分支机构地址',
                        dataIndex: 'subCompanyAddress',
                        key: 'subCompanyAddress'
                    },
                    {
                        title: tabActiveVal === '2' ? '母公司名称' : '总公司名称',
                        dataIndex: 'companyName',
                        key: 'companyName'
                    },
                    {
                        title: '总公司风险等级',
                        dataIndex: 'riskLevel',
                        key: 'riskLevel'
                    },
                    {
                        title: '总公司注册地区',
                        dataIndex: 'companyRegAddress',
                        key: 'companyRegAddress'
                    }]
            });
        companyDetailAPI({
            type: COMPANY_DETAIL_CROSS_REGION_COUNT,
            data: info
        }).then(({ data }) => {
            let totalCount = 0;
            data.forEach(({ count, type }, index) => {
                totalCount += count;
                btnList.map((v) => {
                    if (parseInt(v.value, 10) === type) {
                        v.num = count;
                    }
                });
            });

            this.setState({ title: `在${query.province + query.city + query.area}经营的外地新金融企业名单(${totalCount}家)` });
        });
    }

    render() {
        let { tabActiveVal } = this.state;
        return <OtherTemplate {...this.state}>
            <div className="c-cross-region">
                <Btnswitch btnList={btnList} value={tabActiveVal}
                           onClick={(val) => this.setState({ tabActiveVal: val }, () => {
                               this._setTableInfo();
                           })}/>
                <CommonTable ref={refs => this._table = refs}/>
            </div>
        </OtherTemplate>;
    }

}

export default CrossRegion;