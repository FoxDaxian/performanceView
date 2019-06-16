const inBrowser = typeof window !== 'undefined';
const regStr = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const _undef = void 0;
const perf = inBrowser && window.performance;
const undefinedMark = 'the start of navigation';
const naviagtionType = {
    normal: 0,
    reload: 1,
    back_forward: 2
};

export function PerformanceView() {
    if (!(this instanceof PerformanceView)) {
        return console.error('PerformanceView is a constructor and should be called with the `new` keyword');
    }
    if (perf) {
        this.startMark = [];
        this.endMark = [];
    }
}
export function showPerformanceInfo() {
    const redirectCount = perf.navigation.redirectCount;
    const { redirectEnd, redirectStart, fetchStart, domainLookupStart, domainLookupEnd, connectStart, connectEnd, responseStart, responseEnd, requestStart, navigationStart, startTime, domComplete, domInteractive, domLoading, loadEventEnd } = performance.timing;
    let naviagtionTypeValue;
    const redirectTime = redirectEnd - redirectStart;
    const checkCacheTime = Math.max(domainLookupStart - fetchStart, 0);
    const dnsTime = domainLookupEnd - domainLookupStart;
    const tcpTime = connectEnd - connectStart;
    const resourceTime = responseEnd - responseStart; // 服务器 缓存 本地资源
    const serverResponseTime = responseStart - requestStart; // 服务端响应时间
    const networkTotalTime = responseEnd - navigationStart || startTime || fetchStart;
    const parseDomTree = domComplete - domInteractive;
    const firstDomBlockShowtime = domLoading - navigationStart;
    const onloadHookTime = loadEventEnd - navigationStart;
    const canActiveTime = domInteractive - navigationStart;
    switch (perf.navigation.type) {
        case naviagtionType.normal:
            naviagtionTypeValue = '常规访问';
            break;
        case naviagtionType.reload:
            naviagtionTypeValue = '刷新访问';
            break;
        case naviagtionType.back_forward:
            naviagtionTypeValue = '后退/前进访问';
            break;
        default:
            naviagtionTypeValue = '其他方式访问';
            break;
    }
}

mixinMainMethods(PerformanceView);
mixinUtils(PerformanceView);

function mixinUtils(P) {
    P.prototype.setStartMark = function (markName) {
        markName = markName === _undef ? undefinedMark : markName;
        this.startMark.push(this.generateRandom(markName));
    }
    P.prototype.setEndMark = function (markName) {
        markName = markName === _undef ? undefinedMark : markName;
        this.endMark.push(this.generateRandom(markName));
    }
    P.prototype.generateRandom = function (markName) {
        return `${markName}_${(Math.random() * Math.random() + '').slice(2)}`;
    }
    P.prototype.convertRegStr = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    P.prototype.getReg = function (markName) { return new RegExp(`^${this.convertRegStr(markName + '')}_`) };
}

function mixinMainMethods(P) {
    P.prototype.start = function (markName) {
        this.setStartMark(markName);
        this.startMark && perf.mark(this.startMark[this.startMark.length - 1]);
    }
    P.prototype.end = function (markName) {
        this.setEndMark(markName);
        markName = markName === _undef ? undefinedMark : markName;
        const startMark = this.startMark.filter(mark => this.getReg(markName).test(mark))[0];
        const endMark = this.endMark.filter(mark => this.getReg(markName).test(mark))[0];
        const measureName = `'${startMark}'至'${endMark}'运行时间`;
        if (!startMark || !endMark) {
            throw new Error('Number of end method mismatch');
        }
        perf.mark(endMark);
        perf.measure(measureName, startMark === undefinedMark ? _undef : startMark, endMark);
        perf.clearMarks(startMark);
        perf.clearMarks(endMark);
        const { startTime, duration } = perf.getEntriesByName(measureName)[0];
        console.log(`%c ${markName}: %c开始时间: ${startTime} 执行了${duration}ms`, 'color:#3d7e9a', 'color: #6f42c1');
    }
}
