require({cache:{
'url:prcommon2/contact/templates/ContactSelectMain.html':"<div class=\"dijit dijitReset dijitInline dijitLeft dijitTextBox dijitValidationContainer dijitInputField dijitTextBox\">\r\n\t<p style=\"float:left;position:relative;top:3px;white-space: nowrap;overflow:hidden;width:60%\" class=\"PlaceHolder dijitReset\" data-dojo-attach-point=\"display\"></p>\r\n\t<button data-dojo-attach-event=\"onClick:_select\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Select a contact\",style:\"float:right;padding:0px;margin:0px\",iconClass:\"fa fa-search\",showLabel: false',\"class\",\"dijitReset\"></button>\r\n\t<div data-dojo-attach-point=\"select_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Select Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"height:500px;width:500px\"'>\r\n\t\t\t<div data-dojo-attach-point=\"searchFrame\" data-dojo-props='region:\"top\",style:\"width:100%;height:100px\",splitter:true'  data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t\t<table>\r\n\t\t\t\t\t<tr><td><label>Surname</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:true,maxlength:45,type:\"text\"'  ></td></tr>\r\n\t\t\t\t\t<tr><td><label>Person Id</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_personid\" data-dojo-props='name:\"filter_personid\",trim:true,maxlength:45,type:\"text\"'></td></tr>\r\n\t\t\t\t\t<tr><td><button data-dojo-attach-point=\"newbutton\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"New Person\"' data-dojo-attach-event=\"onClick:_add_contact\"></button></td>\r\n\t\t\t\t\t<td><button data-dojo-attach-point=\"clearbutton\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Clear Search\"' data-dojo-attach-event=\"onClick:_clear_search\"></button></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-props='region:\"center\",splitter:true' data-dojo-attach-point=\"people_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\"></div>\r\n\t\t\t<div data-dojo-props='region:\"bottom\",style:\"width:100%\",height:\"2em\"' data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"'></button>\r\n\t\t\t\t<button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",\"class\":\"prmaxbutton\",busyLabel:\"Searching...\",label:\"Search\"' ></button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div data-dojo-attach-point=\"person_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Contact\",style:\"width:400px;height:200px\"' >\r\n\t\t<div data-dojo-attach-point=\"person_add_ctrl\" data-dojo-type=\"research/employees/PersonNew\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"person_edit_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Contact Info\"' >\r\n\t\t<div data-dojo-attach-point=\"person_edit_ctrl\" data-dojo-type=\"research/employees/PersonEdit\" data-dojo-props='style:\"width:820px;height:700px\"'></div>\r\n\t</div>\r\n\r\n</div>\r\n"}});
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
define("prcommon2/contact/ContactSelectMain", [
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
	placeHolder:"",	
	searchtypeid:6,
	constructor: function()
	{
		this._contactid = null;
		this._contact = null;
		this._selected_call_back = null;
		this._outletid = null;

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
			store: this.model,
			query:utilities2.EMPTYGRID
		});

		this.people_grid_view.set("content", this.people_grid);
		this.people_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		
		domattr.set(this.display,"innerHTML",this.placeHolder);

		this.inherited(arguments);
	},
	_setValueAttr:function( value)
	{
		this._contactid = value;
	},
	_setOutletidvalueAttr:function(value)
	{
		this._outletid = value;
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
		this._clear_search();
		this.select_dlg.show();
	},
	_clear_search:function()
	{
		this.filter.set("value", null);
		this.filter_personid.set("value", null);
//		this.filter = null;
//		this.filter_personid = null;
		var query = utilities2.EMPTYGRID;
		this.people_grid.set('query', query);
	},
	clear:function()
	{
		this._contactid = null;
		//this.display.innerHTML = this.placeHolder;
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
		if (this._outletid)
			query["outletid"] = this._outletid;
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
		this.person_add_ctrl.load(this.person_add_dlg);
		this.person_add_dlg.show();
	},
	_add_event:function ( contact )
	{
		this.model.add(contact);
		this._clear();
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

