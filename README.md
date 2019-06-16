### performanceView --- 迷你性能检测工具

```javascript
	import { PerformanceView, showPerformanceInfo } from performanceView;
    // 自测性能
    // 注意start和end方法参数必须相同，即使为空
    const pv = new PerformanceView();
    pv.start('案例1');
    setTimeout(() => {
    	pv.end('案例1');
    }, 1000);
    // 查看性能相关信息
    showPerformanceInfo();
```