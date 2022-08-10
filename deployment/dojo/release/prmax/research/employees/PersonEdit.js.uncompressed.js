require({cache:{
'url:research/employees/templates/PersonEdit.html':"<div>\r\n\t<div data-dojo-props='style:\":width:820px;height:700px\",title:\"details_view\",region:\"center\"' data-dojo-attach-point=\"details_view\"  data-dojo-type=\"dijit/layout/TabContainer\" >\r\n\t\t<div  data-dojo-type=\"dijit/layout/BorderContainer\"  data-dojo-props='style:\"width:100%;height:100%\",title:\"Details\"' data-dojo-attach-point=\"details_tab\">\r\n\t\t\t<div data-dojo-attach-point=\"top\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:width:100%;height:35%\",splitter:true'>\r\n\t\t\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",onSubmit:\"return false\"' data-dojo-attach-point=\"formUpdate\" data-dojo-type=\"dijit/form/Form\">\r\n<!--\r\n\t\t\t\t\t<input data-dojo-attach-point=\"contactid\" data-dojo-props='name:\"contactid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n-->\r\n\t\t\t\t\t<table cellspacing =\"1\" cellpadding=\"1\" width=\"100%\">\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Contact ID</td><td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width: 5em\",\"class\":\"prmaxinput\",name:\"contactid\", readOnly:true' data-dojo-attach-point=\"contactid\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Prefix</td><td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width: 2em\",\"class\":\"prmaxinput\",name:\"prefix\"' data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">First</td><td colspan=\"2\"><input data-dojo-props= '\"class\":\"prmaxinput\",name:\"firstname\",style:\"width: 5em;\",type:\"text\",trim:true' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input data-dojo-attach-point=\"familyname\" data-dojo-props='\"class\":\"prmaxrequired\", name:\"familyname\", type:\"text\", trim:true, required:\"true\",style:\"width: 12em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Middle</td><td><input data-dojo-attach-point=\"middlename\" data-dojo-props='name:\"middlename\", type:\"text\", trim:true,style:\"width: 12em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\" data-dojo-props='name:\"countryid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",autoComplete:true'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Source</td><td ><select data-dojo-attach-point=\"sourcetypeid\" data-dojo-props='searchAtt:\"name\",labelType:\"html\",style:\"width:300px\",\"class\":\"prmaxrequired\",name:\"sourcetypeid\"' data-dojo-type =\"dijit/form/FilteringSelect\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Reason Code</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-props='searchAtt:\"name\",labelType:\"html\",style:\"width:300px\",\"class\":\"prmaxrequired\",name:\"reasoncodeid\"' data-dojo-type =\"dijit/form/FilteringSelect\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"left\" ><button data-dojo-attach-point=\"deletebtn\" data-dojo-attach-event=\"onClick:_delete_contact\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"'></button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\" valign=\"bottom\" ><button data-dojo-attach-event=\"onClick:_update_contact\" data-dojo-attach-point=\"updatenode\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Update\"' data-dojo-type=\"dojox/form/BusyButton\" ></button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\" valign=\"bottom\" ><button data-dojo-attach-event=\"onClick:_merge_contact\" data-dojo-attach-point=\"mergenode\" data-dojo-props='type:\"button\",label:\"Merge\"' data-dojo-type=\"dijit/form/Button\" ></button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"people_details_employee_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' ></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"audit_ctrl\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='objecttypeid:\"5\",style:\"width:100%;height:100%\",title:\"Audit\"'></div>\r\n\t</div>\r\n\t<div data-dojo-props='region:\"bottom\",style:\"width:100%\",height:\"2em\"' data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t<button data-dojo-attach-event=\"onClick:_close_edit\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"'></button>\r\n\t</div>\r\n\r\n\t<div data-dojo-attach-point=\"person_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Person\"'>\r\n\t\t<div data-dojo-attach-point=\"person_delete_ctrl\" data-dojo-type=\"research/employees/PersonDelete\" style=\"width:400px;height:200px\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"contact_merge_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Merge selected Contact to\"'>\r\n\t\t<div data-dojo-attach-point=\"contact_merge_ctrl\" data-dojo-type=\"research/employees/ContactMerge\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.employee.PersonEdit
// Author:  
// Purpose: 
// Created: Oct 2017
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/employees/PersonEdit", [
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
	"dojo/data/ItemFileReadStore",		
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
	], function(declare, BaseWidgetAMD, template, request, utilities2, JsonRest, json, lang, topic, Grid, domclass, ItemFileReadStore, BorderContainer ){
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
		this._sourcetypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=sourcetypes"});

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
		this.sourcetypeid.set("store", this._sourcetypes);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		
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
		this.sourcetypeid.set("value", 2);
		this.countryid.set("value", "");
		this.contactid.set("value", "");
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
		this.sourcetypeid.set("disabled",status);
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
			this.contactid.set("value", response.contact.contactid );
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
		this.contactid.set("value", contact.contactid);
		this.prefix.set("value", contact.contact.prefix);
		this.firstname.set("value", contact.contact.firstname);
		this.familyname.set("value", contact.contact.familyname);
		this.middlename.set("value", contact.contact.middlename);
		this.sourcetypeid.set("value", contact.contact.sourcetypeid);

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
