//-----------------------------------------------------------------------------
// Name:    CirculationDates.js
// Author:  Chris Hoy
// Purpose:
// Created: 10/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define([
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





