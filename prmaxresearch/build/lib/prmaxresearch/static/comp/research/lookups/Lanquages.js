//-----------------------------------------------------------------------------
// Name:    language.js
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
	"dojo/text!../lookups/templates/Lanquages.html",
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
	"prcommon2/languages/LanguageAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.Lanquages",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/lanquages/list', idProperty:"languageid"}));

		topic.subscribe(PRCOMMON.Events.Lanquage_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Lanquage_Added, lang.hitch(this, this._add_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'languageid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Language ',className: "standard",field:'languagename'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.language_add_ctrl.set("dialog", this.language_add_dlg);
		this.language_update_ctrl.set("dialog", this.language_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.language_update_ctrl.load ( e.rows[0].data.languageid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["languagename"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_language:function()
	{
		this.language_add_ctrl.clear();
		this.language_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( language )
	{
		this._store.put( language );
	},
	_add_event:function( language )
	{
		this._store.add( language );
	}
});
});





