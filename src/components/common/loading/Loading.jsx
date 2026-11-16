import './loading.scss';
import loading from 'Images/loading.gif';
import React, { Component } from 'react';
import classNames from 'classnames';
export default class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hide: true
        };
        this.clearShowLoading = this.clearShowLoading.bind(this);
        this.clearHideLoading = this.clearHideLoading.bind(this);
    }

    componentDidMount(){
        emitter.on(Event.SHOW_LOADING, this.clearShowLoading);
        emitter.on(Event.HIDE_LOADING, this.clearHideLoading);
    }

    clearShowLoading(){
        if(this.state.hide){
            this.setState({
                hide: false
            });
        }
    }

    clearHideLoading(){
        if(!this.state.hide){
            this.setState({
                hide: true
            });
        }
    }

    componentWillUnmount() {
        emitter.removeListener(Event.SHOW_LOADING, this.clearShowLoading);
        emitter.removeListener(Event.HIDE_LOADING, this.clearHideLoading);
    }

    render(){
        return (
            <div className={classNames({ loading: true, hide: this.state.hide })}>
                <div className="loading-dialog">
                    <img src={loading} />
                </div>
            </div>
        );
    }
}