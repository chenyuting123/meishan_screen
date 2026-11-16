/*
* @desc 图标公共部分
* @author xuyao
*/
import echarts from 'echarts';
import React, {Component} from 'react';

class EchartBase extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.renderEchartDom();
    }

    componentDidUpdate() {
        this.renderEchartDom();
    }

    _event(){
        let onEvents = this.props.onEvents || [];
        for (let eventName in onEvents) {
            if (eventName) {
                this._echartObj && this._echartObj.on(eventName, function (param) {
                    onEvents[eventName](param);
                });
            }
        }
        $(window).resize(function () {
            this._echartObj && this._echartObj.resize();
        });
    }

    componentWillUnmount() {
        echarts.dispose(this.echartsDom);
    }

    renderEchartDom() {
        this._echartObj = this.getEchartsInstance();
        this._echartObj.setOption(this.props.option, true);
        if (this.props.showLoading) {
            this._echartObj.showLoading();
        } else {
            this._echartObj.hideLoading();
        }
        this._event();
        return this._echartObj;
    }

    getEchartsInstance() {
        return echarts.init(this.echartsDom, 'echartTheme');
    }

    render() {
        let style = this.props.style || {
            height: '100%',
            width: '100%'
        };
        return (
            <div ref={item => this.echartsDom = item} style={style}/>
        );
    }
}

export default EchartBase;