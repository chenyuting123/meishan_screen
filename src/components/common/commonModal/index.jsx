/*
* author:TanJun
* describe:commonModal
* createTime:2018/6/15
* */
import style from './index.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';

class CommonModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            option: {
                title: 'CommonModal',
                callback: () => {

                }
            }
        };
    }

    render() {
        let { visible, option } = this.state,
            { children, wrapClassName } = this.props,
            { callback, title } = option || {};
        return <Modal
            title={title}
            wrapClassName="vertical-center-modal"
            width={460}
            visible={visible}
            onOk={() => {
                callback && callback();
                this.toggleModal({ type: false });
            }
            }
            onCancel={() => {
                this.toggleModal({ type: false });
            }}
        >
            {children}
        </Modal>;
    }

    toggleModal = ({ type, option }) => {
        let state = {};
        state = { ...state, visible: type };
        if (option) {
            option = { ...this.state.option, ...option };
            state = { ...state, option };
        }
        this.setState(state);
    };

}

export default CommonModal;