require({cache:{
'url:research/lookups/templates/Geographical.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter Geographical\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Geographical filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Area</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:true,maxlength:45, type:\"text\"'></td></tr>\r\n\t\t\t\t\t\t<tr><td>Type</td><td><select data-dojo-attach-point=\"geographicallookups\" name=\"geographicallookuptypeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='searchAttr:\"name\",labelType:\"html\"' /></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true,label:\"Add\"' data-dojo-attach-event=\"onClick:_add_new\"></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\",splitter:true' data-dojo-attach-point=\"geographical_grid_view\"></div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"center\",splitter:true' data-dojo-attach-point=\"edit_view\" >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"blank\" data-dojo-props='title:\"Blank\"'></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\",splitter:true' data-dojo-attach-point=\"edit_view_page\" >\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"Details\"' >\r\n\t\t\t\t<div data-dojo-attach-point=\"geographical_edit\" data-dojo-type=\"prcommon2/geographical/GeographicalEdit\" data-dojo-props='style:\"width:100%;height:100%\"'></div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"Geo. Coverage\",style:\"width:100%;height:100%\"' data-dojo-attach-point=\"coverage_grid_view\"></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/Dialog\" title=\"Add Geographical Area\" data-dojo-attach-point=\"geographical_add_dlg\" style=\"width:400px\">\r\n\t\t<div data-dojo-attach-point=\"geographical_add\" data-dojo-type=\"prcommon2/geographical/GeographicalEdit\" style=\"width:100%;height:100%\" ></div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("research/lookups/Geographical", [
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
	"dijit/layout/StackContainer",
	"prcommon2/interests/Interests",
	"prcommon2/geographical/GeographicalEdit",
	"dijit/layout/TabContainer"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang ){
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

		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Delete, lang.hitch(this,this._geog_delete_event));
		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Update, lang.hitch(this,this._geog_update_event));
		dojo.subscribe(PRCOMMON.Events.Geographical_Area_Add, lang.hitch(this,this._geog_add_event));
		dojo.subscribe(PRCOMMON.Events.Coverage_Moved, lang.hitch(this,this._coverage_moved_event));
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
			query:{},
			sort: [{ attribute: "geographicalname", descending: false }]
		})

		this.geographical_grid.on("dgrid-select", lang.hitch(this,this._on_geographical_grid_call));

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





