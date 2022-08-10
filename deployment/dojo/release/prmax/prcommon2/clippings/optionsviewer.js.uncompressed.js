require({cache:{
'url:prcommon2/clippings/templates/optionsviewer.html':"<div>\r\n\t\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",splitter:true,style:\"width:30%;height:100%\",\"class\":\"common_prmax_layout bordered\"'>\r\n\t\t\t<h1 style=\"text-align:center\" data-dojo-attach-point=\"heading_text\">Select Chart Options</h1>\r\n\t\t\t<form data-dojo-attach-point=\"formnode\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n\t\t\t\t<label class=\"label_align_r label_tag label_size_2\">Global Analysis</label><select data-dojo-attach-point='question' data-dojo-props='placeHolder:\"No Selection\",name:\"question\",autoComplete:true,searchAttr:\"questiontext\",labelType:\"html\",style:\"width:15em\"' data-dojo-type=\"dijit/form/FilteringSelect\"></select><br/>\r\n\r\n\t\t\t\t<label data-dojo-attach-point=\"client_label_1\" class=\"label_align_r label_tag label_size_2\">Client</label><select data-dojo-props='pageSize:20,placeHolder:\"No Selection\",name:\"clientid\",autoComplete:true,searchAttr:\"clientname\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"clientid\" data-dojo-attach-event=\"onChange:_client_change\"></select><br/>\r\n\t\t\t\t<label data-dojo-attach-point=\"issue_label_1\" class=\"label_align_r label_tag label_size_2\">Issue</label><select data-dojo-props='pageSize:20,placeHolder:\"No Selection\",name:\"issueid\",autoComplete:true,searchAttr:\"name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"issueid\" ></select><br/>\r\n\t\t\t\t<label data-dojo-attach-point=\"statement_1\" class=\"label_align_r label_tag label_size_2\">Statement</label><select data-dojo-props='pageSize:20,name:\"statementid\",autoComplete:true,searchAttr:\"statementdescription\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"statementid\" ></select><br/>\r\n\t\t\t\t<label class=\"label_align_r label_tag label_size_2\">Release</label><select data-dojo-props='pageSize:20,name:\"emailtemplateid\",autoComplete:true,searchAttr:\"emailtemplatename\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"emailtemplateid\" ></select><br/>\r\n\r\n\r\n\t\t\t\t<label class=\"label_align_r label_tag label_size_2\">Chart View</label>\r\n\t\t\t\t\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='style:\"width:7em;color:black\"' data-dojo-attach-point=\"option\">\r\n\t\t\t\t\t\t<option value=0>Pie Chart</option>\r\n\t\t\t\t\t\t<option value=1>Lines Chart</option>\r\n\t\t\t\t\t</select><br/>\t\t\t\t\r\n\t\t\t\t<label class=\"label_align_r label_tag label_size_2\">Dates</label><div data-dojo-type=\"prcommon2/date/daterange\" data-dojo-attach-point=\"date_search\"></div></br>\r\n\t\t\t\t<button data-dojo-attach-event=\"onClick:_clear\" data-dojo-attach-point=\"clearbtn\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Clear\",\"class\":\"btnleft\"'></button>\r\n\t\t\t\t<button data-dojo-attach-event=\"onClick:_run_options\" data-dojo-attach-point=\"runoptionsbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Run\",\"class\":\"btnright\"'></button>\r\n\t\t\t\t<br/><br/><br/><br/>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"center\",splitter:true,' data-dojo-attach-point=\"chart_view_ctrl\">\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"blank_view\" data-dojo-props='style:\"width:100%;height:100%\", \"class\":\"bordered\"'></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true, style:\"width:100%;height:100%\", \"class\":\"bordered\"' data-dojo-attach-point=\"pie_chart_viewer\">\r\n\t\t\t\t<div style=\"height:400px;width:715px;float:left\">\r\n\t\t\t\t\t<div data-dojo-attach-point=\"pie_chart_node\" style=\"height:400px\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true, style:\"width:100%;height:100%\", \"class\":\"bordered\"' data-dojo-attach-point=\"lines_chart_viewer\">\r\n\t\t\t\t<div style=\"height:400px;width:70%;float:left\">\r\n\t\t\t\t\t<div data-dojo-attach-point=\"lines_chart_node\" style=\"height:400px\"></div>\r\n\t\t\t\t</div>\r\n\r\n\r\n\r\n\t\t\t\t<div style=\"height:400px;width:15%;float:right;margin:0 0 0 15px\" data-dojo-attach-point=\"legend_view\"><br/>\r\n\t\t\t\t\t<div data-dojo-attach-point=\"legend_node_outer\" style=\"height:400px\">\r\n\t\t\t\t\t\t<div data-dojo-attach-point=\"legend_node\" style=\"height:400px\"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\r\n\r\n\r\n\t\t\t</div>\r\n\t\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prcommon/clippings/optionsviewer
// Author:
// Purpose:
// Created: November 2018
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/optionsviewer", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/optionsviewer.html",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dojox/charting/Chart",
	"dojox/charting/themes/Claro",
	"dojox/charting/themes/Tom",
	"dojox/charting/themes/PrimaryColors",
	"dojox/charting/plot2d/Pie",
	"dojox/charting/plot2d/Lines",
	"dojox/charting/action2d/Tooltip",
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
	"dijit/form/ComboBox"
	], function(declare, BaseWidgetAMD, template, ContentPane, BorderContainer, Chart,Claro,Tom,PrimaryColors,Pie,Lines,Tooltip,MoveSlice,Magnify,Markers,Legend,Default, utilities2, topic, request, JsonRestStore, JsonRest, Observable,lang, domattr,ItemFileReadStore,domclass,domConstruct){
return declare("prcommon2.clippings.optionsviewer",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	mode:"add",
	gutters:false,
	constructor: function()
	{
		this._run_call_back = lang.hitch(this, this._run_call);
		//this._questions = new JsonRestStore ({target:'/clippings/questions/get_list_rest', idAttribute:'id'});
		this._questions = new JsonRestStore ({target:'/clippings/analyse/list_by_source', idAttribute:'clippingsanalysistempleteid'});
		this._clients = new JsonRestStore({target:"/clients/rest_combo", idAttribute:"id"});
		this._issues = new JsonRestStore({target:"/crm/issues/issues_list_rest", idAttribute:"id"});
		this._liststore = new JsonRestStore({target:"/emails/templates_list_rest", idAttribute:"id"});
		this._statement = new JsonRestStore({target:"/statement/statement_combo_rest", idAttribute:"id"});
		this._change_client_enabled=true;

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.question.set("store", this._questions);

		this.clientid.set("store",this._clients);
		this.issueid.set("store", this._issues);

		domattr.set(this.issue_label_1, "innerHTML", PRMAX.utils.settings.issue_description);
		domattr.set(this.client_label_1, "innerHTML", PRMAX.utils.settings.client_name);

		this.emailtemplateid.set("store", this._liststore);
		this.emailtemplateid.set("query", {restrict:"sent",include_no_select:1});

		this.statementid.set("store", this._statement);
		this.statementid.set("query",{include_no_select:1});

		this.clientid.set("value", null );
		this.issueid.set("value", null );
		this.emailtemplateid.set("value",null);
		this.statementid.set("value",null);
	},
	_clear:function()
	{
		this.clear();
	},
	clear:function()
	{
		this._change_client_enabled = false;
		this.clientid.set("value", null );
		this.issueid.set("value", null );
		this._change_client_enabled = true;
		this.emailtemplateid.set("value",null);
		this.statementid.set("value", null);		
		this.runoptionsbtn.cancel();
	},
	_client_change:function()
	{
		var clientid = this.clientid.get("value");
		if (clientid == undefined)
			clientid = -1;

		this.issueid.set("query",{ clientid: clientid});
		if (this._change_client_enabled==true)
		{
			this.issueid.set("value",null);
		}

		this._change_client_enabled = true ;

	},
	
	_run_options:function()
	{
		if (utilities2.form_validator(this.formnode) == false)
		{
			alert("Please Enter Details");
			this.runoptionsbtn.cancel();
			return false;
		}
		var content = this.formnode.get("value") ;
		content["option"] = this.option.get("value");
		content["daterange"] = this.date_search.get("value");
		content["drange"] = this.date_search.get("value");
		content["questionid"] = this.question.item.questionid;
		content['questiontypeid'] = this.question.item.questiontypeid;
		this.runoptionsbtn.makeBusy();

		request.post('/clippings/charting/get_questions_chart_data', 
			utilities2.make_params({data : content})).
			then(this._run_call_back);
	},

	_create_pie:function(data)
	{
		this._pieChart = new Chart(this.pie_chart_node, {
				title: this.question.item.questiontext,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 20pt Arial",
				titleFontColor: "black"
		});
		this._pieChart.setTheme(PrimaryColors);
		this._pieChart.addPlot("default", {
			type: Pie,
			radius: 145,
			fontColor: "black",
			labelOffset: 0,
			labelStyle: "columns",
			htmlLabels: true,
			font: "normal normal normal 12pt Arial",
			startAngle: -10
		});
		this._pieChart.addAxis("x");
		this._pieChart.addAxis("y", {min: 0, vertical: true, fixLower: "major",	fixUpper: "major"});
		this._pieChart.addSeries(data.charttitle,data.data.pie);
		var tooltip = new Tooltip(this._pieChart,"default");
		var moveslice = new MoveSlice(this._pieChart,"default");
		var magnify = new Magnify(this._pieChart, "default", { scale: 1.2 });
		this._pieChart.render();
	},
	_create_lines:function(data)
	{
		this._linesChart = new Chart(this.lines_chart_node, {
				title: this.question.item.questiontext,
				titlePos: "top",
				titleGap: 25,
				titleFont: "normal normal normal 20pt Arial",
				titleFontColor: "black"
		});
		this._linesChart.setTheme(PrimaryColors);
		this._linesChart.addPlot("default", {
			type: Lines,
			markers: true
		});
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
		for (var key in data.data) {
			this._linesChart.addSeries(key,data.data[key], {stroke: {width:1}})
		}
		var tooltip = new Tooltip(this._linesChart,"default");
		var moveslice = new MoveSlice(this._linesChart,"default");
		var magnify = new Magnify(this._linesChart, "default", { scale: 4 });
		this._linesChart.render();
		this._leg = new Legend({chart:this._linesChart,  horizontal: false}, this.legend_node);
	},
	_run_call:function(response)
	{
		if ( response.success=="OK")
		{
			if (this.option.get("value") == 0) //pie chart
			{
				this.chart_view_ctrl.selectChild(this.pie_chart_viewer);
				if (this._pieChart != null )
					{
						this._pieChart.destroy();
						delete this._pieChart;
					}
				this._create_pie(response.data.pie);
			}
			else if (this.option.get("value") == 1) //lines chart
			{
				this.chart_view_ctrl.selectChild(this.lines_chart_viewer);
				if (this._linesChart && this._linesChart != null)
					{
						this._leg.destroy();
						delete this._leg;					
						this._linesChart.destroy();
						delete this._linesChart;				
					}
				if (this._leg){}
				else
				{
					this.legend_node = domConstruct.place('<div data-dojo-attach-point="legend_node" style="height:400px"></div>', this.legend_node_outer, "first");
				}
				this._create_lines(response.data.lines)
			}
		}
		else
		{
			alert("Problem");
		}

		this.runoptionsbtn.cancel();
	},
});
});
