/*! kibana - v3.0.0m3pre - 2013-09-15
 * Copyright (c) 2013 Rashid Khan; Licensed Apache License */

define("panels/histogram/timeSeries",["underscore","kbn"],function(a,b){function c(a){return parseInt(a,10)}function d(a){return 1e3*Math.floor(a.getTime()/1e3)}var e={};return e.ZeroFilled=function(e){e=a.defaults(e,{interval:"10m",start_date:null,end_date:null,fill_style:"minimal"}),this.interval_ms=1e3*c(b.interval_to_seconds(e.interval)),this._data={},this.start_time=e.start_date&&d(e.start_date),this.end_time=e.end_date&&d(e.end_date),this.opts=e},e.ZeroFilled.prototype.addValue=function(b,e){b=b instanceof Date?d(b):c(b),isNaN(b)||(this._data[b]=a.isUndefined(e)?0:e),this._cached_times=null},e.ZeroFilled.prototype.getOrderedTimes=function(b){var d=a.map(a.keys(this._data),c);return a.isArray(b)&&(d=d.concat(b)),a.uniq(d.sort(),!0)},e.ZeroFilled.prototype.getFlotPairs=function(b){var c,d,e=this.getOrderedTimes(b);return c="all"===this.opts.fill_style?this._getAllFlotPairs:this._getMinFlotPairs,d=a.reduce(e,c,[],this),this.start_time&&(0===d.length||d[0][0]>this.start_time)&&d.unshift([this.start_time,null]),this.end_time&&(0===d.length||d[d.length-1][0]<this.end_time)&&d.push([this.end_time,null]),d},e.ZeroFilled.prototype._getMinFlotPairs=function(a,b,c,d){var e,f,g,h;return c>0&&(g=d[c-1],h=b-this.interval_ms,h>g&&a.push([h,0])),a.push([b,this._data[b]||0]),d.length>c&&(e=d[c+1],f=b+this.interval_ms,e>f&&a.push([f,0])),a},e.ZeroFilled.prototype._getAllFlotPairs=function(a,b,c,d){var e,f;for(a.push([d[c],this._data[d[c]]||0]),e=d[c+1],f=d[c]+this.interval_ms;d.length>c&&e>f;f+=this.interval_ms)a.push([f,0]);return a},e}),function(a){function b(b){function c(a){o.active&&(j(a),b.getPlaceholder().trigger("plotselecting",[f()]))}function d(b){1==b.which&&(document.body.focus(),void 0!==document.onselectstart&&null==p.onselectstart&&(p.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!==document.ondrag&&null==p.ondrag&&(p.ondrag=document.ondrag,document.ondrag=function(){return!1}),i(o.first,b),o.active=!0,q=function(a){e(a)},a(document).one("mouseup",q))}function e(a){return q=null,void 0!==document.onselectstart&&(document.onselectstart=p.onselectstart),void 0!==document.ondrag&&(document.ondrag=p.ondrag),o.active=!1,j(a),n()?g():(b.getPlaceholder().trigger("plotunselected",[]),b.getPlaceholder().trigger("plotselecting",[null])),!1}function f(){if(!n())return null;if(!o.show)return null;var c={},d=o.first,e=o.second;return a.each(b.getAxes(),function(a,b){if(b.used){var f=b.c2p(d[b.direction]),g=b.c2p(e[b.direction]);c[a]={from:Math.min(f,g),to:Math.max(f,g)}}}),c}function g(){var a=f();b.getPlaceholder().trigger("plotselected",[a]),a.xaxis&&a.yaxis&&b.getPlaceholder().trigger("selected",[{x1:a.xaxis.from,y1:a.yaxis.from,x2:a.xaxis.to,y2:a.yaxis.to}])}function h(a,b,c){return a>b?a:b>c?c:b}function i(a,c){var d=b.getOptions(),e=b.getPlaceholder().offset(),f=b.getPlotOffset();a.x=h(0,c.pageX-e.left-f.left,b.width()),a.y=h(0,c.pageY-e.top-f.top,b.height()),"y"==d.selection.mode&&(a.x=a==o.first?0:b.width()),"x"==d.selection.mode&&(a.y=a==o.first?0:b.height())}function j(a){null!=a.pageX&&(i(o.second,a),n()?(o.show=!0,b.triggerRedrawOverlay()):k(!0))}function k(a){o.show&&(o.show=!1,b.triggerRedrawOverlay(),a||b.getPlaceholder().trigger("plotunselected",[]))}function l(a,c){var d,e,f,g,h=b.getAxes();for(var i in h)if(d=h[i],d.direction==c&&(g=c+d.n+"axis",a[g]||1!=d.n||(g=c+"axis"),a[g])){e=a[g].from,f=a[g].to;break}if(a[g]||(d="x"==c?b.getXAxes()[0]:b.getYAxes()[0],e=a[c+"1"],f=a[c+"2"]),null!=e&&null!=f&&e>f){var j=e;e=f,f=j}return{from:e,to:f,axis:d}}function m(a,c){var d,e=b.getOptions();"y"==e.selection.mode?(o.first.x=0,o.second.x=b.width()):(d=l(a,"x"),o.first.x=d.axis.p2c(d.from),o.second.x=d.axis.p2c(d.to)),"x"==e.selection.mode?(o.first.y=0,o.second.y=b.height()):(d=l(a,"y"),o.first.y=d.axis.p2c(d.from),o.second.y=d.axis.p2c(d.to)),o.show=!0,b.triggerRedrawOverlay(),!c&&n()&&g()}function n(){var a=b.getOptions().selection.minSize;return Math.abs(o.second.x-o.first.x)>=a&&Math.abs(o.second.y-o.first.y)>=a}var o={first:{x:-1,y:-1},second:{x:-1,y:-1},show:!1,active:!1},p={},q=null;b.clearSelection=k,b.setSelection=m,b.getSelection=f,b.hooks.bindEvents.push(function(a,b){var e=a.getOptions();null!=e.selection.mode&&(b.mousemove(c),b.mousedown(d))}),b.hooks.drawOverlay.push(function(b,c){if(o.show&&n()){var d=b.getPlotOffset(),e=b.getOptions();c.save(),c.translate(d.left,d.top);var f=a.color.parse(e.selection.color);c.strokeStyle=f.scale("a",.8).toString(),c.lineWidth=1,c.lineJoin=e.selection.shape,c.fillStyle=f.scale("a",.4).toString();var g=Math.min(o.first.x,o.second.x)+.5,h=Math.min(o.first.y,o.second.y)+.5,i=Math.abs(o.second.x-o.first.x)-1,j=Math.abs(o.second.y-o.first.y)-1;c.fillRect(g,h,i,j),c.strokeRect(g,h,i,j),c.restore()}}),b.hooks.shutdown.push(function(b,e){e.unbind("mousemove",c),e.unbind("mousedown",d),q&&a(document).unbind("mouseup",q)})}a.plot.plugins.push({init:b,options:{selection:{mode:null,color:"#e8cfac",shape:"round",minSize:5}},name:"selection",version:"1.1"})}(jQuery),define("jquery.flot.selection",function(){}),function(a){function b(a,b){return b*Math.floor(a/b)}function c(a,b,c,d){if("function"==typeof a.strftime)return a.strftime(b);var e=function(a,b){return a=""+a,b=""+(null==b?"0":b),1==a.length?b+a:a},f=[],g=!1,h=a.getHours(),i=12>h;null==c&&(c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]),null==d&&(d=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]);var j;j=h>12?h-12:0==h?12:h;for(var k=0;k<b.length;++k){var l=b.charAt(k);if(g){switch(l){case"a":l=""+d[a.getDay()];break;case"b":l=""+c[a.getMonth()];break;case"d":l=e(a.getDate());break;case"e":l=e(a.getDate()," ");break;case"h":case"H":l=e(h);break;case"I":l=e(j);break;case"l":l=e(j," ");break;case"m":l=e(a.getMonth()+1);break;case"M":l=e(a.getMinutes());break;case"q":l=""+(Math.floor(a.getMonth()/3)+1);break;case"S":l=e(a.getSeconds());break;case"y":l=e(a.getFullYear()%100);break;case"Y":l=""+a.getFullYear();break;case"p":l=i?"am":"pm";break;case"P":l=i?"AM":"PM";break;case"w":l=""+a.getDay()}f.push(l),g=!1}else"%"==l?g=!0:f.push(l)}return f.join("")}function d(a){function b(a,b,c,d){a[b]=function(){return c[d].apply(c,arguments)}}var c={date:a};void 0!=a.strftime&&b(c,"strftime",a,"strftime"),b(c,"getTime",a,"getTime"),b(c,"setTime",a,"setTime");for(var d=["Date","Day","FullYear","Hours","Milliseconds","Minutes","Month","Seconds"],e=0;e<d.length;e++)b(c,"get"+d[e],a,"getUTC"+d[e]),b(c,"set"+d[e],a,"setUTC"+d[e]);return c}function e(a,b){if("browser"==b.timezone)return new Date(a);if(b.timezone&&"utc"!=b.timezone){if("undefined"!=typeof timezoneJS&&"undefined"!=typeof timezoneJS.Date){var c=new timezoneJS.Date;return c.setTimezone(b.timezone),c.setTime(a),c}return d(new Date(a))}return d(new Date(a))}function f(d){d.hooks.processOptions.push(function(d){a.each(d.getAxes(),function(a,d){var f=d.options;"time"==f.mode&&(d.tickGenerator=function(a){var c=[],d=e(a.min,f),g=0,i=f.tickSize&&"quarter"===f.tickSize[1]||f.minTickSize&&"quarter"===f.minTickSize[1]?k:j;null!=f.minTickSize&&(g="number"==typeof f.tickSize?f.tickSize:f.minTickSize[0]*h[f.minTickSize[1]]);for(var l=0;l<i.length-1&&!(a.delta<(i[l][0]*h[i[l][1]]+i[l+1][0]*h[i[l+1][1]])/2&&i[l][0]*h[i[l][1]]>=g);++l);var m=i[l][0],n=i[l][1];if("year"==n){if(null!=f.minTickSize&&"year"==f.minTickSize[1])m=Math.floor(f.minTickSize[0]);else{var o=Math.pow(10,Math.floor(Math.log(a.delta/h.year)/Math.LN10)),p=a.delta/h.year/o;m=1.5>p?1:3>p?2:7.5>p?5:10,m*=o}1>m&&(m=1)}a.tickSize=f.tickSize||[m,n];var q=a.tickSize[0];n=a.tickSize[1];var r=q*h[n];"second"==n?d.setSeconds(b(d.getSeconds(),q)):"minute"==n?d.setMinutes(b(d.getMinutes(),q)):"hour"==n?d.setHours(b(d.getHours(),q)):"month"==n?d.setMonth(b(d.getMonth(),q)):"quarter"==n?d.setMonth(3*b(d.getMonth()/3,q)):"year"==n&&d.setFullYear(b(d.getFullYear(),q)),d.setMilliseconds(0),r>=h.minute&&d.setSeconds(0),r>=h.hour&&d.setMinutes(0),r>=h.day&&d.setHours(0),r>=4*h.day&&d.setDate(1),r>=2*h.month&&d.setMonth(b(d.getMonth(),3)),r>=2*h.quarter&&d.setMonth(b(d.getMonth(),6)),r>=h.year&&d.setMonth(0);var s,t=0,u=Number.NaN;do if(s=u,u=d.getTime(),c.push(u),"month"==n||"quarter"==n)if(1>q){d.setDate(1);var v=d.getTime();d.setMonth(d.getMonth()+("quarter"==n?3:1));var w=d.getTime();d.setTime(u+t*h.hour+(w-v)*q),t=d.getHours(),d.setHours(0)}else d.setMonth(d.getMonth()+q*("quarter"==n?3:1));else"year"==n?d.setFullYear(d.getFullYear()+q):d.setTime(u+r);while(u<a.max&&u!=s);return c},d.tickFormatter=function(a,b){var d=e(a,b.options);if(null!=f.timeformat)return c(d,f.timeformat,f.monthNames,f.dayNames);var g,i=b.options.tickSize&&"quarter"==b.options.tickSize[1]||b.options.minTickSize&&"quarter"==b.options.minTickSize[1],j=b.tickSize[0]*h[b.tickSize[1]],k=b.max-b.min,l=f.twelveHourClock?" %p":"",m=f.twelveHourClock?"%I":"%H";g=j<h.minute?m+":%M:%S"+l:j<h.day?k<2*h.day?m+":%M"+l:"%b %d "+m+":%M"+l:j<h.month?"%b %d":i&&j<h.quarter||!i&&j<h.year?k<h.year?"%b":"%b %Y":i&&j<h.year?k<h.year?"Q%q":"Q%q %Y":"%Y";var n=c(d,g,f.monthNames,f.dayNames);return n})})})}var g={xaxis:{timezone:null,timeformat:null,twelveHourClock:!1,monthNames:null}},h={second:1e3,minute:6e4,hour:36e5,day:864e5,month:2592e6,quarter:7776e6,year:1e3*525949.2*60},i=[[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[.25,"month"],[.5,"month"],[1,"month"],[2,"month"]],j=i.concat([[3,"month"],[6,"month"],[1,"year"]]),k=i.concat([[1,"quarter"],[2,"quarter"],[1,"year"]]);a.plot.plugins.push({init:f,options:g,name:"time",version:"1.0"}),a.plot.formatDate=c}(jQuery),define("jquery.flot.time",function(){}),function(a){function b(a){function b(a,b){for(var c=null,d=0;d<b.length&&a!=b[d];++d)b[d].stack==a.stack&&(c=b[d]);return c}function c(a,c,d){if(null!=c.stack&&c.stack!==!1){var e=b(c,a.getData());if(e){for(var f,g,h,i,j,k,l,m,n=d.pointsize,o=d.points,p=e.datapoints.pointsize,q=e.datapoints.points,r=[],s=c.lines.show,t=c.bars.horizontal,u=n>2&&(t?d.format[2].x:d.format[2].y),v=s&&c.lines.steps,w=!0,x=t?1:0,y=t?0:1,z=0,A=0;;){if(z>=o.length)break;if(l=r.length,null==o[z]){for(m=0;n>m;++m)r.push(o[z+m]);z+=n}else if(A>=q.length){if(!s)for(m=0;n>m;++m)r.push(o[z+m]);z+=n}else if(null==q[A]){for(m=0;n>m;++m)r.push(null);w=!0,A+=p}else{if(f=o[z+x],g=o[z+y],i=q[A+x],j=q[A+y],k=0,f==i){for(m=0;n>m;++m)r.push(o[z+m]);r[l+y]+=j,k=j,z+=n,A+=p}else if(f>i){if(s&&z>0&&null!=o[z-n]){for(h=g+(o[z-n+y]-g)*(i-f)/(o[z-n+x]-f),r.push(i),r.push(h+j),m=2;n>m;++m)r.push(o[z+m]);k=j}A+=p}else{if(w&&s){z+=n;continue}for(m=0;n>m;++m)r.push(o[z+m]);s&&A>0&&null!=q[A-p]&&(k=j+(q[A-p+y]-j)*(f-i)/(q[A-p+x]-i)),r[l+y]+=k,z+=n}w=!1,l!=r.length&&u&&(r[l+2]+=k)}if(v&&l!=r.length&&l>0&&null!=r[l]&&r[l]!=r[l-n]&&r[l+1]!=r[l-n+1]){for(m=0;n>m;++m)r[l+n+m]=r[l+m];r[l+1]=r[l-n+1]}}d.points=r}}}a.hooks.processDatapoints.push(c)}var c={series:{stack:null}};a.plot.plugins.push({init:b,options:c,name:"stack",version:"1.2"})}(jQuery),define("jquery.flot.stack",function(){}),function(a){function b(a){function b(a,b,d){if(f||(f=!0,g=c(a.getData())),1==b.stackpercent){var e=d.length;b.percents=[];var h=0,i=1;b.bars&&b.bars.horizontal&&b.bars.horizontal===!0&&(h=1,i=0);for(var j=0;e>j;j++){var k=g[d[j][h]+""];k>0?b.percents.push(100*d[j][i]/k):b.percents.push(0)}}}function c(a){var b=a.length,c={};if(b>0)for(var d=0;b>d;d++)if(a[d].stackpercent){var e=0,f=1;a[d].bars&&a[d].bars.horizontal&&a[d].bars.horizontal===!0&&(e=1,f=0);for(var g=a[d].data.length,h=0;g>h;h++){var i=0;null!=a[d].data[h][1]&&(i=a[d].data[h][f]),c[a[d].data[h][e]+""]?c[a[d].data[h][e]+""]+=i:c[a[d].data[h][e]+""]=i}}return c}function d(a,b,d){if(b.stackpercent){f||(g=c(a.getData()));var h=[],i=0,j=1;b.bars&&b.bars.horizontal&&b.bars.horizontal===!0&&(i=1,j=0);for(var k=0;k<d.points.length;k+=3)e[d.points[k+i]]||(e[d.points[k+i]]=0),h[k+i]=d.points[k+i],h[k+j]=d.points[k+j]+e[d.points[k+i]],h[k+2]=e[d.points[k+i]],e[d.points[k+i]]+=d.points[k+j],g[h[k+i]+""]>0?(h[k+j]=100*h[k+j]/g[h[k+i]+""],h[k+2]=100*h[k+2]/g[h[k+i]+""]):(h[k+j]=0,h[k+2]=0);d.points=h}}var e={},f=!1,g={};a.hooks.processRawData.push(b),a.hooks.processDatapoints.push(d)}var c={series:{stackpercent:null}};a.plot.plugins.push({init:b,options:c,name:"stackpercent",version:"0.1"})}(jQuery),define("jquery.flot.stackpercent",function(){}),define("panels/histogram/module",["angular","app","jquery","underscore","kbn","moment","./timeSeries","jquery.flot","jquery.flot.pie","jquery.flot.selection","jquery.flot.time","jquery.flot.stack","jquery.flot.stackpercent"],function(a,b,c,d,e,f,g){var h=a.module("kibana.panels.histogram",[]);b.useModule(h),h.controller("histogram",["$scope","querySrv","dashboard","filterSrv",function(b,c,h,i){b.panelMeta={editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Stable",description:"A bucketed time series chart of the current query or queries. Uses the Elasticsearch date_histogram facet. If using time stamped indices this panel will query them sequentially to attempt to apply the lighest possible load to your Elasticsearch cluster"};var j={mode:"count",time_field:"@timestamp",queries:{mode:"all",ids:[]},value_field:null,auto_int:!0,resolution:100,interval:"5m",fill:0,linewidth:3,timezone:"browser",spyable:!0,zoomlinks:!0,bars:!0,stack:!0,points:!1,lines:!1,legend:!0,"x-axis":!0,"y-axis":!0,percentage:!1,interactive:!0,tooltip:{value_type:"cumulative",query_as_alias:!1}};d.defaults(b.panel,j),b.init=function(){b.$on("refresh",function(){b.get_data()}),b.get_data()},b.get_time_range=function(){var a=b.range=i.timeRange("min");return a},b.get_interval=function(){var a,c=b.panel.interval;return b.panel.auto_int&&(a=b.get_time_range(),a&&(c=e.secondsToHms(e.calculate_interval(a.from,a.to,b.panel.resolution,0)/1e3))),b.panel.interval=c||"10m",b.panel.interval},b.get_data=function(a,f){if(d.isUndefined(a)&&(a=0),delete b.panel.error,0!==h.indices.length){var j=b.get_time_range(),k=b.get_interval(j);b.panel.auto_int&&(b.panel.interval=e.secondsToHms(e.calculate_interval(j.from,j.to,b.panel.resolution,0)/1e3)),b.panelMeta.loading=!0;var l=b.ejs.Request().indices(h.indices[a]);b.panel.queries.ids=c.idsByMode(b.panel.queries),d.each(b.panel.queries.ids,function(a){var e=b.ejs.FilteredQuery(c.getEjsObj(a),i.getBoolFilter(i.ids)),f=b.ejs.DateHistogramFacet(a);if("count"===b.panel.mode)f=f.field(b.panel.time_field);else{if(d.isNull(b.panel.value_field))return b.panel.error="In "+b.panel.mode+" mode a field must be specified",void 0;f=f.keyField(b.panel.time_field).valueField(b.panel.value_field)}f=f.interval(k).facetFilter(b.ejs.QueryFilter(e)),l=l.facet(f).size(0)}),b.populate_modal(l);var m=l.doSearch();m.then(function(e){if(b.panelMeta.loading=!1,0===a&&(b.hits=0,b.data=[],f=b.query_id=(new Date).getTime()),!d.isUndefined(e.error))return b.panel.error=b.parse_error(e.error),void 0;var i=d.map(d.keys(e.facets),function(a){return parseInt(a,10)});if(b.query_id===f&&0===d.difference(i,b.panel.queries.ids).length){var l,m,n=0;d.each(b.panel.queries.ids,function(f){var h=e.facets[f];d.isUndefined(b.data[n])||0===a?(l=new g.ZeroFilled({interval:k,start_date:j&&j.from,end_date:j&&j.to,fill_style:"minimal"}),m=0):(l=b.data[n].time_series,m=b.data[n].hits),d.each(h.entries,function(a){l.addValue(a.time,a[b.panel.mode]),m+=a.count,b.hits+=a.count}),b.data[n]={info:c.list[f],time_series:l,hits:m},n++}),b.$emit("render"),a<h.indices.length-1&&b.get_data(a+1,f)}})}},b.zoom=function(a){var c=i.timeRange("min"),d=c.to.valueOf()-c.from.valueOf(),e=c.to.valueOf()-d/2,g=e+d*a/2,j=e-d*a/2;if(g>Date.now()&&c.to<Date.now()){var k=g-Date.now();j-=k,g=Date.now()}a>1&&i.removeByType("time"),i.set({type:"time",from:f.utc(j),to:f.utc(g),field:b.panel.time_field}),h.refresh()},b.populate_modal=function(c){b.inspector=a.toJson(JSON.parse(c.toString()),!0)},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")}}]),h.directive("histogramChart",["dashboard","filterSrv",function(b,g){return{restrict:"A",template:"<div></div>",link:function(h,i){function j(){i.css({height:h.panel.height||h.row.height});try{d.each(h.data,function(a){a.label=a.info.alias,a.color=a.info.color})}catch(a){return}var b=1e3*e.interval_to_seconds(h.panel.interval),f=h.panel.stack?!0:null;try{var g={legend:{show:!1},series:{stackpercent:h.panel.stack?h.panel.percentage:!1,stack:h.panel.percentage?null:f,lines:{show:h.panel.lines,fill:h.panel.fill/10,lineWidth:h.panel.linewidth,steps:!1},bars:{show:h.panel.bars,fill:1,barWidth:b/1.8,zero:!1,lineWidth:0},points:{show:h.panel.points,fill:1,fillColor:!1,radius:5},shadowSize:1},yaxis:{show:h.panel["y-axis"],min:0,max:h.panel.percentage&&h.panel.stack?100:null},xaxis:{timezone:h.panel.timezone,show:h.panel["x-axis"],mode:"time",min:d.isUndefined(h.range.from)?null:h.range.from.getTime(),max:d.isUndefined(h.range.to)?null:h.range.to.getTime(),timeformat:k(h.panel.interval),label:"Datetime"},grid:{backgroundColor:null,borderWidth:0,hoverable:!0,color:"#c8c8c8"}};h.panel.interactive&&(g.selection={mode:"x",color:"#666"});var j=[];h.data.length>1&&(j=d.uniq(Array.prototype.concat.apply([],d.map(h.data,function(a){return a.time_series.getOrderedTimes()})).sort(),!0));for(var l=0;l<h.data.length;l++)h.data[l].data=h.data[l].time_series.getFlotPairs(j);h.plot=c.plot(i,h.data,g)}catch(a){i.text(a)}}function k(a){var b=e.interval_to_seconds(a);return b>=2628e3?"%m/%y":b>=86400?"%m/%d/%y":b>=60?"%H:%M<br>%m/%d":"%H:%M:%S"}h.$on("render",function(){j()}),a.element(window).bind("resize",function(){j()});var l=c("<div>");i.bind("plothover",function(a,b,c){var d,g;c?(d=c.series.info.alias||h.panel.tooltip.query_as_alias?'<small style="font-size:0.9em;"><i class="icon-circle" style="color:'+c.series.color+';"></i>'+" "+(c.series.info.alias||c.series.info.query)+"</small><br>":e.query_color_dot(c.series.color,15)+" ",g=h.panel.stack&&"individual"===h.panel.tooltip.value_type?c.datapoint[1]-c.datapoint[2]:c.datapoint[1],l.html(d+g+" @ "+f(c.datapoint[0]).format("MM/DD HH:mm:ss")).place_tt(b.pageX,b.pageY)):l.detach()}),i.bind("plotselected",function(a,c){g.set({type:"time",from:f.utc(c.xaxis.from),to:f.utc(c.xaxis.to),field:h.panel.time_field}),b.refresh()})}}}])});