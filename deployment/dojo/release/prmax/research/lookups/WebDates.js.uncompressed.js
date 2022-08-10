require({cache:{
'url:research/lookups/templates/WebDates.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Web Dates filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Text</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_web_dates\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\r\n\t<div data-dojo-attach-point=\"webdates_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Web Dates Add\"'>\r\n\t\t<div data-dojo-attach-point=\"webdates_add_ctrl\" data-dojo-type=\"prcommon2/web/WebDatesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"webdates_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Web Dates Update\"'>\r\n\t\t<div data-dojo-attach-point=\"webdates_update_ctrl\" data-dojo-type=\"prcommon2/web/WebDatesAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    WebDates.js
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/lookups/WebDates", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/WebDates.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"prcommon2/web/WebDatesAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.WebDates",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/webdates/list', idProperty:"webauditdateid"}));

		topic.subscribe(PRCOMMON.Events.Web_Dates_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Web_Dates_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Web_Dates_Deleted, lang.hitch(this, this._delete_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'webauditdateid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Web Dates ',className: "standard",field:'webauditdatedescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.webdates_add_ctrl.set("dialog", this.webdates_add_dlg);
		this.webdates_update_ctrl.set("dialog", this.webdates_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.webdates_update_ctrl.load ( e.rows[0].data.webauditdateid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["webauditdatedescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_web_dates:function()
	{
		this.webdates_add_ctrl.clear();
		this.webdates_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( webdates )
	{
		this._store.put( webdates );
	},
	_add_event:function( webdates )
	{
		this._store.add( webdates );
	},
	_delete_event:function( webauditdateid )
	{
		this._store.remove( webauditdateid );
	}
});
});





