import 'mtui/style.css';
import './styles/main.scss';
import { render } from 'react-dom';
import React from 'react';
import Root from './routes/Root';
// import Perf from 'react-addons-perf';
// 性能测试
// window.Perf = Perf;
// Perf.start();

render(
    <Root/>,
    document.getElementById('app')
);