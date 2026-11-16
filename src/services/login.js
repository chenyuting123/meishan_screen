import { HttpMethod } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

/* 登录
 * GET请求
*/
export function login(data) {
    return  HiggsPromise({
        url: '/api/v1.0/user/login.do',
        type: HttpMethod.POST,
        data: data
    });

}

/* 登出
 * GET请求
*/
export function logout(data) {
    return  HiggsPromise({
        url: '/api/v1.0/user/logout.do',
        type: HttpMethod.GET,
        data: data
    });

}

/* 单点登录
 * POST请求
*/
export function ssoLogin(data) {
    return  HiggsPromise({
        url: '/api/v1.0/user/sso/login.do',
        type: HttpMethod.POST,
        data: data
    });

}