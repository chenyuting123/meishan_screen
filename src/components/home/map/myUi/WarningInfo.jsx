/*
 * @desc 地图上信息
 * @author lijing
 */
import './style/warningInfo.scss';
import React, { Component } from 'react';
import { getNum, getChangeNum, getIndexCount, validate } from './util';

export default class WarningInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   
        };
    }

    componentDidMount() {
        //
    }

    render() {
        let { title, IndexTotalInfoData, color, type, previewInfo, onClick, indexCount } = this.props;
        return (
            <div className="warningInfo_root">
                <span className="numstyle" style={{ color: color }}>{type === 'map' ? getNum(title, IndexTotalInfoData) : getIndexCount(title, indexCount)}</span>
                <p className="title" style={{ color: type === 'map' ? color : 'rgba(255,255,255,1)' }} onClick={(e) => {
                    type === 'map' && onClick && onClick(title, (previewInfo === '全国' ? true : false));
                }}>{title}</p>
                {
                    type === 'map' ? <p className="num-change">
                        <lable>本月变动</lable>
                        {validate(getChangeNum(title, IndexTotalInfoData)) ? ('+' + getChangeNum(title, IndexTotalInfoData)) : getChangeNum(title, IndexTotalInfoData)} </p> : null
                }

            </div>
        );
    }
}