//-----------------------------------------------------------------------------
// Name:    prcommon2.outlet.OutletSelectSimple
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
	"dojo/text!../outlet/templates/OutletSelectSimple.html",
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
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane"
	], function(declare, BaseWidgetAMD, template, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass ){
 return declare("prcommon2.outlet.OutletSelectSimple",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	searchtypeid:6,
	constructor: function()
	{
		this._outletid = null;

		this.model =  new Observable( new JsonRest( {target:'/search/list_outlet_rest', idProperty:"outletid"}));
	},
	postCreate:function()
	{
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
	_setValueAttr:function( value)
	{
		this._outletid = value ;
		this._set_view();
	},
	_setDisplayvalueAttr:function( value)
	{
		domattr.set(this.display,"innerHTML",value);
	},
	_getValueAttr:function()
	{
		return this._outletid;
	},
	_clear:function()
	{
		this.clear();
	},
	_set_view:function()
	{
			if (this._outletid == null)
				domclass.add(this.clearbtn.domNode,"prmaxhidden");
			else
				domclass.remove(this.clearbtn.domNode,"prmaxhidden");
	},
	_select:function()
	{
		this.select_dlg.startup();
		this.select_dlg.show();
	},
	clear:function()
	{
		this._outletid = null;
		domattr.set(this.display,"innerHTML","");
		this.outletname.set("value","");
		this._search();
		this._set_view();
	},
	_close:function()
	{
		this.select_dlg.hide();
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
		this._outletid = e.rows[0].data.outletid;
		domattr.set(this.display,"innerHTML",e.rows[0].data.outletname);
		this.select_dlg.hide();
		this._set_view();
	}
});
});