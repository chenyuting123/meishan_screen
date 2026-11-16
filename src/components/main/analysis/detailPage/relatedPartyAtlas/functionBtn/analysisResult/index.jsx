/*
* author:TanJun
* describe:AnalysisResult
* createTime:2018/7/10
* */
import './index.scss';
import React, { Component } from 'react';

class AnalysisResult extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { color, num, name } = this.props;
        let id = `svg_${num + color}`;

        return (
            <li className="c-analysis-result">
                <svg xmlns="http://www.w3.org/2000/svg" width="86" height="70" viewBox="0 0 33.13 32" fill={color}>
                    <defs>
                        <linearGradient y2="1" x2="1" y1="0" x1="0" id={id}>
                            <stop stopColor="rgb(255, 255, 255)" offset="0"/>
                            <stop stopColor={color} offset="1"/>
                        </linearGradient>
                    </defs>
                    <polygon fill={`url(#${id})`} points="2.57 16.2 9.57 29.32 23.57 29.32 30.57 16.2 23.57 3.07 9.57 3.07 2.57 16.2"/>
                    <polygon points="1.13 16.2 8.87 1.7 11.57 1.7 11.57 0.7 8.27 0.7 0 16.2 8.27 31.7 11.57 31.7 11.57 30.7 8.87 30.7 1.13 16.2"/>
                    <polygon points="24.87 0.7 21.57 0.7 21.57 1.7 24.27 1.7 32 16.2 24.27 30.7 21.57 30.7 21.57 31.7 24.87 31.7 33.13 16.2 24.87 0.7"/>
                    <circle cx="16.57" cy="1" r="1"/>
                    <circle cx="16.57" cy="31" r="1"/>
                </svg>
                <span style={{ color }}>
                    {num}家
                </span>
                <p>{name}</p>
            </li>
        );
    }

}

export default AnalysisResult;