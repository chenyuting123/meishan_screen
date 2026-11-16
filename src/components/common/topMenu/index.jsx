/*
* author:TanJun
* describe:topMenu
* createTime:2018/6/13
* */
import './index.scss';
import React, { Component } from 'react';
import { Menu } from 'antd';
import { browserHistory } from 'react-router';
import { shouldUpdate } from 'Utils/util';

class TopMenu extends Component {

    constructor(props) {
        super(props);
        let { menuItems } = props;
        this.state = {
            current: menuItems ? menuItems[0].key : 'main',
            menuItems: menuItems || [{ key: 'main', info: 'main' }]
        };
    }

    componentDidMount() {
        this._getKeys();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentDidUpdate() {
        this._getKeys();
    }

    render() {
        let { menuItems, current } = this.state;

        return (<Menu
            onClick={this._handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            className="c-top-menu"
        >
            {menuItems.map((item, index) => {
                let { key, info } = item;
                return <Menu.Item key={key}>{info}</Menu.Item>;
            })}

        </Menu>);
    }

    updateKey(key) {
        // 如何key没有匹配的默认第一个
        let { menuItems, current } = this.state;
        let newData = menuItems.filter((item) => item.key === key);

        if (key !== current) {
            this.setState({ current: newData.length > 0 ? key : current });
        }
    }

    _getKeys() {
        let keys = window.location.pathname.split('/'),
            key = '/' + keys[1] + '/' + keys[2];
        this.updateKey(key);
    }

    _handleClick = (e) => {
        browserHistory.push(e.key);
        this.updateKey(e.key);
    };

}

export default TopMenu;