//-----------------------------------------------------------------------------
// Name:    Publisher.js
// Author:  Chris Hoy
// Purpose:
// Created: 07/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Publishers.html",
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
	"prcommon2/publisher/PublisherAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookup.Publishers",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/publisher/list', idProperty:"publisherid"}));

		topic.subscribe(PRCOMMON.Events.Publisher_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Publisher_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Publisher_Deleted, lang.hitch(this, this._deleted_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'publisherid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Publisher ',className: "standard",field:'publishername'},
			{label: 'www ',className: "standard",field:'www'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", lang.hitch(this,this._on_cell_call));

		this.publisher_add_ctrl.set("dialog", this.publisher_add_dlg);
		this.publisher_update_ctrl.set("dialog", this.publisher_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.publisher_update_ctrl.load ( e.rows[0].data.publisherid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["publishername"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_publisher:function()
	{
		this.publisher_add_ctrl.clear();
		this.publisher_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( publisher )
	{
		this._store.put( publisher);
	},
	_add_event:function( publisher )
	{
		this._store.add( publisher);
	},
	_deleted_event:function( publisherid )
	{
		this._store.remove ( publisherid );
	}
});
});





