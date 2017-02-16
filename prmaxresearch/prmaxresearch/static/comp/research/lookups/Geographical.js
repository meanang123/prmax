//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Geographical.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dijit/layout/StackContainer",
	"prcommon2/interests/Interests",
	"prcommon2/geographical/GeographicalEdit",
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore ){
 return declare("research.lookup.Geographical",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this.geographical_types = new ItemFileReadStore ({ url:"/common/lookups?searchtype=geographicallookuptypes&nofilter=1"});

		this._store = new Observable( new JsonRest( {target:'/research/admin/geographical/list', idProperty:"geographicalid"}));
		this._coverage_store = new JsonRest( {target:'/research/admin/geographical/coverage', idProperty:"coverageid"});
		this.children_store = new JsonRest( {target:'/research/admin/geographical/geographical_children', idProperty:"geographicalareaid"});

		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Delete, dojo.hitch(this,this._geog_delete_event));
		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Update, dojo.hitch(this,this._geog_update_event));
		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Add, dojo.hitch(this,this._geog_add_event));
		dojo.subscribe(PRCOMMON.Events.Coverage_Moved, dojo.hitch(this,this._coverage_moved_event));
	},
	postCreate:function()
	{
		//main list of geographical areas
		var cells =
		[
			{label:' ', field: 'geographicalid', sortable: false, formatter:utilities2.generic_view, className:"grid-field-image-view"},
			{label:'Id', field: 'geographicalid', className:"dgrid-column-nbr-right"},
			{label: 'Area', className: "standard", field:'geographicalname'},
			{label: 'Type', className: "dgrid-column-status-large", field:'geographicallookupdescription'}
		];

		this.geographical_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})

		this.geographical_grid.on("dgrid-select", dojo.hitch(this,this._on_geographical_grid_call));

		var cells = [ {label: 'Outlet',className: "standard",field:'outletname'} ];

		this.coverage_grid = new Grid({
			columns: cells,
			selectionMode: "none",
			store: this._coverage_store
		})

		this.geographicallookups.set("store", this.geographical_types);
		this.geographicallookups.set("value", -1);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.coverage_grid_view.set("content", this.coverage_grid);
		this.geographical_grid_view.set("content", this.geographical_grid);
	},
	_execute:function()
	{
		var query = {filter:arguments[0].filter, geographicallookuptypeid:-1};
		if ( arguments[0].geographicallookuptypeid != "-1" )
			query["geographicallookuptypeid"] = arguments[0].geographicallookuptypeid;

		this.geographical_grid.set( "query",query);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.geographicallookuptypeid.set("value",-1);
	},

	_on_geographical_grid_call : function( evt )
	{
		this._row = evt.rows[0].data;
		this._show_details();
	},
	_show_details:function()
	{
		this.edit_view.selectChild( this.edit_view_page );
		this.geographical_edit.load ( this._row.geographicalid );
		this.coverage_grid.set( "query", {geographicalid:this._row.geographicalid} );
	},
	_hide_details:function()
	{
		this.edit_view.selectChild( this.blank );
		this.geographical_edit.load ( -1 );
		this._row = null;
	},
	_add_new:function()
	{
		this.geographical_add.load(-1, this.geographical_add_dlg);
		this.geographical_add_dlg.show();
	},
	_geog_delete_event:function( geographicalid )
	{
		this._store.remove(geographicalid);
		this._hide_details();
	},
	_geog_update_event:function( data )
	{
		this._store.put ( data );
	},
	_geog_add_event:function ( data )
	{
		this._store.add ( data );
	},
	_coverage_moved_event:function()
	{
		this.coverage_grid.set( "query", {geographicalid:this._row.geographicalid});
	}
});
});





