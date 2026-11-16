import React from 'react';
import { render } from 'react-dom';
import Contextmenu from './Contextmenu';
import Plugin from './Plugin';

export default class ContextmenuPlugin extends Plugin {

    constructor(opts) {
        super(opts);
    }

    init(dom, handler, painter) {
        this.dom = dom;
        this.handler = handler;
        this.painter = painter;
    }

    beforeApply() {}

    apply() {

        render(
            <Contextmenu painter={this.painter} handler={this.handler}/>,
            this.dom
        );
    }

    afterApply() {}

    dispose() {}
}