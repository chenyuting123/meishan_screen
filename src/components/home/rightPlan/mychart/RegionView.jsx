/*
 * @desc 全国-新金融企业地域分布
 * @author lijing
 */
import './style/regionView.scss';
import React, { Component } from 'react';
import { Tip } from 'mtui';
import { Btnswitch } from '../../../common/indexComponent/IndexComponent';
import { findCompanyCountGroupByRegion } from '../../../../services/home';
import Immutable from 'immutable';
export default class RegionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabActiveVal: '0',
            CompanyCountGroupByRegionList: [] // 列表数据
        };
    }

    componentDidMount() {
        this.getData();
    }
     /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { previewInfo, industry } = nextProps;
        let isEqualArea = Immutable.is(previewInfo, this.props.previewInfo);
        let isEqualIndustry = Immutable.is(industry, this.props.industry);
        if (!isEqualArea || !isEqualIndustry) {
            this.getData(nextProps);
        }
    }
    getData(nextProps) {
        let { isCountry, city, area, province, industry } = nextProps || this.props;
        let { tabActiveVal } = this.state;
        let obj = {
            province: !isCountry ? province : '',
            city: city,
            area: area,
            industry: industry === '综合监测' ? '' : industry,
            riskLevel: tabActiveVal === '0' ? '' : '高危预警'
        };
        findCompanyCountGroupByRegion(obj).then((res) => {
            this.setState({
                CompanyCountGroupByRegionList: res.data
            });
        }, (error) => {
            console.error(error.message);
        });
    }
    
    // 点击切换
    choseTab = (val) => {
        this.setState({
            tabActiveVal: val
        }, () => {
            this.getData();
        });
    };

    render() {
        let { industry } = this.nextProps || this.props;
        let { tabActiveVal, CompanyCountGroupByRegionList } = this.state;
        let tabList = [
            { text: '新金融企业集中区域', value: '0' },
            { text: '高危企业集中区域', value: '1' }
        ];
        return (
            <div className="regionView-root">
                <div className="regionView-top">
                    <p className="regionView-title">{industry === '综合监测' ? '全国-新金融企业地域分布' : '全国-' + industry + '企业地域分布'}</p>
                    <Btnswitch btnList={tabList} value={tabActiveVal}
                               onClick={this.choseTab}/>
                </div>
                <div className="table-box">
                    <table className="tableStyle">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>地区</th>
                            <th>数量</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            CompanyCountGroupByRegionList.length !== 0 ? CompanyCountGroupByRegionList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.region}</td>
                                        <td>{item.highCompany}</td>
                                    </tr>
                                );
                            }) : <tr>
                                <td colSpan="3">暂无相关数据</td>
                            </tr>
                        }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}