require({cache:{
'url:prcommon2/clippings/charts/templates/lineschart.html':"<div>\r\n    <div data-dojo-type=\"prcommon2/clippings/filter\" data-dojo-attach-point=\"filter_view\" data-dojo-props='region:\"top\", style:\"height:50px;background-color:${back_colour};width:100%;overflow:hidden\"'></div>\r\n    <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",style:\"width:100%;height:400px;overflow:hidden;background-color:${back_colour};color:${fore_color}\"'>\r\n        <div style=\"height:400px;width:100%;float:left\" data-dojo-attach-point=\"chart_node_loading_no_data\" class=\"prmaxhidden\">\r\n            <div data-dojo-attach-point=\"chart_node_loading\" style=\"height:400px\">\r\n                <table width=\"100%\" height=\"100%\">\r\n                    <tr>\r\n                        <td style=\"text-align:left;vertical-align:middle\"></td>\r\n                        <td style=\"text-align:center;vertical-align:middle\">\r\n                            <p>Loading Clippings</p><br/><i class=\"fa fa-spinner fa-2x fa-pulse\" style=\"color:#0282A9\"></i>\r\n                        </td>\r\n                        <td style=\"text-align:left;vertical-align:middle\"></td>\r\n                    </tr>\r\n                </table>\r\n            </div>\r\n            <div data-dojo-attach-point=\"chart_node_no_data\" class=\"prmaxhidden\"  style=\"height:400px\">\r\n                <table width=\"100%\" height=\"100%\">\r\n                    <tr>\r\n                        <td style=\"text-align:left;vertical-align:middle\"></td>\r\n                        <td style=\"text-align:center;vertical-align:middle\">\r\n                            <span class='fa-stack fa-lg'><i class='fa fa-ban fa-3x fa-stack-2x text-danger'></i></span><p>No Results</p>\r\n                        </td>\r\n                        <td style=\"text-align:left;vertical-align:middle\"></td>\r\n                    </tr>\r\n                </table>\r\n            </div>\r\n        </div>\r\n        <div style=\"height:400px;width:15%;float:left;margin:0 0 0 15px\" data-dojo-attach-point=\"report_legend_view\" class=\"prmaxhidden\"><br/>\r\n            <div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"height:34px;padding:0x;margin:0px;overflow:hidden\"'>\r\n                <button data-dojo-attach-event=\"onClick:_preferences\" data-dojo-attach-point=\"preferencesbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-print\",type:\"button\",label:\"Report\"'></button>\r\n                <div data-dojo-attach-point=\"preferences_dlg\" data-dojo-type=\"dijit/Dialog\"title=\"Report Preferences\" data-dojo-props='style:\"width:300px\"'>\r\n                    <div data-dojo-type=\"prcommon2/clippings/charts/preferences\" data-dojo-attach-point=\"preferences_ctrl\"></div>\r\n                </div>\r\n            </div>\r\n            <p>CHANNELS FILTER:</p><br/><br/>\r\n            <div data-dojo-attach-point=\"legend_node_outer\" style=\"height:400px\">\r\n                <div data-dojo-attach-point=\"legend_node\" style=\"height:400px\"></div>\r\n            </div>\r\n        </div>\r\n        <div style=\"height:400px;width:70%;float:left\">\r\n            <div data-dojo-attach-point=\"chart_node\" style=\"height:400px\"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"}});
define("prcommon2/clippings/charts/lineschart", [
    "dojo/_base/declare", // declare
    "ttl/BaseWidgetAMD",
    "dojo/text!../charts/templates/lineschart.html",
    "dijit/layout/BorderContainer",
    "dojox/charting/Chart",
    "dojox/charting/themes/Claro",
    "dojox/charting/themes/Tom",
    "dojox/charting/themes/PrimaryColors",
    "dojox/charting/plot2d/Lines",
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
	"prcommon2/clippings/filter",
	"prcommon2/reports/ReportBuilder",
	"prcommon2/clippings/charts/preferences",
    ], function(declare, BaseWidgetAMD, template, BorderContainer,Chart,Claro,Tom,PrimaryColors,Lines,Observable,Memory,Tooltip,MoveSlice,Magnify,Markers,Legend,Default,request,utilities2,lang,topic,domattr,domclass,domConstruct){
 return declare("prcommon2.clippings.charts.lineschart",
    [BaseWidgetAMD,BorderContainer],{
    templateString: template,
    gutters:false,
	back_colour:"black",
	fore_color:"lightblue",
    constructor: function()
    {
        this._linesChart = null;
        this._loaded = false;

        this._show_call_back = lang.hitch(this, this._show_call);
        this._error_call_back = lang.hitch(this, this._error_call);
        this._chart_event_call_back = lang.hitch(this, this._chart_event_call);
        this._complete_call_back = lang.hitch(this, this._complete_call);

    },
    postCreate:function()
    {
        this.inherited(arguments);

        this.filter_view.set("Updateevent", lang.hitch(this, this.refesh_view));
    },
    startup:function()
    {
        this.inherited(arguments);
        this.render_chart();
    },
    _create_lines:function(data)
    {

        this._linesChart = new Chart(this.chart_node, {
                title: data.charttitle,
                titlePos: "top",
                titleGap: 25,
                titleFont: "normal normal normal 20pt Arial",
                titleFontColor: "black"
        });

        // Set the theme
        this._linesChart.setTheme(PrimaryColors);

        // Add the only/default plot
        this._linesChart.addPlot("default", {
            type: Lines, // our plot2d/Pie module reference as type value
            markers: true
        });
        this._linesChart.connectToPlot("default", this._chart_event_call_back);

        var xAxisLabels = [];
        for (var i = 0; i < data.dates.length; i++) {
            xAxisLabels.push({text: data.dates[i].label, value: data.dates[i].value})
        };

        this._linesChart.addAxis("x", {
            labels: xAxisLabels,
            rotation: -90,
            minorTick: {stroke: "black", length: 5, width:3},
            majorTick: {color: "red", length: 10, width:3},
            labelSizeChange:true
        });

        var max = data.maxvalue+1;
        this._linesChart.addAxis("y", {
            min: 0,
            max: max,
            vertical: true,
            fixLower: "major",
            fixUpper: "major",
            minorTick: {stroke: "black", length: 5, width:3},
            majorTick: {color: "red", length: 10, width:3}});

        // Add the series of data
        for (var key in data.data) {
            this._linesChart.addSeries(key,data.data[key], {stroke: {width:1}})
        }

        var tooltip = new Tooltip(this._linesChart,"default");
        var moveslice = new MoveSlice(this._linesChart,"default");
        var magnify = new Magnify(this._linesChart, "default", { scale: 4 });
        // Render the chart!
        this._linesChart.render();
        this._leg = new Legend({chart:this._linesChart,  horizontal: false}, this.legend_node);

        domclass.add(this.chart_node_loading_no_data,"prmaxhidden");
        domclass.add(this.chart_node_loading,"prmaxhidden");
        domclass.add(this.chart_node_no_data,"prmaxhidden");

    },
    refesh_view:function()
    {
        //destroy chart and legend nodes and recreate legend node
        this.render_chart();
        try
        {
        	this._leg.destroy();
			delete this._leg;
        	this._linesChart.destroy();
        	delete this._linesChart;
		}
		catch(e)
		{

		}
        domclass.add(this.report_legend_view,"prmaxhidden");
        domclass.remove(this.chart_node_loading_no_data,"prmaxhidden");
        domclass.remove(this.chart_node_loading,"prmaxhidden");
        this.legend_node = domConstruct.place('<div data-dojo-attach-point="legend_node" style="height:400px"></div>', this.legend_node_outer, "first");
    },
    _refesh_chart:function(data)
    {
        this._create_lines(data);
    },
    render_chart:function()
    {
        var chart_request = { charttype:"lines" };

        lang.mixin(chart_request, lang.mixin(this.filter_view.get("filter")));

        request.post('/clippings/charting/get_chart_data',
            utilities2.make_params({ data : chart_request})).
            then(this._show_call_back,this._error_call_back);
    },
    _show_call:function(response)
    {
        if ( response.success == "OK")
        {
            domclass.remove(this.report_legend_view, "prmaxhidden");
            if (this._linesChart == null )
            {
                this._create_lines(response.data);
            }
            else
                this._refesh_chart(response.data);
        }
        else if ( response.success == "FA"  ){
            domclass.add(this.report_legend_view,"prmaxhidden");
            domclass.add(this.chart_node_loading,"prmaxhidden");
            domclass.remove(this.chart_node_no_data,"prmaxhidden");
        }
        this.filter_view.update_complete();
    },
    _error_call:function()
    {

    },
    _chart_event_call:function(evt)
    {

        if ( evt.type =="onclick")
        {
            var base_filter = this.filter_view._get_filters(false,true);

            base_filter.clippingstypedescription = evt.run.name;
            base_filter.daterestriction = evt.run.data[evt.index].labelx;
            base_filter.clippingstypeid =evt.run.data[evt.index].clippingstypeid;

            topic.publish("/clipping/refresh_details", base_filter);
            topic.publish("/clipping/change_view", "clippings_view");
        }
    },
	_preferences:function()
	{
		var filters = this.filter_view._get_filters(false,true);
		var content = {};

        content['reportoutputtypeid'] = 0;
        content['reporttemplateid'] = 26;
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
