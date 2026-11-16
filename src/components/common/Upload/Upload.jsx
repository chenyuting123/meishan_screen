import React, { Component } from 'react';
import './Upload.scss';
import { getSession } from '../../../utils/arrFilter';
import { uuid } from '../../../utils/util';

class Upload extends Component {
    static defaultProps = {
        accept: '*', // 支持上传文件类型
        multiple: true, // 是否支持多选
        isImmediate: true // 是否立即上传
    }

    constructor(props) {
        super(props);
        this.state = {
            submit: props.submit
        };
        this.allFiles = {}; // 被选择上传的所有文件

        // 是否是IE9
        this.isIE9Version = (() => {
            // 这个组件只针对 IE9+ 所以 若是IE浏览器时，版本默认就是9 或 9+
            const navigator = window.navigator;
            const appName = navigator.appName;
            const appVersion = navigator.appVersion;
            return appName === 'Microsoft Internet Explorer' && /MSIE(\s)*9\.0/.test(appVersion);
        })();

        // 不同实例须有不同的iframe.name 和 form.target
        this.uuid = uuid();
    }
    componentDidMount() {
        // 针对IE9上传完毕后回调
        if (this.isIE9Version) {
            const complete = this.props.complete;
            this.iframeDom.onload = function () {
                let innerHTML = this.contentWindow.document.body.innerHTML;
                (innerHTML && complete) && complete(innerHTML);
            };
        }
    }
    /*
     * 选择文件回调
     * @params e { Obj } 事件对象
     * */
    selectFile = (e) => {
        // 清空原来选中的文件
        this.allFiles = {};
        let files = [];
        const { change, isImmediate } = this.props;
        let fileName = '';
        let fileAccept = '';
        if (this.isIE9Version) { // ie中获取文件，ie中只能单个选择文件，不能一次选择多个
            let file = e.target;
            file.select();
            file.blur();
            let path = document.selection.createRange().text.split('\\');
            fileName = [path[path.length - 1]];
            fileAccept = this.filterFile(fileName);
        } else {
            files = [...e.target.files];
            fileAccept = this.filterFile(files);
        }

        if (!fileAccept) { // 判断上传文件与规定的文件是否是同类型
            files.map(item => this.allFiles[item.name] = item);// 去重处理
            let filesPara = this.isIE9Version ? fileName : Object.keys(this.allFiles);
            change && change(filesPara);
            isImmediate && this.submit1();// 用户选择文件 立即上传
        } else {
            this.props.error();
        }
        this.fileInput.value = '';
    }

    /*
     * 判断文件格式是否符合要求
     */
    filterFile = (files) => {
        return files.some((item, key) => { // 判断上传的文件是否符合要求的文件类型
            let itemName = item.name || item;
            let file = itemName.split('.');
            let fileType = file[file.length - 1];
            let propsType = this.props.accept.split(',');
            // 去除每一项格式两端的空格
            let propsTypeNew = propsType.map((item) => { return item.trim(); });
            return !(propsTypeNew.includes(fileType));
        });
    }

    /*
     * 点击提交上传
     * 惰性载入处理
     * */
    submit1 = () => {
        if (this.isIE9Version) {
            this.formDom.submit();
            this.allFiles = {};
        } else {
            const fd = new FormData();
            const allFiles = this.allFiles;
            // console.log(this.allFiles, 'ffff');
            for (let i in allFiles) {
                if(allFiles.hasOwnProperty(i)){
                    fd.append('file', allFiles[i]);
                }
                
            }
            let { submit } = this.state;
            submit(fd);
            // 上传之后，清空文件列表
            this.allFiles = {};
        }
    }

    render() {
        const {
            accept,
            multiple,
            serverUrl,
            isImmediate,
            className,
            uploadName,
            urlParams
        } = this.props;
        return (
            <div className={'upload_root ' + className || ''}>
                {
                    this.isIE9Version &&
                    <iframe
                        name={'upload_iframe_' + this.uuid}
                        className="upload_iframe"
                        ref={iframe => this.iframeDom = iframe}
                    > </iframe>
                }
                <form
                    method="post"
                    action={!urlParams ? `${serverUrl}?token=${getSession('token')}` : `${serverUrl}?${$.param(urlParams)}&token=${getSession('token')}`}
                    target={'upload_iframe_' + this.uuid}
                    className="upload_form"
                    encType="multipart/form-data"
                    ref={form => this.formDom = form}
                >
                    <label
                        className="upload_label"
                    >
                        <span className="upload_name">{uploadName}</span>
                        <input
                            type="file"
                            name="file"
                            accept={accept}
                            multiple={multiple}
                            className="upload_input"
                            onChange={this.selectFile}
                            ref={(item) => this.fileInput = item}
                        />
                    </label>
                </form>
                {
                    isImmediate ? null : <button className="upload_submit btn backStyle" onClick={this.submit1}>点击提交</button>
                }
            </div>
        );
    }
}

export default Upload;