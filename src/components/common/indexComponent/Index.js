import React, { Component } from 'react';
import { AacroAnalysis, tendencyChart } from './IndexComponent';
export default class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //
        };
    }

    render() {
        return (
            <div style={{ height: '1000px', backgroundColor: '#303448', padding: '20px' }}>
                <AacroAnalysis style={{ marginBottom: '30px' }}/>
                <tendencyChart style={{ marginBottom: '30px' }}/>
            </div>
        );
    }
}

