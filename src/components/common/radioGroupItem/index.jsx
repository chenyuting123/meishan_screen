import React, { Component } from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

class RadioGroupItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: 0
        };
    }

    render() {
        let { option } = this.props, { radioValue } = this.state, { radio } = option;
        let radios = radio.map(value => <Radio value={value.key} key={value.key}>{value.info}</Radio>);
        return <RadioGroup onChange={this.onChangeRadio} value={radioValue}>
            {radios}
        </RadioGroup>;
    }

    getValue() {
        return this.state.radioValue;
    }

    setValue(value) {
        this.setState({ radioValue: value });
    }

    onChangeRadio = (e) => {
        this.setState({ radioValue: e.target.value });
    };

}

export default RadioGroupItem;