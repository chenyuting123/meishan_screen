import React, { Component } from 'react';
import './login.scss';
import LoginFrom from './loginItem/Login';

export default class Login extends Component {
    render() {
        return (
            <div className="login" ><LoginFrom {...this.props}/></div>
        );
    }
 }