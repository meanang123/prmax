//-----------------------------------------------------------------------------
// Name:    People.js
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/People.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/data/ItemFileReadStore",	
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"research/employees/PersonNew",
	"research/employees/PersonDelete",
	"research/audit/AuditViewer",
	"research/employees/ContactMerge",
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, ItemFileReadStore, request, utilities2, json,  lang, topic, domattr, domclass ){
 return declare("research.employees.People",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable(new JsonRest({target:'/research/admin/contacts/research_contactlist', idProperty:"contactid"}));
		this.people_employee_model = new JsonRest({target:'/research/admin/contacts/research_contact_employee', idProperty:"employeesid"});
		this._sourcetypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes&nofilter=1"});
		this._sourcetypes2 = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes"});

		this._GetEntryCallBack = lang.hitch(this, this._get_contact_entry);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._updated_call_back = lang.hitch(this, this._updated_call);

		topic.subscribe(PRCOMMON.Events.Person_Added, lang.hitch(this,this._person_add_event));
		topic.subscribe(PRCOMMON.Events.Person_Update, lang.hitch(this,this._person_update_event));
		topic.subscribe(PRCOMMON.Events.Person_Delete, lang.hitch(this,this._person_delete_event));
		topic.subscribe('contacts/merge_contact', lang.hitch(this,this._contact_merge_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Id',className: "dgrid-column-nbr-right",field:"contactid"},
			{label: 'Display Name',className: "standard",field:"contactname"},
			{label: 'Source',className: "standard",field:"sourcename"}
		];
		this.people_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store
		});

		this.people_grid_view.set("content", this.people_grid);
		this.people_grid.on("dgrid-select", lang.hitch(this,this._on_cell_call));

		cells =
		[
			{label: 'Outlet Name',className: "dgrid-column-address-short",field:"outletname"},
			{label: 'Job Title ',className: "dgrid-column-address-short",field:"job_title"},
			{label: 'Source',className: "dgrid-column-status-small",field:"sourcename"},
			{label: 'Media Channel',className: "dgrid-column-status",field:"prmax_outlettypename"},
			{label: 'Country',className: "dgrid-column-status-large",field:"countryname"}
		];


		this.people_details_employee_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.people_employee_model
		});

		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.filter_sourcetype.set("store", this._sourcetypes);
		this.filter_sourcetype.set("value", -1);
		this.sourcetypeid.set("store", this._sourcetypes2);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.people_details_employee_grid_view.set("content", this.people_details_employee_grid);
	},
	_on_cell_call : function(e) {

		this._row = e.rows[0].data;

		this.contactid.set("value",this._row.contactid ) ;
		this.people_details_employee_grid.set( "query", {contactid:this._row.contactid});
		this.audit_ctrl.load( this._row.contactid  ) ;
		request.post('/research/admin/contacts/get',
			utilities2.make_params({ data: { contactid : this._row.contactid }})).
			then (this._load_call_back);

		this.controls.selectChild(this.details_view);
		this.details_view.selectChild(this.details_tab);
	},
	_load_call:function( response )
	{
		if ( response.success=="OK")
		{
			this.prefix.set("value", response.contact.prefix );
			this.firstname.set("value", response.contact.firstname );
			this.familyname.set("value", response.contact.familyname );
			this.middlename.set("value", response.contact.middlename);
			this.sourcetypeid.set("value", response.contact.sourcetypeid);
			this.countryid.set("value", response.contact.countryid);
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			if ( response.contact.inuse == true )
				domclass.add(this.deletebtn.domNode,"prmaxhidden");
			else
				domclass.remove(this.deletebtn.domNode,"prmaxhidden");
		}
	},
	_execute:function()
	{
		var query = {};

		if (arguments[0].filter.length>0)
			query["filter"] = arguments[0].filter;
		if (arguments[0].filter_personid.length>0)
			query["contactid"] = arguments[0].filter_personid;
		if (arguments[0].filter_sourcetype != -1)
			query["sourcetypeid"] = arguments[0].filter_sourcetype;

		this.people_grid.set("query", query);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.filter_personid.set("value","");
		this.filter_sourcetype.set("value",-1);
	},
	_add:function()
	{
		this.person_add_ctrl.clear();
		this.person_add_ctrl.load(this.person_add_dlg);		
		this.person_add_dlg.show();
	},
	_person_add_event:function ( contact )
	{
		this._store.add(contact);
		this.person_add_dlg.hide();
	},
	_person_update_event:function( contact )
	{
		this._store.put( contact);
	},
	_person_delete_event:function ( contact )
	{
		this._store.remove ( contact.contactid);
		this.controls.selectChild(this.blank);
		this._row = null;
		this.person_delete_dlg.hide();
	},
	_update_contact:function()
	{
		if ( utilities2.form_validator(this.formUpdate)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post("/research/admin/contacts/research_update",
			utilities2.make_params({data:this.formUpdate.get("value")})).
			then ( this._updated_call_back);
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_updated_call:function ( response )
	{
	
		if (response.success == "DEL")
		{
			alert("Contact '" + response.data.firstname+ " " + response.data.familyname + "' has previously asked to be deleted");
		}	
		else if ( response.success == "OK" )
		{
			alert("Contact Updated") ;
			topic.publish(PRCOMMON.Events.Person_Update, response.contact);
			this._clear_reason();
		}
		else
		{
			alert("Problem Updated Contact" ) ;
		}
		this.updatenode.cancel();
	},
	_delete_contact:function()
	{
		this.person_delete_ctrl.load( this._row.contactid, this._row.contactname );
		this.person_delete_dlg.show();
	},
	_merge_contact:function()
	{
		this.contact_merge_ctrl.load(this._row.contactid,this._row.contactname,this.contact_merge_dlg);
	},
	_contact_merge_event:function(contact)
	{
		this._store.remove ( contact.sourcecontactid);
		this.contactid.set("value", contact.contactid);
		this.prefix.set("value", contact.contact.prefix);
		this.firstname.set("value", contact.contact.firstname);
		this.familyname.set("value", contact.contact.familyname);
		this.middlename.set("value", contact.contact.middlename);
		this.sourcetypeid.set("value", contact.contact.sourcetypeid);
		this.people_details_employee_grid.set( "query", {contactid:contact.contactid});
		this.audit_ctrl.load(contact.contactid);
	},
});
});





