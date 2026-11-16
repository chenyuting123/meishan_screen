'use strict';

import './map.scss';
import './style.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { LoadingBox, Tip } from 'mtui/index';

//   载入可用模块
import Map from './Map'; //   引擎 

class Index extends Component {
    //   构造函数
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="activeMap" id = "activeMap">

                {/* 可视区域 */}
                <div className="activeMap-canvas textLineHide">

                    <Map {...this.props}/>{/* 默认图谱 */}
                    <div id="Map2"></div>{/* 重绘 */}
                    <div id="Map3"></div>{/* 点击高亮 */}
                    <div id="Map4"></div>{/* 历史变更 */}
                    <div id="Map5"></div>{/* 探寻 */}
                </div>

            </div>
        );
    }
}

export default Index;