//-----------------------------------------------------------------------------
// Name:    WebSources.js
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
	"dojo/text!../lookups/templates/WebSources.html",
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
	"prcommon2/web/WebSourcesAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.WebSources",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/websources/list', idProperty:"websourceid"}));

		topic.subscribe(PRCOMMON.Events.Web_Sources_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Web_Sources_Added, lang.hitch(this, this._add_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'websourceid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Web Sources ',className: "standard",field:'websourcedescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.websource_add_ctrl.set("dialog", this.websource_add_dlg);
		this.websource_update_ctrl.set("dialog", this.websource_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.websource_update_ctrl.load ( e.rows[0].data.websourceid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["websourcedescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_web_source:function()
	{
		this.websource_add_ctrl.clear();
		this.websource_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( websource )
	{
		this._store.put( websource );
	},
	_add_event:function( websource )
	{
		this._store.add( websource );
	}
});
});





