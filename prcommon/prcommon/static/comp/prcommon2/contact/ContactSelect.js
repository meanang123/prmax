//-----------------------------------------------------------------------------
// Name:    prcommon2.contact.ContactSelect
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
	"dojo/text!../contact/templates/ContactSelect.html",
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
	"prcommon2/search/EmployeeSearch",
	"dijit/layout/ContentPane",
	"dojox/data/JsonRestStore",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"research/employees/PersonNew"
	
	], function(declare, BaseWidgetAMD, template, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass ){
 return declare("prcommon2.contact.ConctactSelect",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	searchtypeid:6,
	constructor: function()
	{
		this._contactid = null;
		this._selected_call_back = null;

		this.model = new Observable( new JsonRest( {target:'/research/admin/contacts/research_contactlist', idProperty:"contactid"}));
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Id',className:"dgrid-column-nbr-right", field:"contactid"},
			{label: 'Contact',className:"standard", field:"contactname"},
			{label: 'Source',className:"dgrid-column-status-small", field:"sourcename"}
		];

		this.people_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model
		});

		this.people_grid_view.set("content", this.people_grid);
		this.people_grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.inherited(arguments);
	},
	_setValueAttr:function( value)
	{
		this._contactid = value ;
		this._set_view();
	},
	_setDisplayvalueAttr:function( value)
	{
		domattr.set(this.display,"innerHTML",value);
	},
	_getValueAttr:function()
	{
		return this._contactid;
	},
	_clear:function()
	{
		this.clear();
	},
	_select:function()
	{
		this.select_dlg.startup();
		this.select_dlg.show();
	},
	clear:function()
	{
		this._contactid = null;
		domattr.set(this.display,"innerHTML","");
		this._set_view();
	},
	_close:function()
	{
		this.select_dlg.hide();
	},
	_search:function()
	{
		var query={};
		
		if (this.filter.get("value").length>0)
			query["filter"] = this.filter.get("value");
		if (this.filter_personid.get("value").length>0)
			query["contactid"] = this.filter_personid.get("value");

		this.people_grid.set("query", query);
		
		throw "N" ;
	},
	_on_cell_call:function (e )
	{
		var contact = e.rows[0].data;
		if ( contact && this._selected_call_back)
		{
			this._selected_call_back(contact);
			this.select_dlg.hide();
			this._set_view();
		}
	},
	_setCallbackAttr:function(func)
	{
		this._selected_call_back = func;
	}
});
});

