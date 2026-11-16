import React, { Component } from 'react';
import './realInvestment.scss';

export default class RealInvestment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { realInvestmentContent } = this.props;
        return (
            <div className="realInvestmentPage">{realInvestmentContent}</div>
        );
    }
}