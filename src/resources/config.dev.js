import base from './config.base';

export default Object.assign({}, base, {
    server: {
        static: 'http://www.zgcxpj.org',
    //    api: 'http://192.168.30.111:18080/', // http://10.28.100.45:18083/
        apiPort: '8012' // API端口
    }
});