/**
 * Created by fuzhihong on 2017/7/6.
 * 首页- 私募 - 基金类型
 */
import './privateType.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { indexPrivateFundAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';

const { INDEX_PRIVATE_FUND_COMPANY_TYPE, INDEX_PRIVATE_FUND_EMPLOYEE_SCALE, INDEX_PRIVATE_FUND_PRODUCT_TYPE } = Services;
// pie chart 公用参数
let COMMON_CONFIG = {
    color: ['rgb(0,86,192)', 'rgb(2,115,220)', 'rgb(113,200,244)', 'rgb(2,147,220)', 'rgb(2,207,220)', 'rgb(2,53,220)'],
    titleShow: true,
    data: [],
    name: '企业数量',
    unit: '家',
    length: 2,
    length2: 3,
    titleBottom: '5%',
    labelFontSize: 12
};
// pie chart 配置参数
let piesData = {
    fund: Object.assign({}, COMMON_CONFIG, {
        chartName: 'privateType',
        title: '基金类型',
        length: 2,
        length2: 3,
        color: ['#49dea4', '#0ad0dd', '#357fc7', '#097aff', '#92c8e8', '#5f4ffe', '#1947ff', '#8c38f4', '#e8f6ff', '#24a54b']
    }),
    company: Object.assign({}, COMMON_CONFIG, {
        chartName: 'enterpriseType',
        title: '企业性质',
        length: 2,
        length2: 3,
        color: ['#49dea4', '#0ad0dd', '#357fc7', '#097aff', '#92c8e8', '#5f4ffe', '#1947ff', '#8c38f4', '#e8f6ff', '#24a54b']
    }),
    employee: Object.assign({}, COMMON_CONFIG, {
        chartName: 'staff',
        title: '人员规模',
        length: 2,
        length2: 3,
        color: ['#49dea4', '#0ad0dd', '#357fc7', '#097aff', '#92c8e8', '#5f4ffe', '#1947ff', '#8c38f4', '#e8f6ff', '#24a54b']
    })
};

class PrivateType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoading: '暂无相关数据',
            hasDataFlag: {
                fund: false,  // 判断基金类型是否有数据 
                company: false, // 判断企业性质是否有数据
                employee: false // 判断人员规模是否有数据
            },
            loading: {
                fund: true,
                company: true,
                employee: true
            }
        };
    }

    /**
     * 组件加载完成
     */
    componentDidMount() {
        this.getAllData();
    }

    /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        if (!isEqualArea) {
            this.getAllData(nextProps);
        }
    }

    /**
     * 获取所有数据
     * @param monitorArea
     * @param countryFlag
     * @param operatingCity
     */
    getAllData(nextProps) {
        this.getData('fund', INDEX_PRIVATE_FUND_PRODUCT_TYPE, nextProps); // 基金类型
        this.getData('company', INDEX_PRIVATE_FUND_COMPANY_TYPE, nextProps); // 企业性质
        this.getData('employee', INDEX_PRIVATE_FUND_EMPLOYEE_SCALE, nextProps); // 人员规模
    }

    /**
     * 获取单个数据
     * @param type
     * @param url
     */
    getData = (typeFlag, url, nextProps) => {
        let { isCountry, city, area, province } = nextProps || this.props;
        let { hasDataFlag, loading } = this.state;
        indexPrivateFundAPI({
            type: url,
            data: {
                province: '浙江省',
                city: city,
                area: area
            }
        }).then(({ data }) => {
            loading[typeFlag] = false;
            let content = (data !== '""') ? JSON.parse(JSON.parse(data)) : null, info;
            if (content) {
                let info = [];
                for (let i in content) {
                    if (content.hasOwnProperty(i)) {
                        info.push({
                            name: i,
                            value: content[i]
                        });
                    }
                }
                piesData[typeFlag].data = info;
                hasDataFlag[typeFlag] = true;
                this.setState({
                    hasDataFlag
                }, function () {
                    CHATBBD.bbdPie(piesData[typeFlag]);
                });
            } else {
                hasDataFlag[typeFlag] = false;
                loading[typeFlag] = false;
                $(`#${hasDataFlag[typeFlag].chartName}`).find('canvas').remove();
                this.setState({ hasDataFlag });
            }
        });
    };

    render() {
        const { previewInfo, industry } = this.props;
        let { hasDataFlag, loading } = this.state;
        const industryTitle = industry === '综合监测' ? '' : industry + '-';
        return (
            <div className="private-type">
                <div className="head">
                    {/* <em className="iconfont icon-xingyexinxihua"> </em> */}
                    <span className="title">{previewInfo === '全国' ? '浙江省' : previewInfo}-{industryTitle}基金类型</span>
                </div>
                {/* 基金类型*/}
                {
                    hasDataFlag.fund ?
                        <div className="v-center" id="privateType" style={{ width: '33.3%', height: '90%' }}><span
                            className="no-data-info">{this.state.listLoading}</span></div> :
                        <span className="v-center no-data-info"
                              style={{ width: '33.3%', position: 'relative' }}>
                            <NoData isNoData={!loading.fund}/>
                        </span>
                }
                {/* 企业性质*/}
                {
                    hasDataFlag.company ?
                        <div className="v-center" id="enterpriseType" style={{ width: '33.3%', height: '90%' }}><span
                            className="no-data-info">{this.state.listLoading}</span></div>
                        : <span className="v-center no-data-info"
                                style={{ width: '33.3%', position: 'relative' }}>
                            <NoData isNoData={!loading.company}/>
                         </span>
                }
                {/* 人员规模*/}
                {
                    hasDataFlag.employee
                        ? <div className="v-center" id="staff" style={{ width: '33.3%', height: '90%' }}><span
                            className="no-data-info">{this.state.listLoading}</span></div>
                        : <span className="v-center no-data-info"
                                style={{ width: '33.3%', position: 'relative' }}>
                            <NoData isNoData={!loading.employee}/>
                        </span>
                }
            </div>
        );
    }

}

export default PrivateType;