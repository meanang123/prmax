//-----------------------------------------------------------------------------
// Name:    WebDates.js
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
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





