//-----------------------------------------------------------------------------
// Name:    MarketSector.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: May 2022
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/MarketSector.html",
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
	"prcommon2/marketsector/MarketSectorAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.MarketSector",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/marketsector/list', idProperty:"marketsectorid"}));

		topic.subscribe(PRCOMMON.Events.Market_Sector_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Market_Sector_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Market_Sector_Deleted, lang.hitch(this, this._delete_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'marketsectorid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Market Sector ',className: "standard",field:'marketsectordescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.marketsector_add_ctrl.set("dialog", this.marketsector_add_dlg);
		this.marketsector_update_ctrl.set("dialog", this.marketsector_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.marketsector_update_ctrl.load ( e.rows[0].data.marketsectorid);
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["marketsectordescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_market_sector:function()
	{
		this.marketsector_add_ctrl.clear();
		this.marketsector_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function(marketsector)
	{
		this._store.put(marketsector);
	},
	_add_event:function(marketsector)
	{
		this._store.add(marketsector);
	},
	_delete_event:function(marketsectorid)
	{
		this._store.remove(marketsectorid);
	}
});
});





