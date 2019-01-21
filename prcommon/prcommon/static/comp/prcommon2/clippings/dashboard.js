//-----------------------------------------------------------------------------
// Name:    prcommon/clippings/dashboard
// Author:
// Purpose:
// Created: November 2018
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/dashboard.html",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dojox/charting/Chart",
	"dojox/charting/themes/Claro",
	"dojox/charting/themes/Tom",
	"dojox/charting/themes/PrimaryColors",
	"dojox/charting/plot2d/Pie",
	"dojox/charting/plot2d/Lines",
	"dojox/charting/plot2d/Bars",
	"dojox/charting/plot2d/Columns",
	"dojox/charting/plot2d/StackedColumns",
	"dojox/charting/action2d/Tooltip",
	"dojox/charting/action2d/Highlight",
	"dojox/charting/action2d/MoveSlice",
	"dojox/charting/action2d/Magnify",
	"dojox/charting/plot2d/Markers",
	"dojox/charting/widget/SelectableLegend",
	"dojox/charting/axis2d/Default",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/date/daterange",
	"dijit/form/ComboBox",
	"prcommon2/reports/ReportBuilder"
	], function(declare, BaseWidgetAMD, template, ContentPane, BorderContainer, Chart,Claro,Tom,PrimaryColors,Pie,Lines,Bars,Columns,StackedColumns,Tooltip,Highlight,MoveSlice,Magnify,Markers,Legend,Default, utilities2, topic, request, JsonRestStore, JsonRest, Observable,lang, domattr,ItemFileReadStore,domclass,domConstruct){
return declare("prcommon2.clippings.dashboard",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	mode:"add",
	gutters:false,
	constructor: function()
	{
		this._load_call_back = lang.hitch(this, this._load_call);
		this._updatesettings_call_back = lang.hitch(this, this._updatesettings_call);
		//topic.subscribe('/dashboardsettings/update', lang.hitch(this, this._update_dashboard_event));

	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(customerid)
	{
		request.post('/clippings/charting/get_dashboard_chart_data',
				utilities2.make_params({ data : {customerid:this._customerid}})).
				then (this._load_call_back);
	},
	_load_call:function(response)
	{
		if (response.success == "OK")
		{
			for (var i=0; i<response.data.length; i++)
			{
				this.show_charts(response.data[i]);
			}
		}
		else
		{
			alert("Problem loading chart data");
		}
	},	
	show_charts:function(data)
	{
		if (data.chartviewid == 1)
		{
			this._create_pie(data.data.pie, data.windowid, data.title);
		}
		else if (data.chartviewid == 2)
		{
			this._create_lines(data, data.windowid);
		}
		else if (data.chartviewid == 3)
		{
			this._create_columns(data, data.windowid);
		}
	},

	_clear:function()
	{
		this.clear();
	},
	clear:function()
	{
	},
//	_update_dashboard_event:function(data)
//	{
//		var content = data[0];
//		content["customerid"] = PRMAX.utils.settings.cid;
//
//		request.post('/clippings/charting/get_chart_data2',
//			utilities2.make_params({data : content})).
//			then(this._updatesettings_call_back);
//	},
//	_updatesettings_call:function(response)
//	{
//		if ( response.success=="OK")
//		{
//			if (response.data.chartviewid == 1)
//			{
//				this._create_pie(response.data.data.pie, response.data.windowid, response.data.title);
//			}
//			else if (response.data.chartviewid == 2)
//			{
//				this._create_lines(response.data, response.data.windowid);
//			}
//			else if (response.data.chartviewid == 3)
//			{
//				this._create_columns(response.data, response.data.windowid);
//			}
//		}
//	},
	_create_pie:function(data, windowid, title)
	{
		var pie_chart = this["_pieChart_" + windowid ];	
		var chart_node = this["chart_node_" + windowid];
		if (chart_node && chart_node != null)
		{
			domConstruct.empty(chart_node);
		}
		pie_chart = new Chart(chart_node, {
				title: title,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 12pt Arial",
				titleFontColor: "black"
		});
		pie_chart.setTheme(PrimaryColors);
		pie_chart.addPlot("default", {
			type: Pie,
			radius: 70,
			fontColor: "black",
			labelOffset: 0,
			labelStyle: "columns",
			htmlLabels: true,
			font: "normal normal normal 9pt Arial",
			startAngle: -10
		});
		pie_chart.addAxis("x");
		pie_chart.addAxis("y", {min: 0, vertical: true, fixLower: "major",	fixUpper: "major"});
		if (data)
		{
			pie_chart.addSeries(title,data);
		}
		var tooltip = new Tooltip(pie_chart,"default");
		var moveslice = new MoveSlice(pie_chart,"default");
		var magnify = new Magnify(pie_chart, "default", { scale: 1.2 });
		pie_chart.render();
	},
	_create_lines:function(data,windowid)
	{
	
		var lines_chart = this["_linesChart_" + windowid];	
		var chart_node = this["chart_node_" + windowid];
		if (chart_node && chart_node != null)
		{
			domConstruct.empty(chart_node);
		}
		lines_chart = new Chart(chart_node, {
				title: data.title,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 12pt Arial",
				titleFontColor: "black"
		});
		lines_chart.setTheme(PrimaryColors);
		lines_chart.addPlot("default", {
			type: Lines,
			markers: true
		});
		var xAxisLabels = [];
		if (data.dates)
		{
			for (var i = 0; i < data.dates.length; i++) {
				xAxisLabels.push({text: data.dates[i].label, value: data.dates[i].value})
			};
		}
		lines_chart.addAxis("x", {
			labels: xAxisLabels,
			rotation: -90,
			minorTick: {stroke: "black", length: 2, width:1},
			majorTick: {color: "red", length: 4, width:1},
			labelSizeChange:true
		});
		var max = data.maxvalue+1;
		lines_chart.addAxis("y", {
			min: 0,
			max: max,
			vertical: true,
			fixLower: "major",
			fixUpper: "major",
			minorTick: {stroke: "black", length: 2, width:1},
			majorTick: {color: "red", length: 4, width:1}});
		if (data.data)
		{
			for (var key in data.data) {
				lines_chart.addSeries(key,data.data[key], {stroke: {width:1}})
			}
		}
		var tooltip = new Tooltip(lines_chart,"default");

//		var tooltip = new Tooltip(lines_chart,"default",{
//            text: function(chartItem) {
//                console.debug(chartItem);
//                return chartItem.run.data[chartItem.index].descr + "(" + chartItem.y +")";
//            }
//        });
		
		var moveslice = new MoveSlice(lines_chart,"default");
		var magnify = new Magnify(lines_chart, "default", { scale: 4 });
		lines_chart.render();
//		legend = new Legend({chart:lines_chart,  horizontal: false}, legend_node);
	},
	_create_columns:function(data, windowid, title)
	{
	
		var columns_chart = this["_columnsChart_" + windowid];	
		var chart_node = this["chart_node_" + windowid];
/*		var legend = this["_leg_" + windowid];
		var legend_node = this["legend_node_" + windowid];
		var legend_node_name = "legend_node_" + windowid;
		var legend_node_outer = this["legend_node_outer_" + windowid];
		var legend_node_outer_name = "legend_node_outer_" + windowid;
		var legend_view = this["legend_view_" + windowid];
*/
		if (chart_node && chart_node != null)
		{
			domConstruct.empty(chart_node);
//			domConstruct.empty(legend_node);
//			domConstruct.empty(legend_node_outer);
		}
/*		if (legend){}
		else
		{
			if (legend_node_outer)
			{
				var constr = '<div data-dojo-attach-point="'+ legend_node_name +'" style="height:50px"></div>'
				legend_node = domConstruct.place(constr, legend_node_outer, "first");
			
			}
			else
			{
				var constr_outer = '<div data-dojo-attach-point="'+legend_node_outer_name+'" style="height:50px"><div data-dojo-attach-point="'+ legend_node_name +'" style="height:50px"></div></div>'
				legend_node_outer = domConstruct.place(constr_outer, legend_view, "first");
			}
		}
*/
		columns_chart = new Chart(chart_node, {
				title: data.title,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 12pt Arial",
				titleFontColor: "black"
		});
		columns_chart.setTheme(PrimaryColors);
		columns_chart.addPlot("default", {
			type: StackedColumns
		});

		var xAxisLabels = [];
		if (data.dates)
		{
			for (var i = 0; i < data.dates.length; i++) {
				xAxisLabels.push({text: data.dates[i].label, value: data.dates[i].value})
			};
		}
		columns_chart.addAxis("x", {
			labels: xAxisLabels,
			rotation: -90,
			minorTick: {stroke: "black", length: 2, width:1},
			majorTick: {color: "red", length: 4, width:1},
			labelSizeChange:true
		});
		var max = data.maxvalue+1;
		columns_chart.addAxis("y", {
			leftBottom: true,
			min: 0,
			max: max,
			vertical: true,
			fixLower: "major",
			fixUpper: "major",
			minorTick: {stroke: "black", length: 2, width:1},
			majorTick: {color: "red", length: 4, width:1}});
		if (data.data)
		{
			for (var key in data.data) {
				columns_chart.addSeries(key,data.data[key])}
		}
			
		var tooltip = new Tooltip(columns_chart,"default");
		var highlight = new Highlight(columns_chart, "default");
		columns_chart.render();
//		legend = new Legend({chart:columns_chart,  horizontal: false}, legend_node);
	},
	_report:function()
	{
		var content = {};

		content['reportoutputtypeid'] = '';
		content['reporttemplateid'] = '';
		content['clientid'] = '';
		content['issueid'] = '';

		this.report_dlg.show();
		this.report_node.SetCompleted(this._complete_call_back);
		this.report_node.start(content);
	},
	_complete_call:function()
	{
		this.reportbtn.cancel();
		this.report_dlg.hide();
	}

});
});
