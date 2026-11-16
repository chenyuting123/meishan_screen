import qs from 'qs';
import axios from 'axios';
import { Link, hashHistory, browserHistory } from 'react-router';
import emitter from './emitter';
import config from '../resources/config.dev';
import { HttpMethod, Event } from '../constants/common';
import { getPassportStaticServer } from './serverHandler';
import { isString, isArray, isBlank, isEmpty, isNotEmpty } from './util';
import http from 'http';
import querystring from 'querystring';
import url from 'url';
import { Tip } from 'mtui/index';

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
 * @param {boolean} cache 是否开启缓存, 开启后同样的请求(url相同, 参数相同), 第二次请求时会直接返回缓存数据, 不会请求后台数据, 默认false.
 * @param {boolean} handleError 是否自动处理接口报错情况, 默认true.
 * @return {object} - 返回一个promise的实例对象
 */
export function HJPromise({
                              url = null,
                              urlType = null,
                              domain = null,
                              type = HttpMethod.GET,
                              data = null,
                              onUpload = null,
                              onDownload = null,
                              cancel = null,
                              timeout = config.timeout,
                              closeTips = false,
                              cache = false,
                              handleError = true,
                              contentType = true
                          }) {
    var getData;
    var postData;
    var cancelToken;
    var crossDomain = false;
    var promPage = location.pathname;
    if (isEmpty(url)) {
        return Promise.resolve();
    }

    if (type === HttpMethod.POST) {
        if (isNotEmpty(data)) {
            if(contentType){
                postData = qs.stringify(data, { allowDots: true });
            }else{
                getData = data;
                // postData = qs.stringify(data, {allowDots: true});
            }
            
        }
    } else {
        getData = data === null ? {} : data;
    }

    // if (promPage === '/') {
    //     getData['operationPage'] = '登录';
    // }
    //
    // if (promPage.indexOf('/main') !== -1) {
    //     if (promPage === '/main') {
    //         getData['operationPage'] = '首页';
    //     } else if (promPage.indexOf('/main/search') !== -1) {
    //         getData['operationPage'] = '搜索';
    //     } else if (promPage.indexOf('/main/detail/network') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情网络借贷';
    //     } else if (promPage.indexOf('/main/detail/trading') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情交易场所';
    //     } else if (promPage.indexOf('/main/detail/private') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情私募基金';
    //     } else if (promPage.indexOf('/main/detail/emerging') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情新兴金融或融资担保或小额贷款';
    //     } else if (promPage.indexOf('/main/detail/problem') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情问题平台';
    //     } else if (promPage.indexOf('/main/detail/black') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情黑名单';
    //     } else if (promPage.indexOf('/main/detail/other') !== -1) {
    //         getData['operationPage'] = '企业页面'; // '详情其他';
    //     } else if (promPage.indexOf('/main/userContent/attention') !== -1) {
    //         getData['operationPage'] = '个人中心';
    //     } else if (promPage.indexOf('/main/userContent/blackList') !== -1) {
    //         getData['operationPage'] = '个人中心';
    //     } else if (promPage.indexOf('/main/userContent/report') !== -1) {
    //         getData['operationPage'] = '个人中心';
    //     }
    // }

    if (isNotEmpty(cancel)) {
        cancelToken = new axios.CancelToken(cancel);
    }

    if (!cache) {
        url += '?t=' + new Date().getTime();
    }

    showLoading(type, url);

    var promise = new Promise(function (resolve, reject) {
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        // if(!contentType){
        //     axios.defaults.headers.common['Accept'] = 'application/x-www-form-urlencoded';
        // }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        var httpRequest = axios({
            method: type,
            baseURL: config.server.api,
            url: url,
            timeout: timeout,
            params: getData,
            data: postData,
            withCredentials: crossDomain,
            onUploadProgress: onUpload,
            onDownloadProgress: onDownload,
            cancelToken: cancelToken
        }).then(function (response) {
            hideLoading();
            if (isBlank(response.data)) {
                if (handleError) {
                    console.error('网络异常, 请稍后再试');
                }
                reject(response);
            } else {
                var responseData = response.data;
                if (isString(responseData)) {
                    try {
                        responseData = JSON.parse(responseData);
                    } catch (e) {
                        try {
                            if (urlType) {// 仅仅针对外网搜狐api获取客户端ip使用
                                responseData = JSON.parse(responseData.split('=')[1].split(';')[0]);
                            } else {
                                // responseData = eval('(' + responseData + ')');
                            }

                        } catch (e) {
                            if (handleError) {
                                console.error('数据异常');
                            }
                            reject(e);
                            return;
                        }
                    }
                }
                if (!urlType) {
                    if (responseData.statusCode === '0000' || responseData.statusCode === 403) {
                        resolve(responseData);
                    } else if (responseData.statusCode === '2000') {
                        browserHistory.push('/');
                    } else {
                        reject(responseData);
                        if (handleError) {
                            if (!closeTips) {
                                console.error(responseData.msg);
                            }
                        }
                    }
                } else {
                    resolve(responseData);
                }
            }
        }).catch(function (error) {
            hideLoading();
            // 服务端返回的异常
            if (error.response) {
                if (handleError) {
                    if (!urlType) {
                        // Tip.error(error.response.data.msg);
                    } else {
                        // Tip.error('这不是一个有效的请求地址');
                    }

                }
                reject(error.response);
                // 浏览器抛出的异常, 不同浏览器可能有不同的行为
            } else {
                if (handleError) {
                    if (!urlType) {
                        setTimeout(() => {
                            // Tip.error('网络异常, 请稍后再试');
                        }, 1000);
                    }
                }
                reject(error);
            }
        });
    });

    return promise;
}

export function GetUserLog(data) {
    // HJPromise({
    //     url: '/userLog/save.do',
    //     data: {
    //         page: data.page, // 页面类型
    //         operation: data.operation, // 使用日志
    //         detail: data.detail// 详情记录
    //     }
    // }).then((response) => {
    //     // TODO
    // });
}

export function DownLoadIframe(url) {
    let getIframeDom = document.getElementById('iframe_down');
    if (getIframeDom === null) {
        let iframe = document.createElement('iframe');
        iframe.id = 'iframe_down';
        document.body.appendChild(iframe);
        iframe.src = url;
    } else {
        getIframeDom.src = url;
    }
}

/**
 * 根据url判断是哪个页面
 * @return {[type]} [description]
 */
export function GetPageByUrl() {
    let promPage = location.pathname;
    let pageInfo = '';
    if (promPage === '/') {
        pageInfo = '登录';
    }

    if (promPage.indexOf('/main') !== -1) {
        if (promPage === '/main/overall') {
            pageInfo = '首页';
        } else if (promPage.indexOf('/main/search') !== -1) {
            pageInfo = '搜索';
        } else if (promPage.indexOf('/main/detail') !== -1) {
            pageInfo = '企业页面'; // '企业页面';
        } else if (promPage.indexOf('/main/userContent/attention') !== -1) {
            pageInfo = '用户中心我的关注';
        } else if (promPage.indexOf('/main/userContent/blackList') !== -1) {
            pageInfo = '用户中心我的黑名单';
        } else if (promPage.indexOf('/main/userContent/report') !== -1) {
            pageInfo = '用户中心我的报告';
        }else if(promPage.indexOf('/main/analysis') !== -1){
            pageInfo = '智能检索分析';
        }else if(promPage.indexOf('/main/specialEvent') !== -1){
            pageInfo = '特征事件预警';
        }else if(promPage.indexOf('/main/mistakeRule') !== -1){
            pageInfo = '企业违规预警';
        }else if(promPage.indexOf('/main/monitor') !== -1){
            pageInfo = '重点企业实时监控';
        }
    }
    return pageInfo;
}

function showLoading(method, url) {
    if (method === HttpMethod.POST) {
        emitter.emit(Event.SHOW_LOADING);
    }
}

function hideLoading() {
    emitter.emit(Event.HIDE_LOADING);
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
            //  throw reason;
        })
    );
};