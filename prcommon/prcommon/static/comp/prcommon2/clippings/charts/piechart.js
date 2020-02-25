define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../charts/templates/piechart.html",
	"dijit/layout/BorderContainer",
	"dojox/charting/Chart",
	"dojox/charting/themes/Claro",
	"dojox/charting/themes/Tom",
	"dojox/charting/themes/PrimaryColors",
	"dojox/charting/plot2d/Pie",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojox/charting/action2d/Tooltip",
	"dojox/charting/action2d/MoveSlice",
	"dojox/charting/action2d/Magnify",
	"dojox/charting/plot2d/Markers",
	"dojox/charting/widget/SelectableLegend",
	"dojox/charting/axis2d/Default",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/Dialog",
	"prcommon2/clippings/filter",
	"prcommon2/reports/ReportBuilder",
	"prcommon2/clippings/charts/preferences",
	], function(declare, BaseWidgetAMD, template, BorderContainer,Chart,Claro,Tom,PrimaryColors,Pie,Observable,Memory,Tooltip,MoveSlice,Magnify,Markers,Legend,Default,request,utilities2,lang,topic,domattr,domclass,domConstruct, dialog){
 return declare("prcommon2.clippings.charts.piechart",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	back_colour:"black",
	fore_color:"lightblue",
	constructor: function()
	{
		this._pieChart = null;

		this._show_call_back = lang.hitch(this, this._show_call);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._chart_event_call_back = lang.hitch(this, this._chart_event_call);
//		this._complete_call_back = lang.hitch(this, this._complete_call);
	},
	startup:function()
	{
		this.inherited(arguments);
		this.render_chart();
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.filter_view.set("Updateevent", lang.hitch(this, this.refesh_view));
	},
	_create_pie:function(data)
	{
		this._pieChart = new Chart(this.chart_node, {
				title: data.charttitle,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 20pt Arial",
				titleFontColor: "black"
		});

		// Set the theme
		this._pieChart.setTheme(PrimaryColors);

		// Add the only/default plot
		this._pieChart.addPlot("default", {
			type: Pie, // our plot2d/Pie module reference as type value
			radius: 145,
			fontColor: "black",
			labelOffset: 0,
			labelStyle: "columns",
			htmlLabels: true,
			font: "normal normal normal 12pt Arial",
			startAngle: -10
		});

		this._pieChart.connectToPlot("default", this._chart_event_call_back);
		this._pieChart.addAxis("x");
		this._pieChart.addAxis("y", {min: 0, vertical: true, fixLower: "major",	fixUpper: "major"});
		this._pieChart.addSeries(data.charttitle,data.data.pie);

		var tooltip = new Tooltip(this._pieChart,"default");
		var moveslice = new MoveSlice(this._pieChart,"default");
		var magnify = new Magnify(this._pieChart, "default", { scale: 1.2 });
		// Render the chart!
		this._pieChart.render();
		this._leg = new Legend({chart:this._pieChart,  horizontal: false}, this.legend_node);
	},
	refesh_view:function()
	{
		//destroy chart and legend nodes and recreate legend node
		this.render_chart();
		this._leg.destroy();
		delete this._leg;
		this._pieChart.destroy();
		delete this._pieChart;
		this.legend_node = domConstruct.place('<div data-dojo-attach-point="legend_node" style="height:400px"></div>', this.legend_node_outer, "first");
	},
	_refesh_chart:function(data)
	{
		this._create_pie(data);
	},
	render_chart:function()
	{
		var chart_request = { charttype:"pie" };

		lang.mixin(chart_request, lang.mixin(this.filter_view.get("filter")));

		request.post('/clippings/charting/get_chart_data',
			utilities2.make_params({ data : chart_request})).
			then(this._show_call_back,this._error_call_back);
	},
	_show_call:function(response)
	{
		if ( response.success == "OK")
		{
			if (this._pieChart == null )
				this._create_pie(response.data);
			else
				this._refesh_chart(response.data);
		}
		this.filter_view.update_complete();
	},
	_chart_event_call:function(evt)
	{
		if ( evt.type =="onclick")
		{
			var base_filter = this.filter_view._get_filters(false,true);

			base_filter.clippingstypedescription = evt.run.data[evt.index].label;
			base_filter.clippingstypeid = evt.run.data[evt.index].clippingstypeid;

			topic.publish("/clipping/refresh_details", base_filter);
			topic.publish("/clipping/change_view", "clippings_view");
		}
	},
	_preferences:function()
	{
		var filters = this.filter_view._get_filters(false,true);
		var content = {};

		content['reportoutputtypeid'] = 0;
		content['reporttemplateid'] = 25;
		content['drange'] = filters.drange;
		content['tones'] = filters.tones;
		content['clientid'] = filters.clientid;
		content['issueid'] = filters.issueid;

		var selected_channels = [];
		for (var i =0; i <= this._leg._cbs.length-1; i++)
		{
			if (this._leg._cbs[i].checked)
			{
				selected_channels.push(this._leg.legends[i].innerText);
			}
		}
		this.preferences_ctrl._load(this.preferences_dlg, content, selected_channels);
		this.preferences_dlg.show();
	},
});
});
