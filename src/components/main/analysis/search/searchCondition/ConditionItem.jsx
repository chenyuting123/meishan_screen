/*
* author:TanJun
* describe:ConditionItem
* createTime:2018/6/21
* */
import React, { Component } from 'react';
import { Icon } from 'antd';

class ConditionItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            open: false,
            option: this.props
        };
    }

    componentDidMount() {
        this._initData();
    }

    render() {
        let { open, option } = this.state, { title, items, more, type } = option;
        return <div className="c-search-condition__item">
            <span>{title}：</span>
            <ul className={`${open ? 'active' : ''}`}>
                {items.map(({ name, key, active }, index) => <li key={index}
                                                               className={active ? 'active' : ''}
                                                               onClick={() => {
                                                                   this._formatSelectDate({ key, items, option, type });
                                                               }}>{name}</li>)}
            </ul>
            {more
                ? <Icon type={`${open ? 'up' : 'down'}`} onClick={() => {
                    this.setState({ open: !open });
                }}/>
                : null}

        </div>;
    }

    getCurrentData() {
        let { current } = this.state, currentData = '';
        current.forEach(({ active, key }) => {
            let info = key === 0 ? '' : key;
            if (active) {
                currentData += !currentData ? info : `,${info}`;
            }
        });
        return currentData;
    }

    _initData() {
        let option = this.props;
        this.setState({
            option: {
                ...option, items: option.items.map((item, index) => {
                    if (index === 0) {
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                    return item;
                })
            }
        });
    }

    _formatSelectDate({ key, items, option, type }) {
        let newItem = items.map((ite, index) => {
            if (key === 0) {
                ite.active = index === 0 ? true : false;
            } else {
                if (index === 0) {
                    ite.active = false;
                }
                if (key === ite.key) {
                    ite.active = ite.active ? false : true;
                }
            }
            return ite;
        });

        let isE = newItem.filter((v) => v.active).length === 0;
        if (isE) {
            newItem[0].active = true;
        }
        let state = {
            option: {
                ...option, items: newItem
            },
            current: newItem.filter(({ active }) => active)
        };
        this.setState(state, () => {
            let select = {};
            select[type] = this.getCurrentData();
            this.props.getList(select);
        });
    }

}

export default ConditionItem;