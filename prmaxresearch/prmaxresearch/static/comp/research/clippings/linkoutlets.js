//-----------------------------------------------------------------------------
// Name:    ipbc_outlets.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/linkoutlets.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"research/clippings/ipcb_outlets",
	"research/clippings/mbrain_outlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, lang ){
return declare("research.clippings.linkoutlets",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/clippings/list_link', idProperty:"outletexternallinkid"}));
		this._clippingsources = new dojo.data.ItemFileReadStore( {url:"/common/lookups?searchtype=clippingsource&nofilter=1" });
		this._show_basic_edit_call_back = lang.hitch(this,this._show_basic_edit_call);
	},
	postCreate:function()
	{
		this.filter_source.set('store', this._clippingsources);
		var cells =
		[
			{label:' ', field:'outletexternallinkid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Link Code',className: "dgrid-column-address-short",field:'linktext'},
			{label: 'Link Name',className: "dgrid-column-address-short",field:'linkdescription'},
			{label: 'Prmax OutletId',className: "dgrid-column-status-small",field:'outletid'},
			{label: 'Prmax Outlet',className: "dgrid-column-address-short",field:'outletname'},
			{label: 'Source',className: "dgrid-column-status-small",field:'clipsource'},
			{label: 'Url',className: "dgrid-column-address-short",field:'url'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{not_linked:true,hide_ignore:true},
			sort: [{ attribute: "linktext", descending: false }]
		})

		this.grid.on(".dgrid-row:click", lang.hitch(this,this._on_cell_call));

		this.inherited(arguments);

	},
	startup:function()
	{
		this.inherited(arguments);
		// because of the way this widget is created and displayed it doens't
		// render correcly first time so we need to do it on start up
		this.grid_view.set("content", this.grid);

	},
	_on_cell_call:function(e)
	{
		var cell = this.grid.cell(e);

		if (cell && cell.row)
		{
			switch(cell.row.data.linktypeid)
			{
				case "6":
				case 6:
				case "7":
				case 7:
					this.mbrain_outlet_link.load(cell.row.data.outletexternallinkid,this._show_basic_edit_call_back);
					break;
				default:
					this.ipbc_outlet_link.load(cell.row.data.outletexternallinkid,this._show_basic_edit_call_back);
					break;
			}
		}
	},
	_clear_filter:function()
	{
		this.filter_linktext.set("value","");
		this.filter_linkdescription.set("value","");
		this.filter_url.set("value","");
		this.not_linked.set("checked",true);
		this.hide_ignore.set("checked",true);
		this.filter_source.set("value",-1);
	},
	_execute:function()
	{
		var query = {sourcetypeid:this._sourcetypeid};

		if ( this.not_linked.get("checked"))
			query["not_linked"] = true;

		if (this.hide_ignore.get("checked"))
			query["hide_ignore"] = true;

		if ( this.filter_linktext.get("value"))
			query["linktext"] = this.filter_linktext.get("value");

		if ( this.filter_linkdescription.get("value"))
			query["linkdescription"] = this.filter_linkdescription.get("value");

		if ( this.filter_url.get("value"))
			query["linkurl"] = this.filter_url.get("value");

		if ( this.filter_source.get("value"))
			query["clipsource"] = this.filter_source.get("value");

		this.grid.set("query",query);
		this._clear();
	},
	_clear:function()
	{
		this.edit_view.selectChild(this.blank_view);
	},
	_show_basic_edit_call:function( source, data )
	{
		if ( data )
		{
			this._store.put( data );
			this.edit_view.selectChild(this.blank_view);
		}
		else
		{
			switch(source)
			{
				case "ipcb_outlets":
					this.edit_view.selectChild(this.ipbc_outlet_link);
					break;
				case "mbrain_outlets":
					this.edit_view.selectChild(this.mbrain_outlet_link);
					break;
			}
		}
	}
});
});
