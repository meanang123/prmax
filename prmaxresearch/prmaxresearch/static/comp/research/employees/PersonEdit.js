//-----------------------------------------------------------------------------
// Name:    prmax.employee.PersonEdit
// Author:  
// Purpose: 
// Created: Oct 2017
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/PersonEdit.html",
	"dojo/request",
	"ttl/utilities2",
	"ttl/store/JsonRest",	
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"ttl/grid/Grid",
	"dojo/dom-class",	
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/employees/PersonDelete",
	"research/audit/AuditViewer",
	"research/employees/ContactMerge",
	], function(declare, BaseWidgetAMD, template, request, utilities2, JsonRest, json, lang, topic, Grid, domclass,BorderContainer ){
 return declare("research.employees.PersonEdit",
	[BaseWidgetAMD,BorderContainer],{
	displayname:"Person Edit",
	templateString: template,
	constructor: function()
	{
		this._parentcallback = null;
		this._dialog = null;
		
		this._GetEntryCallBack = lang.hitch(this, this._get_contact_entry);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._updated_call_back = lang.hitch(this, this._updated_call);
		
		this.people_employee_model = new JsonRest({target:'/research/admin/contacts/research_contact_employee', idProperty:"employeesid"});

		topic.subscribe(PRCOMMON.Events.Person_Update, lang.hitch(this,this._person_update_event));
		topic.subscribe(PRCOMMON.Events.Person_Delete, lang.hitch(this,this._person_delete_event));		
		topic.subscribe('contacts/merge_contact', lang.hitch(this,this._contact_merge_event));		

	},
	postCreate:function()
	{
		var cells =
		[
			{label: " ", className:"grid-field-icon-view",formatter:utilities2.format_row_ctrl},
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

		this.people_details_employee_grid_view.set("content", this.people_details_employee_grid);		
		this.people_details_employee_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);
	},	
	clear:function()
	{
		this._clear_form();
	},
	load:function(dialog, contactid, contactname)
	{
		this._dialog = dialog;
		this._contactid = contactid;
		this._contactname = contactname;
		
		this.people_details_employee_grid.set( "query", {contactid:this._contactid });
		this.audit_ctrl.load(this._contactid) ;
		request.post('/research/admin/contacts/get',
			utilities2.make_params({data:{contactid:this._contactid}})).
			then (this._load_call_back);

		this.details_view.selectChild(this.details_tab);
	},
	_clear_form:function()
	{
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_setCallbackAttr:function( func)
	{
		this._parentcallback = func;
	},
	focus:function()
	{
		this.prefix.focus();
	},
	disabled:function( status )
	{
		this.prefix.set("disabled",status);
		this.firstname.set("disabled",status);
		this.familyname.set("disabled",status);
		this.reasoncodeid.set("disabled",status);
	},
	_delete_contact:function()
	{
		this.person_delete_ctrl.load(this._contactid, this._contactname );
		this.person_delete_dlg.show();
	},
	_update_contact:function()
	{
		if ( utilities2.form_validator(this.formUpdate)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		var data = this.formUpdate.get("value");
		data['contactid'] = this._contactid;
		request.post("/research/admin/contacts/research_update",
			utilities2.make_params({data:data})).
			then ( this._updated_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success=="OK")
		{
			this.prefix.set("value", response.contact.prefix );
			this.firstname.set("value", response.contact.firstname );
			this.familyname.set("value", response.contact.familyname );
			this.middlename.set("value", response.contact.middlename);
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
			if ( response.contact.inuse == true )
				domclass.add(this.deletebtn.domNode,"prmaxhidden");
			else
				domclass.remove(this.deletebtn.domNode,"prmaxhidden");
		}
	},	
	_person_delete_event:function(contact)
	{
		this.person_delete_dlg.hide();
		this.clear();
	},	
	_merge_contact:function()
	{
		this.contact_merge_ctrl.load(this._contactid,this._contactname,this.contact_merge_dlg);
	},
	_contact_merge_event:function(contact)
	{
		this.people_details_employee_grid.set( "query", {contactid:contact.contactid });
		this.audit_ctrl.load(contact.contactid) ;
	},	
	_updated_call:function ( response )
	{
		if ( response.success == "OK" )
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
	_person_update_event:function(contact)
	{
		this.updatenode.cancel();
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},	
	_close_edit:function()
	{
		this._dialog.hide();
	},
	
});
});
