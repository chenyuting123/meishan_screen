import React, { Component } from 'react';
import { Link } from 'react-router';
import './main.scss';
import Header from '../../layouts/header/Header';
import Footer from '../../layouts/footer/Footer';
export default class Main extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selctTypeVal: '1'
        };
    }
    componentDidMount(){
        let pathname = this.props.location.pathname;
        if(pathname === '/main'){
            this.setState({
                selctTypeVal: '1'
            });
        }else{
            this.setState({
                selctTypeVal: '2'
            });
        }
    }
    render() {
        return (
            <div className="main">
                <Header {...this.props} selctTypeVal={this.state.selctTypeVal}/>
                <div className="main-content">{this.props.children}</div>
                <Footer />
            </div>
        );
    }
}