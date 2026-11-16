
import React from 'react';
var Immutable = require('immutable');
// 单选组合
const Swicth = React.createClass({
    getInitialState() {
	    return {
	        checked: this.props.checked,
	        checkedChildren: this.props.checkedChildren,
	        unCheckedChildren: this.props.unCheckedChildren
	    };
    },
    handleClickSwitch(e){
        if(this.props.disabled !== undefined){
            return;
        }
        let $swicth = $(this.swicth);
        if(this.state.checked === 'true'){
            this.setState({
                checked: 'false',
                title: this.props.checkedChildren
            }, function(){
                if(this.props.callback){
                    this.props.callback(this.state.checked);
                }
            });
        } else {
            this.setState({
                checked: 'true',
                title: this.props.unCheckedChildren
            }, function(){
                if(this.props.callback){
                    this.props.callback(this.state.checked);
                }
            });
        }
    },
    componentWillReceiveProps: function(nextProps) {
        let isEqual = Immutable.is(nextProps.title, this.props.title);
        if (!isEqual) {
            this.setState({ title: nextProps.title });
        }
    },
    render(){
        return (
			<div className={'tg-list-item ' + this.props.className} disabled={this.props.disabled} ref={ swicth => this.swicth = swicth} onClick={this.handleClickSwitch} >
				<input className="tgl tgl-light"   id={this.props.id} value={this.state.checked} type="hidden" />
				<label className="tgl-btn" htmlFor={this.props.id}>
					<em className="left">{this.state.checkedChildren}</em>
					<em className="right">{this.state.unCheckedChildren}</em>
				</label>
			</div>
        );
    }
});

// 配置信息
export default Swicth;