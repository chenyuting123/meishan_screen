/*
* author:TanJun
* describe:LeftScreen
* createTime:2018/7/9
* */
import './index.scss';
import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';
import ScreenItem from './screenItem';
import SeekItem from './seekItem';
import { higgschartsType, appDataType } from 'Constants/higgscharts';

const { TabPane } = Tabs;
const { SEEK } = higgschartsType;

class LeftScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }

    render() {
        let { isShow } = this.state, item = this._getComps();
        return <div className="c-left-screen" style={{ width: isShow ? '500px' : '44px' }}>
            <div className="c-left-screen__content">
                <div className="c-left-screen__handle" onClick={() => {
                    this.setState({ isShow: !isShow });
                }}>
                    <Icon type={isShow ? 'left' : 'right'}/>
                </div>
                <Tabs defaultActiveKey="1" size="small"
                      className={`c-left-screen__tab ${isShow ? 'active' : ''}`}
                      tabPosition="left" onTabClick={() => {
                          this.setState({ isShow: !isShow });
                      }}>
                    {item.map(({ com, tab, key }, index) => <TabPane tab={tab} key={key}>{com}</TabPane>)}
                </Tabs>
            </div>
        </div>;
    }

    _getComps() {
        let { type } = this.props;
        let item = [
            {
                com: type === SEEK ? <SeekItem {...this.props}/> : <ScreenItem {...this.props}/>,
                tab: <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18" width="16" height="18">
                        <path
                            d="M13.13,2,9.3,7.91,9,8.41v5.47L7,15.21V8.41l-.32-.5L2.83,2h10.3m1.8-2H1A1,1,0,0,0,.21,1.63L5,9v7.92a1.08,1.08,0,0,0,1.68.9l3.83-2.55a1.08,1.08,0,0,0,.48-.9V9l4.77-7.37A1,1,0,0,0,14.93,0Z"/>
                    </svg>
                    <br/>筛选</div>,
                key: 1
            }
        ];
        return item;
    }

}

export default LeftScreen;