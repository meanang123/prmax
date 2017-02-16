//-----------------------------------------------------------------------------
// Name:    prcommon2.outlet.OutletSelect
// Author:  Chris Hoy
// Purpose:
// Created: 09/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
// Main control
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlet/templates/OutletSelectPanel.html",
	"dijit/layout/BorderContainer",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/_base/lang",
	"dojo/topic",
	"ttl/grid/Grid",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/Dialog",
	"dijit/layout/ContentPane"
	], function(declare, BaseWidgetAMD, template, BorderContainer, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass ){
 return declare("prcommon2.outlet.OutletSelectPanel",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	searchtypeid:6,
	constructor: function()
	{
		this._outletid = null;
		this._dialog = null;
		this._callback = null;

		this.model =  new Observable( new JsonRest( {target:'/search/list_outlet_rest', idProperty:"outletid"}));
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Name',className:"standard", field:"outletname"}
		];

		this.searchgrid = new Grid({
			columns: [ {label: 'Name',className:"standard", field:"outletname"} ],
			selectionMode: "single",
			store: this.model,
			query:{}
		});

		this.select_search_view.set("content", this.searchgrid);
		this.searchgrid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.inherited(arguments);
	},
	_search:function()
	{
		this.searchgrid.set("query",{extended_search:1,outletname: this.outletname.get("value")})
	},
	_clear_search:function()
	{
		this.searchgrid.set("value","");
	},
	_on_cell_call:function (e )
	{
		this._callback( e.rows[0].data );
		if (this._dialog)
			this._dialog.hide();

	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog ;
	},
	_setCallbackAttr:function( callback)
	{
		this._callback = callback;
	},
	_close:function()
	{
		if (this._dialog)
			this._dialog.hide();
	}
});
});