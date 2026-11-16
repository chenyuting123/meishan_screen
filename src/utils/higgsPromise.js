import qs from 'qs';
import axios from 'axios';
import emitter from './emitter';
import config from '../config/config';
import info from '../constants/information';
import { HttpMethod, Event } from '../constants/common';
import msger from './messager';
import { isArray, isEmpty, isNotEmpty, isNotBlank } from './util';
import { getSession } from './arrFilter';
import { browserHistory } from 'react-router';
import { getLocal } from 'Utils/storage';
/**
 * @desc 使用axios第三方库访问后台服务器, 返回封装过后的Promise对象.
 * @param {string} url 请求的接口地址, 格式: "/xxx..."
 * @param {string} domain 跨域请求的域名地址, 如: http://www.baidu.com
 * @param {string} type HTTP请求方式, 默认GET.
 * @param {object} data 请求的数据, object对象格式
 * @param {function} onUpload 上传文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} onDownload 下载文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} cancel 取消请求的回调函数, 接收cancel参数, 当执行cancel()参数时请求被取消.
 * @param {number} timeout 配置请求超时时间, 为毫秒数, 默认从配置文件读取.
 * @param {boolean} loading 是否开启loading动画, 默认 type 为 POST 的请求显示.
 * @param {boolean} cache 是否开启缓存, 开启后同样的请求(url相同, 参数相同), 第二次请求时会直接返回缓存数据, 不会请求后台数据, 默认false.
 * @param {boolean} handleError 是否自动处理接口报错情况, 默认true.
 * @param {object} messager 配置一个系统提示消息处理器, 封装了系统提示的展示方式, 对象需要有showError(msg)方法, 默认为messager.
 * @return {object} - 返回一个promise的实例对象
 */
export default function bbdPromise({
                                       localData = false,
                                       url = null,
                                       domain = null,
                                       type = HttpMethod.GET,
                                       data = {},
                                       onUpload = null,
                                       onDownload = null,
                                       cancel = null,
                                       timeout = config.timeout,
                                       loading = null,
                                       cache = false,
                                       handleError = true,
                                       messager = msger,
                                       isPostJson = false,
                                       isUpLoad = false
                                       
                                   }) {
    var getData;
    var postData;
    var cancelToken;
    var crossDomain = false;

    if (isEmpty(url)) {
        return Promise.resolve();
    }
    // if(!data['currentPageName']){
    //     data['currentPageName'] = getLocal('pageInfo');
    // }
    // type 为 POST 的请求会将参数转化为 formData 传递
    if (type === HttpMethod.POST || type === HttpMethod.PUT || type === HttpMethod.DELETE) {
        if (isPostJson || isUpLoad) {
            postData = data;
        } else {
            if (isNotEmpty(data)) {
                postData = qs.stringify(data, { allowDots: true });
            }
        }
    } else {
        getData = data;
    }

    showLoading(type, loading);

    var promise = new Promise(function (resolve, reject) {
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        axios.defaults.headers.common['token'] = getSession('token');
        if (isPostJson) {
            axios.defaults.headers.post['Content-Type'] = 'application/json';
        } else {
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (type === HttpMethod.POST && isUpLoad) {
            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        }

        if (!cache) {
            let nowTime = new Date().getTime();
            url += url.indexOf('?') > -1
                ? '&t=' + nowTime
                : '?t=' + nowTime;
        }

        var httpRequest = axios({
            method: type,
            baseURL: domain,
            url: url,
            timeout: timeout,
            params: getData,
            data: postData,
            withCredentials: crossDomain,
            onUploadProgress: onUpload,
            onDownloadProgress: onDownload,
            cancelToken: cancelToken
        }).then(function (response) {
            hideLoading(response.config, loading);
            /**
             * 请求成功, 只会返回data中的数据
             */
            if (response.data.statusCode === '0000') {
                resolve(response.data);
            } else if (response.data.statusCode === '2000') {
                // session过期，重新登录
                browserHistory.push('/');
            } else {
                reject(response.data);
                if (handleError) {
                    var errorMsg = processError(response.data);
                    if (isNotBlank(errorMsg)) {
                        messager.error(errorMsg);
                    }
                }
            }
        }).catch(function (error) {
            // 服务端返回的异常
            messager.error(info['SYSTEM_ERROR']);
        });
    });
    return promise;
}

function showLoading(method, isShow) {
    if (isShow || (isShow === null && method === HttpMethod.POST)) {
        emitter.emit(Event.SHOW_LOADING);
    }
}

function hideLoading(config, isShow) {
    if (isShow || (isShow === null && config.method === HttpMethod.POST)) {
        emitter.emit(Event.HIDE_LOADING);
    }
}

/**
 * 后台返回状态码, 根据后端同事返回的code进行相应的处理(code含义需与后端同事约定好, 此处只是浩格后台返回示例, 具体按项目实际情况调整代码).
 */
function processError(response) {
    var errorMessage;
    switch (response.status) {
        case 'SESSION_EMPTY':
        case 404:   // 数据请求异常
            errorMessage = info['RESPONSE_ERROR'];
            break;
        case 500:   // 数据请求报错，不加errormessage，报错由各人根据需求提示
            errorMessage = '';
            break;
        default:    // 未知错误
            errorMessage = response.message;
    }
    return errorMessage;
}

function log(data, title) {
    /* eslint-disable no-console */
    if (title) {
        console.log(title + ' start');
    }
    if (console.table && isArray(data.data)) {
        console.table(data.data);
    }
    if (title) {
        console.log(title + ' end');
    }
    /* eslint-enable no-console */
}

Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
        .catch(function (reason) {
            // 抛出一个全局错误
            setTimeout(() => {
                throw reason;
            }, 0);
        });
};

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)).then(() => value),
        reason => P.resolve(callback(reason)).then(() => {
            // throw reason;
        })
    );
};