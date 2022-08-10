require({cache:{
'url:research/lookups/templates/CirculationDates.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Circulation Dates filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Text</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_circulation_dates\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\r\n\t<div data-dojo-attach-point=\"circulationdates_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Dates Add\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationdates_add_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationDatesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"circulationdates_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Dates Update\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationdates_update_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationDatesAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    CirculationDates.js
// Author:  Chris Hoy
// Purpose:
// Created: 10/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/lookups/CirculationDates", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/CirculationDates.html",
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
	"prcommon2/circulation/CirculationDatesAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.CirculationDates",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/circulationdates/list', idProperty:"circulationauditdateid"}));

		topic.subscribe(PRCOMMON.Events.Circulation_Dates_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Circulation_Dates_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Circulation_Dates_Deleted, lang.hitch(this, this._delete_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'circulationauditdateid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Circulation Dates ',className: "standard",field:'circulationauditdatedescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.circulationdates_add_ctrl.set("dialog", this.circulationdates_add_dlg);
		this.circulationdates_update_ctrl.set("dialog", this.circulationdates_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.circulationdates_update_ctrl.load ( e.rows[0].data.circulationauditdateid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["circulationauditdatedescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_circulation_dates:function()
	{
		this.circulationdates_add_ctrl.clear();
		this.circulationdates_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( circulationdates )
	{
		this._store.put( circulationdates );
	},
	_add_event:function( circulationdates )
	{
		this._store.add( circulationdates );
	},
	_delete_event:function( circulationauditdateid )
	{
		this._store.remove( circulationauditdateid );
	}
});
});





