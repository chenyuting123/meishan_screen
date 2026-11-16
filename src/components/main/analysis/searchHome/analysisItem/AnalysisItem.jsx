/*
* author:TanJun
* describe:AnalysisItem
* createTime:2018/6/20
* */
import './analysisItem.scss';
import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { MIAN, ANALYSIS, ANALYSIS_DETAIL } from 'RouterPath';

class AnalysisItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'AnalysisItem'
        };
    }

    render() {
        let { name } = this.state;
        let { title, info, icon, type } = this.props.option;
        return <li className="c-analysis-item">
            <Link>
                <img src={require(`Images/analysis/${icon}.png`)} alt=""/>
                <h3>{title}</h3>
                <p className="c-analysis-item__info">{info}</p>
            </Link>
        </li>;
    }

}

export default AnalysisItem;