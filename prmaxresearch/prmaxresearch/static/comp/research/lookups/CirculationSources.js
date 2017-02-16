//-----------------------------------------------------------------------------
// Name:    CirculationSources.js
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
	"dojo/text!../lookups/templates/CirculationSources.html",
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
	"prcommon2/circulation/CirculationSourcesAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.CirculationSources",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/circulationsources/list', idProperty:"circulationsourceid"}));

		topic.subscribe(PRCOMMON.Events.Circulation_Sources_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Circulation_Sources_Added, lang.hitch(this, this._add_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'circulationsourceid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Circulation Sources ',className: "standard",field:'circulationsourcedescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.circulationsource_add_ctrl.set("dialog", this.circulationsource_add_dlg);
		this.circulationsource_update_ctrl.set("dialog", this.circulationsource_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.circulationsource_update_ctrl.load ( e.rows[0].data.circulationsourceid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["circulationsourcedescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_circulation_source:function()
	{
		this.circulationsource_add_ctrl.clear();
		this.circulationsource_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( circulationsource )
	{
		this._store.put( circulationsource );
	},
	_add_event:function( circulationsource )
	{
		this._store.add( circulationsource );
	}
});
});





