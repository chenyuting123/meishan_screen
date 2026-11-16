/*
* author:TanJun
* describe:manager components routers
* createTime:2018/6/21
* */

// APP入口
export App from '../layouts/app/App';
// 登录
export Login from './login/Login';
// 主入口
export Main from './main/Main';
// 主页
export Home from './home/Home';
// 特征事件预警
export SpecialEvent from './main/specialEvent';
// 企业违规预警
export MistakeRule from './main/mistakeRule';

// 智能检索分析
export Analysis from './main/analysis/Analysis';
export SearchHome from './main/analysis/searchHome/SearchHome';
export Search from './main/analysis/search/Search';
export DetailPage from './main/analysis/detailPage';

// 重点企业监控
export Monitor from './main/monitor/Monitor';
export MonitorHome from './main/monitor/monitorHome/MonitorHome';
// 详情
export Detail from './main/detail/Detail';
// 详情私募
export Private from './main/detail/private/Private';
// 详情交易
export Trading from './main/detail/trading/Trading';
// 网络借贷正常平台
export Network from './main/detail/network/Network';
// 详情新兴金融
export Emerging from './main/detail/emerging/Emerging';
// 黑名单企业
export Black from './main/detail/black/Black';
// 其它企业
export Other from './main/detail/other/Ohter';
// 用户中心
export UserContent from './main/userContent/UserContent';
// 我的关注
export Attention from './main/userContent/attention/Attention';
// 我的黑名单
export BlackList from './main/userContent/blackList/BlackList';
// 我的报告
export Report from './main/userContent/report/Report';
// 我的进程
export Process from './main/userContent/process/Process';
// pdf雷达图
export Radar from './main/pdf/Radar';
// pdf关联方图谱
export Maps from './main/pdf/Maps';
// 404
export NotFound from '../layouts/notFound/NotFound';
// 系统报错
export SystemError from '../layouts/systemError/SystemError';
// 关联方个人信息
export RelatedParDetail from './main/relatedParDetail/RelatedParDetail';

// 跨地区分险分析
export CrossRegion from './main/overall/crossRegion';
// 事件追踪
export EventDetail from './main/overall/eventDetail/EventDetail';
// 提供维数免登陆
export NoLandfall from '../layouts/NoLandfall/index';
export NoLandfallToRiskMonitor from '../layouts/NoLandfall/NoLandfallToRiskMonitor/index';