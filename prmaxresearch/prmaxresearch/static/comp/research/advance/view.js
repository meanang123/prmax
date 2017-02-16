//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 13/01/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/view.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/on",
	"dojo/_base/array",
	"dijit/registry",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"prcommon2/advance/advance",
	"dijit/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"prcommon2/search/AdvanceSearch"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic, domattr, domclass, on, array, registry){
 return declare("research.advance.view",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this.results = new Observable( new JsonRest( {target:'/advance/viewpage_rest', idProperty:"advancefeatureid"}));
		this._load_call_back = lang.hitch(this, this._load_call);
		this._clear_all_call_back = lang.hitch(this, this._clear_all_call);

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Outlet Name',className:"dgrid-column-title ",field:"outletname"},
			{label: 'Publication Date',className:"dgrid-column-date",field:"pub_date_display"},
			{label: 'Feature',className:"dgrid-column-contact",field:"feature"}
		];

		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.results,
			sort: [{ attribute: "pub_date_display", descending: false }],
			query: utilities2.EMPTYGRID
		});

		this.searchgrid_view.set("content", this.searchgrid);
		this.searchgrid.on("dgrid-select", lang.hitch(this,this._on_cell_call));
		on(this.search_form_pane,"onLoad", lang.hitch(this,this._connect_pane));

		this.inherited(arguments);
	},
	_on_cell_call : function(e)
	{
		var row=e.rows[0].data;

		this.outlet_advance_ctrl.load( row.advancefeatureid, row.outletid );
		domclass.remove(this.outlet_advance_ctrl.domNode,"prmaxhidden");
	},
	_connect_pane:function( )
	{
		on( registry.byId(this.form_name),"onSubmit",lang.hitch(this,this._submit));
	},
	_submit:function()
	{
		this._do_search();
	},
	_clear_search:function()
	{
		var form = this._get_form();
		array.every(form.getChildren(),
			function(widget)
			{
				if ( widget.clear != null)
				{
					widget.clear();
				}
				if ( widget.Clear != null)
				{
					widget.Clear();
				}

				return true;
			});

		this.searchbutton.cancel();
	},
	_clear_search_results:function()
	{
		request.post('/advance/delete_list_all',
			utilities2.make_params({})).then
			(this._clear_all_call_back);
	},
	_clear_all_call:function( response )
	{
		this.searchgrid.set("query", {});
		domclass.add(this.outlet_advance_ctrl.domNode,"prmaxhidden");
	},
	_search:function()
	{
		this._do_search();
	},
	_do_search:function()
	{
		var form = this._get_form();
		form.setExtendedMode(false);
		var content = form.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid'] = 3 ;
		content['research'] = 1;

		request.post('/search/dosearch',
			utilities2.make_params({data:content})).then
			(this._load_call_back);
	},
	_load_call:function( response )
	{
		this.searchgrid.set("query",{});
		this.searchbutton.cancel();
	},
	_get_form:function()
	{
		return this.std_search_advance.get("form");
	}
});
});
