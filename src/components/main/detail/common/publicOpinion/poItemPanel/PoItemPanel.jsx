/**
 * Created by fuzhihong on 2017/7/7.
 * PoItemPanel 舆情项包裹层(公用组件)
 */
import './poItemPanel.scss';
import React, { Component } from 'react';

export default class PoItemPanel extends Component{
    constructor(props){
        super(props);
    }
    static defaultProps = {
        itemSize: 'col-1-3',
        itemName: '舆情项',
        hideHead: false
    };
    render(){
        let { itemSize, itemName, margin, hideHead, infiniteHeight, className, positionRelative, rightTitle }  = this.props;
        let cName = ['poItem-panel'];
        if(itemSize){
            cName.push(' ' + itemSize);
        }
        if(margin){
            cName.push(' ' + margin);
        }
        if(className){
            cName.push(' ' + className);
        }
        return (
            <div className={cName.join('')} style={{ position: positionRelative ? 'relative' : 'none' }}>
                <div className="head" style={{ display: hideHead ? 'none' : 'block' }}>
                    <span>{itemName || '舆情项'}</span>
                    {rightTitle ? <span className="rightTitle">{rightTitle}</span> : null}
                </div>
                {/* 490px为 适应没有头部的item*/}
                <div className="content" style={{ height: infiniteHeight ? '100%' : hideHead ? '490px' : '440px' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}