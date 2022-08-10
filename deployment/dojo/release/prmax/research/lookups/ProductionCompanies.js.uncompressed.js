require({cache:{
'url:research/lookups/templates/ProductionCompanies.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Production Company Dates filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Text</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_production_company\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\r\n\t<div data-dojo-attach-point=\"production_company_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Production Company Add\"'>\r\n\t\t<div data-dojo-attach-point=\"production_company_add_ctrl\" data-dojo-type=\"prcommon2/production/ProductionCompanyAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"production_company_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Production Company Update\"'>\r\n\t\t<div data-dojo-attach-point=\"production_company_update_ctrl\" data-dojo-type=\"prcommon2/production/ProductionCompanyAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    production_company.js
// Author:  Chris Hoy
// Purpose:
// Created: 10/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/lookups/ProductionCompanies", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/ProductionCompanies.html",
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
	"prcommon2/production/ProductionCompanyAdd",
	"dijit/Dialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic, lang ){
 return declare("research.lookups.ProductionCompanies",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/production/list', idProperty:"productioncompanyid"}));

		topic.subscribe(PRCOMMON.Events.Production_Company_Update, lang.hitch(this, this._update_event));
		topic.subscribe(PRCOMMON.Events.Production_Company_Added, lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Production_Company_Deleted, lang.hitch(this, this._delete_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label:' ', field:'productioncompanyid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Production Company',className: "standard",field:'productioncompanydescription'}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.production_company_add_ctrl.set("dialog", this.production_company_add_dlg);
		this.production_company_update_ctrl.set("dialog", this.production_company_update_dlg);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.production_company_update_ctrl.load ( e.rows[0].data.productioncompanyid );
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter)
			query["productioncompanydescription"] = arguments[0].filter;

		this.grid.set("query",query);
	},
	_new_production_company:function()
	{
		this.production_company_add_ctrl.clear();
		this.production_company_add_dlg.show();

	},
	_clear_filter:function()
	{
		this.filter.set("value","");
	},
	_update_event:function( production_company )
	{
		this._store.put( production_company );
	},
	_add_event:function( production_company )
	{
		this._store.add( production_company );
	},
	_delete_event:function(productioncompanyid)
	{
		this._store.remove( productioncompanyid );
	}
});
});





