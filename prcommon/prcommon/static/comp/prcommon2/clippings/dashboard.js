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
	"prcommon2/reports/ReportBuilder",
	"prcommon2/clippings/windowsettings",
	"prcommon2/clippings/output"
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
		this._complete_call_back = lang.hitch(this, this._complete_call);
		topic.subscribe('/dashboardsettings/update', lang.hitch(this, this._update_dashboard_event));
		this._windowid = null;
		this._customerid = PRMAX.utils.settings.cid;
		this._data = null;
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
			this._data = response.data.reduce(function(total,current){
				total[current.windowid] = current;
				return total;},{});

			for (var i=1; i<=6; i++)
			{
				if (this._data[i])
				{
					if (this._is_not_empty_object(this._data[i]))
					{
						var load_no_data = "chart_node_loading_no_data" + i;
						domclass.add(this[load_no_data], 'prmaxhidden');
						var load_data = "chart_node_loading_data" + i;
						domclass.remove(this[load_data], 'prmaxhidden');
						if (this._is_not_empty_object(this._data[i].data))
						{
							var reportbtn = "reportbtn" + i;
							domclass.remove(this[reportbtn].domNode, "prmaxhidden");
						}
						else
						{
							var reportbtn = "reportbtn" + i;
							domclass.add(this[reportbtn].domNode, "prmaxhidden");
						}
					}
					else
					{
						var reportbtn = "reportbtn" + i;
						domclass.add(this[reportbtn].domNode, "prmaxhidden");
					}
					this.show_charts(this._data[i]);

				}
				else
				{
					var load_no_data = "chart_node_loading_no_data" + i;
					domclass.add(this[load_no_data], 'prmaxhidden');
					var load_data = "chart_node_loading_data" + i;
					domclass.remove(this[load_data], 'prmaxhidden');
				}
			}
		}
		else
		{
			alert("Problem loading chart data");
		}
	},
	_is_not_empty_object:function(obj)
	{
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return true;
		}
		return false;	
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
	_update_dashboard_event:function(data)
	{
	
		var load_data = "chart_node_loading_data" + data[0].windowid;
		domclass.add(this[load_data], 'prmaxhidden');
		var load_no_data = "chart_node_loading_no_data" + data[0].windowid;
		domclass.remove(this[load_no_data], 'prmaxhidden');
	
		var content = data[0];
		content["customerid"] = PRMAX.utils.settings.cid;

		request.post('/clippings/charting/get_window_chart_data',
			utilities2.make_params({data : content})).
			then(this._updatesettings_call_back);
	},
	_updatesettings_call:function(response)
	{
		if ( response.success=="OK")
		{

			if (response.data)
			{
				var win = response.data.windowid;
				if (this._is_not_empty_object(response.data))
				{
					var load_no_data = "chart_node_loading_no_data" + win;
					domclass.add(this[load_no_data], 'prmaxhidden');
					var load_data = "chart_node_loading_data" + win;
					domclass.remove(this[load_data], 'prmaxhidden');
					if (this._is_not_empty_object(response.data.data))
					{
						var reportbtn = "reportbtn" + win;
						domclass.remove(this[reportbtn].domNode, "prmaxhidden");
					}
					else
					{
						var reportbtn = "reportbtn" + win;
						domclass.add(this[reportbtn].domNode, "prmaxhidden");
					}					
				}
				else
				{
					var reportbtn = "reportbtn" + win;
					domclass.add(this[reportbtn].domNode, "prmaxhidden");
				}					

				this._data[win].chartviewid = response.data.chartviewid;
				this._data[win].by_client = response.data.by_client;
				this._data[win].by_issue = response.data.by_issue;
				this._data[win].clientid = response.data.clientid;
				this._data[win].dashboardsettingsmodeid = response.data.dashboardsettingsmodeid;
				this._data[win].dashboardsettingsstandardid = response.data.dashboardsettingsstandardid;
				this._data[win].dashboardsettingsstandardsearchbyid = response.data.dashboardsettingsstandardsearchbyid;
				this._data[win].data = response.data.data;
				this._data[win].daterangeid = response.data.daterangeid;
				this._data[win].dates = response.data.dates;
				this._data[win].groupbyid = response.data.groupbyid;
				this._data[win].maxvalue = response.data.maxvalue;
				this._data[win].questionid = response.data.questionid;
				this._data[win].questiontypeid = response.data.questiontypeid;
				this._data[win].title = response.data.title;
			}
			this.show_charts(response.data)
		}
	},
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
				titleGap: 0,
				titleFont: "normal normal normal 12pt Arial",
				titleFontColor: "black"
		});
		pie_chart.setTheme(PrimaryColors);
		pie_chart.addPlot("default", {
			type: Pie,
			radius: 80,
			fontColor: "black",
			labelOffset: 0,
			labelStyle: "columns",
			htmlLabels: true,
			font: "normal normal normal 9pt Arial",
			startAngle: -10
		});
		pie_chart.addAxis("x");
		pie_chart.addAxis("y", {min: 0, vertical: true,	fixLower: "major",	fixUpper: "major"});
		if (data)
		{
			pie_chart.addSeries(title,data);
		}
		var tooltip = new Tooltip(pie_chart,"default");
		var moveslice = new MoveSlice(pie_chart,"default");
		var magnify = new Magnify(pie_chart, "default", { scale: 1.2 });
		pie_chart.render();
		var a = this["window" + windowid];
		//pie_chart.resize({w:a.l,h:275});
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
				titleGap: 0,
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
			natural: true,
			rotation: max.toString().length >= 4 ? -70 : -30,
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
			rotation: max.toString().length >= 4 ? -70 : -30,
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
	
	_rep1:function()
	{
		this._windowid = 1;
		this._report();	
	},
	_rep2:function()
	{
		this._windowid = 2;
		this._report();	
	},
	_rep3:function()
	{
		this._windowid = 3;
		this._report();	
	},
	_rep4:function()
	{
		this._windowid = 4;
		this._report();	
	},
	_rep5:function()
	{
		this._windowid = 5;
		this._report();	
	},
	_rep6:function()
	{
		this._windowid = 6;
		this._report();	
	},
	_report:function()
	{
		this.output_ctrl.load(this.output_dlg, this._windowid, this._customerid, this._data[this._windowid]);
		this.output_dlg.show();
	},	
	_complete_call:function()
	{
		this.report_dlg.hide();
	},
	_set1:function()
	{
		this._windowid = 1;
		this._settings();	
	},
	_set2:function()
	{
		this._windowid = 2;
		this._settings();	
	},
	_set3:function()
	{
		this._windowid = 3;
		this._settings();	
	},
	_set4:function()
	{
		this._windowid = 4;
		this._settings();	
	},
	_set5:function()
	{
		this._windowid = 5;
		this._settings();	
	},
	_set6:function()
	{
		this._windowid = 6;
		this._settings();	
	},
	_settings:function()
	{
		this.settings_ctrl.load(this.settings_dlg, this._windowid, this._customerid);
		this.settings_dlg.show();
	},	
});
});
