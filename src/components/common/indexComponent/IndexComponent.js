/*
 * @desc 首页组件
 * @author lijing
 */
import React, { Component } from 'react';
import './style.scss';
import Rader from 'Images/home/radar.gif';
import panelBg from 'Images/home/panelBg.png';

export const AacroAnalysis = ({
            type = '',
            date = '',
            score = null,
            areaNum = null,
            enterprisesNum = null,
            monthNum = 'null',
            ...opts
        }) => {
    return (
        <div className="AacroAnalysis-info" {...opts}>
            <div className="AacroAnalysis-top">
                <p className="titles">总体分析</p>
                <div className="AacroAnalysis-middle">
                    <img src={Rader} alt=""/>
                    <p className="scoreInfo">{score}</p>
                    <p className="typeInfo">{type}</p>
                </div>
                <div className="AacroAnalysis-right">
                    <p className="etTitle">监测时间</p>
                    <p className="etDate">{date}</p>
                </div>
                <div className="clearFloat"></div>
            </div>
            <div className="AacroAnalysis-bottom">
                <img src={panelBg} alt=""/>
                <div className="AacroAnalysis-content">
                    <p><label className="titleStyle">监测地区：</label><span className="eTitle"
                                                                        title={areaNum + '个'}><i>{areaNum}</i>个</span>
                    </p>
                    <p><label className="titleStyle">监测企业总数：</label><span className="eTitle"
                                                                          title={enterprisesNum + '家'}><i>{enterprisesNum}</i>家</span>
                    </p>
                    <p><label className="titleStyle">本月：</label><span className="eTitle"
                                                                      title={monthNum + '家'}><i>{monthNum}</i>家</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const Btnswitch = ({ btnList = [], onClick, value, className }) => {
    return (
        <div className={`switch-btn ${className ? className : ''}`}>
            {btnList.map((item, index) => (
                <span className={value === item.value ? 'active' : ''} key={index}
                      onClick={(e) => {
                          onClick(item.value);
                      }}>
                    {`${item.text} ${item.num ? `(${item.num})` : ''}`}
                    {
                        item.showNum && item.showNum > 0 ?
                            <lable className="sbuIcon">{item.showNum}</lable> : null
                    }
                    </span>))}
        </div>
    );
};

export const MyCheckBox = ({ children, selected, className, ...opts }) => {
    const prop = selected ? { className: `checkbox ${className ? className : ''} active` } : { className: `checkbox ${className ? className : ''}` };
    return (
        <div {...opts} {...prop}>
            {children}
        </div>
    );
};