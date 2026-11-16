/*
* author:TanJun
* describe:otherTemplate
* createTime:2018/6/24
* */
import React, { Component } from 'react';
import BackHeader from './backHeader';

class otherTemplate extends Component {
    render() {
        let { title } = this.props;
        return <div className="u-container">
            <BackHeader title={title}/>
            <div>
                {this.props.children}
            </div>
        </div>;
    }

}

export default otherTemplate;