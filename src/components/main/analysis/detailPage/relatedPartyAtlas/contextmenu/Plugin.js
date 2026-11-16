/**
 * 图谱插件抽象类
 */
import uuid from 'Utils/uuid';

export default class Plugin {

    id;
    dom;
    handler;
    options;

    constructor(opts) {
        this.id = uuid();
        this.options = opts;
    }

    init(dom, handler) {
    }

    beforeApply() {
    }

    apply() {
    }

    afterApply() {
    }

    dispose() {
    }

    getId() {
        return this.id;
    }

}