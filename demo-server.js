/**
 * 本地演示服务：静态资源 + Mock API（保证中间地图/图表可出数）
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8001;
const ROOT = path.join(__dirname, 'build');

const districts = [
  { region: '东坡区', lng: 103.722, lat: 30.057, high: 86 },
  { region: '彭山区', lng: 103.8205, lat: 30.2627, high: 52 },
  { region: '仁寿县', lng: 104.2276, lat: 29.9574, high: 74 },
  { region: '洪雅县', lng: 103.2491, lat: 29.723, high: 41 },
  { region: '丹棱县', lng: 103.464, lat: 30.011, high: 28 },
  { region: '青神县', lng: 103.8152, lat: 29.8062, high: 35 }
];

const industries = ['私募基金', '小额贷款', '融资担保', '网络借贷', '交易场所', '新兴金融'];
const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];

function ok(data) {
  return JSON.stringify({
    statusCode: '0000',
    message: '成功',
    data,
    content: data
  });
}

function company(i, risk) {
  return {
    id: String(1000 + i),
    companyId: String(1000 + i),
    companyName: ['眉山兴融资本', '东坡小贷', '青神担保', '彭山金服', '仁寿网贷', '洪雅基金'][i % 6] + (i + 1),
    industry: industries[i % industries.length],
    riskLevel: risk || ['高危', '中危', '低危'][i % 3],
    riskIndex: (80 - i * 3.2).toFixed(2),
    area: districts[i % districts.length].region,
    city: '眉山市',
    province: '四川省',
    updateTime: '2026-03-12',
    companyType: industries[i % industries.length],
    highCompany: 20 + i * 3
  };
}

function latitudeData() {
  const list = [];
  // 全国/省级坐标
  list.push({ province: '四川省', area: '四川省', longitude: 104.066, latitude: 30.572 });
  list.push({ province: '四川省', area: '眉山市', longitude: 103.848, latitude: 30.077 });
  districts.forEach((d) => {
    list.push({
      province: '四川省',
      area: d.region,
      longitude: d.lng,
      latitude: d.lat
    });
  });
  // 兼容部分逻辑用「省-省」
  ['浙江省', '北京市', '上海市', '广东省', '重庆市'].forEach((p, i) => {
    list.push({ province: p, area: p, longitude: 116 + i, latitude: 30 + i * 0.3 });
  });
  return list;
}

function scatterByDistrict() {
  return districts.map((d, i) => ({
    region: d.region,
    highCompany: d.high,
    monitorRegion: d.region,
    highCollect: Math.round(d.high * 0.6),
    monitorCompany: 120 + i * 18,
    changeHighCompany: 3 + (i % 4),
    changeMonitorCompany: 5 + (i % 3)
  }));
}

function mockFor(pathname) {
  // 地图经纬度
  if (pathname.includes('longi/Latitude') || pathname.includes('Latitude.do')) {
    return ok(latitudeData());
  }

  // 地图散点
  if (
    pathname.includes('mapCountry.do') ||
    pathname.includes('mapProvince.do') ||
    pathname.includes('mapCity.do') ||
    pathname.includes('mapArea.do')
  ) {
    return ok(scatterByDistrict());
  }

  if (pathname.includes('findInvestmentFlowByInvestedProvince')) {
    return ok(
      districts.map((d, i) => ({
        investProvince: d.region,
        investedProvince: '眉山市',
        companyCount: 10 + i * 4
      }))
    );
  }

  // 总体分析 / 顶部三圆指标
  if (pathname.includes('findIndexTotalInfo')) {
    return ok({
      date: '2026-03',
      avgRiskIndex: 62.8,
      totalRegionCount: 6,
      totalCompanyCount: 1286,
      monthAddCompanyCount: 37,
      highRiskCompanyCount: 316,
      ruleBreakRiskCompanyCount: 184,
      featureRiskCompanyCount: 97,
      focusOnCompanyCount: 156,
      blackCompanyCount: 86,
      monthAddHighRiskCompanyCount: 12,
      monthAddRuleBreakRiskCompanyCount: 8,
      addFeatureRiskCompanyCount: 5,
      monthAddFocusOnCompanyCount: 9,
      monthAddBlackCompanyCount: 3
    });
  }

  // 本月处理状态
  if (pathname.includes('findDealStatusCount')) {
    return ok({
      lookOverCount: 42,
      focusCount: 35,
      exceptCount: 28,
      dealedCount: 19
    });
  }

  // 发展趋势气泡图
  if (pathname.includes('findNewEcoDevelopTrend')) {
    return ok(
      [2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year, i) => ({
        year: String(year),
        companyCount: 680 + i * 95,
        totalRegAmount: 12 + i * 3.5,
        ecdemicCompanyCount: 40 + i * 8
      }))
    );
  }

  // 风险走势
  if (pathname.includes('findLocalRiskTrend') || pathname.includes('findCountryRiskTrend')) {
    return ok(
      months.map((month, i) => ({
        month,
        localAvgRiskIndex: 52 + i * 1.8,
        countryAvgRiskIndex: 48 + i * 1.2
      }))
    );
  }

  // 跨区域风险
  if (pathname.includes('findCrossRegionTrend')) {
    return ok(
      months.map((month, i) => ({
        month,
        companyCount: 40 + i * 3,
        highRiskCompanyCount: 18 + i * 2,
        outHighRiskCompanyCount: 18 + i * 2,
        inHighRiskCompanyCount: 12 + i * 1.5,
        outCompanyCount: 40 + i * 3,
        inCompanyCount: 28 + i * 2
      }))
    );
  }

  // 风险分类 / 区域 top
  if (pathname.includes('findCompanyCountGroupByRegion')) {
    return ok(
      districts
        .slice()
        .sort((a, b) => b.high - a.high)
        .map((d) => ({
          region: d.region,
          highCompany: d.high,
          proportion: +(d.high / 316).toFixed(2),
          name: d.region,
          value: d.high,
          count: d.high
        }))
    );
  }

  // 高危行业分布
  if (pathname.includes('findHighRiskCountGroupByIndustry')) {
    return ok(
      industries.map((industry, i) => ({
        industry,
        highCompany: 28 + i * 11,
        k: industry,
        v: 28 + i * 11,
        name: industry,
        value: 28 + i * 11
      }))
    );
  }

  // 区县风险等级
  if (pathname.includes('findCountGroupByRiskLevel') || pathname.includes('findRiskCount')) {
    if (pathname.includes('findCountGroupByRiskLevel')) {
      return ok({
        focusOn: 156,
        highCompany: 316,
        monitorCompany: 1286,
        sustainMonitor: 203
      });
    }
    return ok({
      ruleBreakRiskCompanyCount: 184,
      ruleBreakRiskCompanyRatio: 0.14,
      featureRiskCompanyCount: 97,
      featureRiskCompanyRatio: 0.08,
      focusOnCompanyCount: 156,
      focusOnCompanyRatio: 0.12
    });
  }

  // 企业列表
  if (
    pathname.includes('blackList') ||
    pathname.includes('findIndexCompanyPage') ||
    pathname.includes('high/company') ||
    pathname.includes('query/')
  ) {
    const items = Array.from({ length: 8 }, (_, i) => company(i, pathname.includes('black') ? '黑名单' : '高危'));
    return ok({ items, totalCount: 86, list: items, content: items });
  }

  if (pathname.includes('login')) {
    return ok({
      id: 'demo-001',
      name: '眉山演示账号',
      province: '四川省',
      city: '眉山市',
      area: '',
      token: 'demo-token'
    });
  }

  if (pathname.includes('provinces')) {
    return ok([{ name: '四川省', value: '四川省' }, { name: '全国', value: '全国' }]);
  }
  if (pathname.includes('citys')) {
    return ok([{ name: '眉山市', value: '眉山市' }]);
  }
  if (pathname.includes('areas')) {
    return ok(districts.map((d) => ({ name: d.region, value: d.region })));
  }

  return ok([]);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json'
};

function injectDemoOverrides(html) {
  const cssPath = path.join(__dirname, 'demo-overrides.css');
  const jsPath = path.join(__dirname, 'demo-overrides.js');
  let css = '';
  let js = '';
  try { css = fs.readFileSync(cssPath, 'utf8'); } catch (e) {}
  try { js = fs.readFileSync(jsPath, 'utf8'); } catch (e) {}
  const inject = `\n<style>\n${css}\n</style>\n<script>\n${js}\n</script>\n`;
  if (html.indexOf('</head>') !== -1) {
    return html.replace('</head>', inject + '</head>');
  }
  return html + inject;
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.html') {
      let html = buf.toString('utf8');
      html = injectDemoOverrides(html);
      res.writeHead(200, { 'Content-Type': mime[ext] });
      res.end(html);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname || '/');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(mockFor(pathname));
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(res, filePath);
      return;
    }
    sendFile(res, path.join(ROOT, 'index.html'));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Demo server ready: http://127.0.0.1:' + PORT);
});
