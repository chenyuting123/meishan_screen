/*
* @type 折线柱状组合图
* @author 
*/
import React, { Component } from 'react';
import extend from './utils/extend';
import EchartBase from './base/EchartBase';
class BBDLineArea extends Component {
    constructor(props) {
        super(props);
    }
    setOption(param){
        const option = {
            
        };
        let op = extend(true, {}, option, param);
        return op;
    }
    render() {
        return ( 
            <EchartBase option={this.setOption(this.props.option)} style = {this.props.style} />
        );
    }
}
export default BBDLineArea;