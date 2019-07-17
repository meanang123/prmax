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
	"dojo/text!../contact/templates/ContactSelectMain.html",
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
	"research/employees/PersonNew",
	"research/employees/PersonEdit",
	"research/employees/ContactMerge",
	], function(declare, BaseWidgetAMD, template, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass ){
 return declare("prcommon2.contact.ConctactSelectMain",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	placeHolder:"Select Contact",	
	searchtypeid:6,
	constructor: function()
	{
		this._contactid = null;
		this._contact = null;
		this._selected_call_back = null;

		this.model = new Observable( new JsonRest( {target:'/research/admin/contacts/research_contactlist', idProperty:"contactid"}));
		this.people_employee_model = new JsonRest({target:'/research/admin/contacts/research_contact_employee', idProperty:"employeesid"});

		topic.subscribe(PRCOMMON.Events.Person_Added,lang.hitch(this, this._add_event));
		topic.subscribe(PRCOMMON.Events.Person_Delete, lang.hitch(this,this._person_delete_event));
		topic.subscribe(PRCOMMON.Events.Person_Update, lang.hitch(this,this._person_update_event));
		topic.subscribe('contacts/merge_contact', lang.hitch(this,this._person_merge_event));
		
	},
	postCreate:function()
	{
		var cells =
		[
			{label: " ", className:"grid-field-icon-view",formatter:utilities2.format_row_ctrl},
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
		this.people_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		
		domattr.set(this.display,"innerHTML",this.placeHolder);

		this.inherited(arguments);
	},
	_setValueAttr:function( value)
	{
		this._contactid = value ;
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
		domattr.set(this.display,"innerHTML",this.placeHolder);
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
		this.searchbutton.cancel();
	},
	_on_cell_call:function (e )
	{
		var cell = this.people_grid.cell(e);
		this._contact = cell.row.data;
		if (cell.column.id == 0)
		{
			this.person_edit_ctrl.load( this.person_edit_dlg, this._contact.contactid, this._contact.contactname);
			this.person_edit_dlg.show();
		}
		else
		{
			domattr.set(this.display, "innerHTML", this._contact.contactname);
			this._contactid = this._contact.contactid;
			this.select_dlg.hide();
//			if ( this._contact && this._selected_call_back)
//			{
//				this._selected_call_back(this._contact);
//				this.select_dlg.hide();
//			}
		}
	},
	_setCallbackAttr:function(func)
	{
		this._selected_call_back = func;
	},
	_add_contact:function( )
	{
		this.person_add_ctrl.clear();
		this.person_add_dlg.show();
	},
	_add_event:function ( contact )
	{
		this.model.add(contact);
		this.person_add_dlg.hide();
	},
	_close_person_info:function()
	{
		this.person_info_dlg.hide();
	},
	_delete_contact:function()
	{
		this.person_delete_ctrl.load( this._contact.contactid, this._contact.contactname );
		this.person_delete_dlg.show();
	},
	_person_delete_event:function ( contact )
	{
		this.model.remove ( contact.contactid);
	},
	_person_merge_event:function ( contact )
	{
		this.model.remove ( contact.sourcecontactid);
	},
	_person_update_event:function ( contact )
	{
		this.model.put( contact);
	},
});
});

