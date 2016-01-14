
(function () {
    //时间
    
    var dateHelper = {
        DateAddDay: function (date, daycount) {
            intValue = date.getTime();
            intValue += daycount * (24 * 3600 * 1000);
            return new Date(intValue);
        },

        //计算天数差的函数，通用
        DateDiff: function (sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式
            iDays = parseInt(Math.abs(sDate1 - sDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
            return iDays
        },
        GetLocalTime: function (dateText) {
            dateText = dateText.replace("/Date(", "").replace(")/", "");
            //返回 2014年5月26日 下午12:00
            //return new Date(parseInt(dateText) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            //返回 2014年5月26日 下午12:0
            //return new Date(parseInt(dateText) * 1000).toLocaleString().substr(0, 17);
            //返回 2014-5-26 12:00:29
            return new Date(parseInt(dateText));
        },
        DateFormat: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(),    //day
                "h+": date.getHours(),   //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
                "S": date.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        },
    };
    
    //处理工厂
    var handlerFactory = {

        //产品事件处理
        getProductEventHandler: function (opt) {
            var handler = {};
            handler.opt = opt;
            handler.handle = function () {
                var categories = []; var categoriesMap = {};
                var diff = Stat.dateHelp.DateDiff(opt.endDate, opt.startDate);
                for (var d = 0; d <= diff; d++) {
                    categories.push("" + Stat.dateHelp.DateFormat(Stat.dateHelp.DateAddDay(opt.startDate, d),"yyyyMMdd"));
                    categoriesMap["" + Stat.dateHelp.DateFormat(Stat.dateHelp.DateAddDay(opt.startDate, d),"yyyyMMdd")] = d;
                }

                var ProductEventList = this.opt.data;
                var eventCountMap = {};
                for (var j = 0; j < ProductEventList.length; j++) {

                    var itemValue = "" + Stat.dateHelp.DateFormat(new Date(ProductEventList[j].Time),"yyyyMMdd");
                    eventCountMap[itemValue] = eventCountMap[itemValue] == null ? 1 : eventCountMap[itemValue] + 1;
                    var eventcount = eventCountMap[itemValue];
                    var brstr = [];
                    while (eventcount > 1) {
                        brstr.push("<br/>");
                        eventcount--;
                    }

                    var item = {
                        color: this.getEventTypeColor(ProductEventList[j].Type),            //线的颜色，定义为红色
                        dashStyle: ProductEventList[j].Milepost == 1 ? 'solid' : 'dash',//标示线的样式，默认是solid（实线），这里定义为长虚线
                        value: categoriesMap[itemValue],                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                        width: ProductEventList[j].Importance * 2,
                        label: {
                            useHTML: true,
                            rotation: 0,
                            text: brstr.join('') + '<small style="color:' + this.getEventTypeColor(ProductEventList[j].Type) + '">' + (ProductEventList[j].Milepost == 1 ? '<里程碑>&nbsp;' : '') + ProductEventList[j].Name + '</small>',
                        },

                    };
                    eventPlotLines.push(item);
                }

                return eventPlotLines;
            };
            handler.getEventTypeColor = function (type) {
                switch (type) {
                    case 1: return "blue";
                    case 2: return "green";
                    case 3: return "orange";
                    case 4: return "red";
                    case 5: return "gley";
                    case 6: return "yellow";
                    default: return "black";
                }
            };

            return handler;
        }
    };
    
    //主要结构体
    var prototype = {
        dateHelp: dateHelper,
        handlerFactory: handlerFactory,
        //画报表
        charts: function (opt) {
            //opt参数：elementId, series, title, data, startDate, endDate, xPlotLinesHandler, yText
            var xPlotLines = [];
            

            var categories = []; var categoriesMap = {};
            var diff = Stat.dateHelp.DateDiff(opt.endDate, opt.startDate);
            for (var d = 0; d <= diff; d++) {
                categories.push("" + Stat.dateHelp.DateFormat(Stat.dateHelp.DateAddDay(opt.startDate, d), "yyyyMMdd"));
                categoriesMap["" + Stat.dateHelp.DateFormat(Stat.dateHelp.DateAddDay(opt.startDate, d), "yyyyMMdd")] = d;
            }

            if (opt.xPlotLinesHandler != null) {
                xPlotLines = opt.xPlotLinesHandler.handle();
            }
            
            var c = $(opt.elementId).highcharts({
                chart: {
                    type: 'line',
                    //alignTicks: false
                },
                title: {
                    text: opt.title
                },
                subtitle: {
                    text: '用户指标'
                },

                xAxis: {
                    //type: 'datetime',
                    categories: categories,
                    //tickmarkPlacement: 'on',
                    plotLines: xPlotLines
                },
                yAxis: {
                    title: {
                        text: opt.yText
                    },
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    },
                },
                tooltip: {

                    shared: true,
                    useHTML: true,
                    headerFormat: '<small>{point.key}</small><table>',
                    pointFormat: '<tr><td style="color:{series.color}">{series.name}:&nbsp;</td><td style="text-align:right"><b>{point.y}</b></td>',
                    footerFormat: '</table>',
                },

                plotOptions: {
                    line: {
                        //pointStart: data.StartDateCode,
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },

                series: opt.series
            });
            
            return c;
        },


    };
    
    var fn = function () { };
    fn.prototype = prototype;
    window.Stat = new fn();
})();