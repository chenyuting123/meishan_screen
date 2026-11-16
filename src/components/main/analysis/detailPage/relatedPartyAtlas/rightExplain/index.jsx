/*
* author:TanJun
* describe:RightExplain
* createTime:2018/7/9
* */
import './index.scss';
import React, { Component } from 'react';
import { Icon } from 'antd';
import FunctionBtn from '../functionBtn';

class RightExplain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            outlineItem: [
                { icon: 'company/target', name: '目标企业' },
                { icon: 'company/risk', name: '高危风险企业' },
                { icon: 'company/company_grey', name: '吊销企业' },
                { icon: 'company/black', name: '黑名单企业' },
                { icon: 'man/man_blue', name: '自然人' }
            ],
            operationItem: [
                { title: '单击：', info: '高亮显示关联方及其直接关联;' },
                { title: '双击：', info: '快速扩展当前关联方;' },
                { title: '详情：', info: '在线查看详情信息;' },
                { title: '扩展/收起：', info: '扩展/收起直接关联方;' },
                { title: '监控：', info: '将节点加入到我的重点企业监控列表;' },
                { title: '探寻：', info: '查找与指定关联方的关联关系;' },
                { title: '路径：', info: '查看到信息主体的关联路线;' }
            ]
        };
    }

    render() {
        let { isShow, outlineItem } = this.state;
        return <div className="c-right-explain" style={{ width: isShow ? '249px' : '0' }}>
            <div className="c-right-explain__content">
                <h3>
                    <span>图谱操作说明</span>
                    <Icon type="close" onClick={() => {
                        this.setState({ isShow: false });
                    }}/>
                </h3>
                {this._getLittleTitle('图谱概要')}
                <ul className="c-right-explain__outline">
                    {outlineItem.map(({ icon, name }, index) => <li key={index}><img
                        src={require(`../../../../../../images/${icon}.svg`)} alt={name}/><span>{name}</span></li>)}
                </ul>
                {this._getLittleTitle('图谱操作')}
                <ul className="c-right-explain__operation">
                    {this._mouseTip({ name: '鼠标左键', icon: 'mouse_left' })}
                    {this._getOperationItem(0, 2)}
                    {this._mouseTip({ name: '鼠标右键', icon: 'mouse_right' })}
                    {this._getOperationItem(2, 10)}
                </ul>
            </div>
            <FunctionBtn {...this.props}/>
        </div>;
    }

    toggleExplain = () => {
        let { isShow } = this.state;
        this.setState({ isShow: !isShow });
    };

    _getLittleTitle = (name) => {
        return <h5>
            <span>{name}</span>
            <div className="c-right-explain__line"></div>
        </h5>;
    };

    _getOperationItem = (start, end) => {
        let { operationItem } = this.state;
        return operationItem.filter((item, index) => index >= start && index < end).map(({ title, info }, index) => <li
            key={index}><span>{title}</span><span>{info}</span></li>);
    };

    _mouseTip = ({ name, icon }) => {
        return <li className="c-right-explain__type">
            <img src={require(`../../../../../../images/analysis/${icon}.png`)} alt="mouse_left"/>
            <span>{name}鼠标左键</span>
        </li>;
    };
}

export default RightExplain;