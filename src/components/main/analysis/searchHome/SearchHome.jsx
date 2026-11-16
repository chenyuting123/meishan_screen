/*
* author:TanJun
* describe:SearchHome
* createTime:2018/6/20
* */
import './searchHome.scss';
import React, { Component } from 'react';
import AnalysisItem from './analysisItem/AnalysisItem';
import SearchInput from '../searchInput/SearchInput';
import { higgschartsType } from 'Constants/higgscharts';

const { CIRCLE, COMMUNITY, STOCK, NATURAL, SEEK, INDUSTRY, COUNT } = higgschartsType;

class SearchHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'SearchHome',
            title: '大数据智能检索及分析引擎，让风险企业无所遁形',
            analysisItem: [
                { title: '关联风险分析', info: '解析目标企业关联传导风险', icon: 'risk', type: CIRCLE },
                { title: '关键路径分析', info: '识别核心关联路径风险节点', icon: 'route', type: COMMUNITY },
                { title: '股权穿透分析', info: '解析资金链风险情况', icon: 'pierce', type: STOCK },
                // {title: '核心自然人分析', info: '掌握目标企业关联自然人风险', icon: 'natural-person', type: NATURAL},
                { title: '关系探寻分析', info: '深度探寻和分析企业间关系', icon: 'seek', type: SEEK },
                { title: '地域分布分析', info: '识别风险区域性转移风险', icon: 'distribution', type: INDUSTRY }
            ]
        };
    }

    render() {
        let { title } = this.state;
        return <div className="u-page c-search-home">
            <div className="c-search-home__top">
                <h1>{title}</h1>
                <SearchInput/>
            </div>
            <ul className="c-search-home__bottom">
                {this._getAnalysisItem()}
            </ul>
        </div>;
    }

    _getAnalysisItem() {
        let { analysisItem } = this.state;
        return analysisItem.map((item, index) => <AnalysisItem option={item} key={index}/>);
    }

}

export default SearchHome;