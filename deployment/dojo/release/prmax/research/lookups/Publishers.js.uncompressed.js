require({cache:{
'url:research/lookups/templates/Publishers.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Publisher filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td><label>Publisher Name</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td><label>Source</label></td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_sourcetype\" data-dojo-props='name:\"filter_sourcetype\",maxlength:45,autoComplete:true,searchAttr:\"name\", required:false'></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_publisher\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\r\n\t<div data-dojo-attach-point=\"publisher_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Add\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_add_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"publisher_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publisher Update\"'>\r\n\t\t<div data-dojo-attach-point=\"publisher_update_ctrl\" data-dojo-type=\"prcommon2/publisher/PublisherAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    Publisher.js
// Author:  Chris Hoy
// Purpose:
// Created: 07/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/lookups/Publishers", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Publishers.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/data/ItemFileReadStore",	
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
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, ItemFileReadStore, request, utilities2, json, topic, lang ){
 return declare("research.lookup.Publishers",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/publisher/list2', idProperty:"publisherid"}));
		this._sourcetypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes"});

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
			{label: 'www ',className: "standard",field:'www'},
			{label: 'Source ',className: "standard",field:'sourcename'}
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
		this.filter_sourcetype.set("store", this._sourcetypes);
		this.filter_sourcetype.set("value", -1);


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
		if (arguments[0].filter_sourcetype != -1)
			query["sourcetypeid"] = arguments[0].filter_sourcetype;
			

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





