/**
 * Created by fuzhihong on 2017/7/5.
 * 首页公用 - tooltip
 */
import './tooltip.scss';
import React, { Component } from 'react';

export default class Tooltip extends Component{
    constructor(props){
        super(props);
        this.state = {
            showBox: false // show or hidden flag
        };
    }

    /**
     * 鼠标移入
     * @param e
     */
    handleMouseOver(e){
        let target = e.target;
        this.setState({
            showBox: true,
            left: target.offsetLeft - target.offsetWidth * 1.5,
            top: target.offsetTop + target.offsetHeight
        });
    }

    /**
     * 鼠标移除
     */
    handleMouseLeave(){
        this.setState({
            showBox: false
        });
    }
    render(){
        let { showBox, left, top } = this.state;
        return (
            <div className="pr">
                <span onMouseOver={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>{this.props.children}</span>
                <div className="hj-tooltip" style={{ display: showBox ? 'block' : 'none', left: left, top: top }}>
                    <p className="tool-title">{this.props.title}</p>
                    <p className="mt10">本月增加 <em className="blue">{this.props.rise}</em> 家, 减少 <em className="blue">{this.props.down}</em> 家.</p>
                </div>
            </div>
        );
    }
}