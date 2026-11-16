/**
 * Created by Administrator on 2017/4/17.
 * 首页排名图表
 */
import './rank.scss';
import React, { Component } from 'react';
import Percent from '../percent/Percent';
import classname from 'classnames';
import { isNumber } from 'Utils/util';

class Rank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatName: props.chatName,
            length: null
        };
    }

    render() {
        let { percent, cityName, value, showStyle, totalCompanies } = this.props,
            width = totalCompanies ? Math.round(value * 100 / totalCompanies) : Math.min((percent ? percent.toFixed(2) : 0) * 100, 100);
        return (
            <div className="rank-chart">
                <div className={showStyle ? 'city-label left showStyle' : 'city-label left'}>{cityName}</div>
                <div className="city-line left">
                    <div className="display-line" style={{ width: `${width}%` }}>
                        <em className={classname({ inValue: width > 60, outValue: width <= 60 })}>{value}</em>
                    </div>
                </div>
                <div className="fr pa">
                    <div className="percent">
                        <Percent width="50" height="50" percent={totalCompanies ? width / 100 : percent.toFixed(2)}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default Rank;