import extend from './utils/extend';
import EchartBase from './base/EchartBase';
import React, { Component, PropTypes } from 'react';
class BBDChinaMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currIndex: -1
        };
    }
    setOption(param){
        const option = {
            'tooltip': {
                'show': true,
                'padding': 0,
                'backgroundColor': 'rgba(255,255,255,0)'
            },
            'title': {
                show: true,
                link: '',
                target: 'self',
                x: 'center',
                y: 'top',
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bolder'
                }
            },
            'series': [
                {
                    'name': '',
                    'type': 'map',
                    'mapType': 'china',
                    'zoom': 1.2,
                    'selectedMode': false,
                    'itemStyle': {
                        'normal': {
                            'areaColor': '#5F5E72',
                            'borderWidth': 1,
                            'borderColor': '#5F5E72',
                            'label': {
                                'show': true
                            }
                        },
                        'emphasis': {
                            'areaColor': '#ED564D',
                            'shadowBlur': 16,
                            'borderWidth': 0,
                            'borderColor': '#5F5E72',
                            'shadowColor': '#262A2B',
                            'shadowOffsetX': 0,
                            'shadowOffsetY': 0,
                            'label': {
                                'show': true
                            }
                        }
                    },
                    'label': {
                        'normal': {
                            'show': false
                        },
                        'emphasis': {
                            'show': false
                        }
                    },
                    'data': []
                }
            ]
        };
        let op = extend(true, {}, option, param);
        return op;
    }
    render() {
        return ( 
            <EchartBase option={this.setOption(this.props.option)} onEvents={this.props.onEvents} style = {this.props.style} />
        );
    }
}
export default BBDChinaMap;