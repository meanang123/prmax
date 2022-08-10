require({cache:{
'url:research/employees/templates/People.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Interest  filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td><label>Surname</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:true,maxlength:45,type:\"text\"'  ></td></tr>\r\n\t\t\t\t\t\t<tr><td><label>Person Id</label></td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_personid\" data-dojo-props='name:\"filter_personid\",trim:true,maxlength:45,type:\"text\"'></td></tr>\r\n\t\t\t\t\t\t<tr><td><label>Source</label></td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_sourcetype\" data-dojo-props='name:\"filter_sourcetype\",maxlength:45,autoComplete:true,searchAttr:\"name\", required:false'></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true,label:\"New\"' data-dojo-attach-event=\"onClick:_add\"></div>\r\n\t\t</div>\r\n\t</div>\r\n \t<div data-dojo-attach-point=\"people_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\",splitter:\"true\"' ></div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"center\", splitter:true'>\r\n\t\t<div  data-dojo-props='title:\"blank\"' data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\"></div>\r\n\t\t<div  data-dojo-props='style:\"width:100%;height:100%\",title:\"details_view\"' data-dojo-attach-point=\"details_view\"  data-dojo-type=\"dijit/layout/TabContainer\" >\r\n\t\t\t<div  data-dojo-type=\"dijit/layout/BorderContainer\"  data-dojo-props='style:\"width:100%;height:100%\",title:\"Details\" ' data-dojo-attach-point=\"details_tab\">\r\n\t\t\t\t<div data-dojo-attach-point=\"top\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:50%\",splitter:true'>\r\n\t\t\t\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",onSubmit:\"return false\"' data-dojo-attach-point=\"formUpdate\" data-dojo-type=\"dijit/form/Form\">\r\n<!--\r\n\t\t\t\t\t\t<input data-dojo-attach-point=\"contactid\" data-dojo-props='name:\"contactid\"' data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n-->\r\n\t\t\t\t\t\t<table cellspacing =\"1\" cellpadding=\"1\" width=\"100%\">\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Contact ID</td><td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width: 5em\",\"class\":\"prmaxinput\",name:\"contactid\", readOnly:true' data-dojo-attach-point=\"contactid\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Prefix</td><td colspan=\"2\"><input data-dojo-props='type:\"text\",trim:true,style:\"width: 2em\",\"class\":\"prmaxinput\",name:\"prefix\"' data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">First</td><td colspan=\"2\"><input data-dojo-props= '\"class\":\"prmaxinput\",name:\"firstname\",style:\"width: 5em;\",type:\"text\",trim:true' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input data-dojo-attach-point=\"familyname\" data-dojo-props='\"class\":\"prmaxrequired\", name:\"familyname\", type:\"text\", trim:true, required:\"true\",style:\"width: 12em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Middle</td><td><input data-dojo-attach-point=\"middlename\" data-dojo-props='name:\"middlename\", type:\"text\", trim:true,style:\"width: 12em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\" data-dojo-props='name:\"countryid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",autoComplete:true'/></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Source</td><td ><select data-dojo-attach-point=\"sourcetypeid\" data-dojo-props='searchAtt:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\",name:\"sourcetypeid\"' data-dojo-type =\"dijit/form/FilteringSelect\" /></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Reason Code</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-props='searchAtt:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\",name:\"reasoncodeid\"' data-dojo-type =\"dijit/form/FilteringSelect\" /></td></tr>\r\n\t\t\t\t\t\t\t<tr><td align=\"left\" ><button data-dojo-attach-point=\"deletebtn\" data-dojo-attach-event=\"onClick:_delete_contact\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"'></button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\" valign=\"bottom\" ><button data-dojo-attach-event=\"onClick:_update_contact\" data-dojo-attach-point=\"updatenode\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Update\"' data-dojo-type=\"dojox/form/BusyButton\" ></button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\" valign=\"bottom\" ><button data-dojo-attach-event=\"onClick:_merge_contact\" data-dojo-attach-point=\"mergenode\" data-dojo-props='type:\"button\",label:\"Merge\"' data-dojo-type=\"dijit/form/Button\" ></button></td></tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</form>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-attach-point=\"people_details_employee_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\", splitter:true' ></div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-point=\"audit_ctrl\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='objecttypeid:\"5\",style:\"width:100%;height:100%\",title:\"Audit\"'></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"person_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add New Person\"'>\r\n\t\t<div data-dojo-attach-point=\"person_add_ctrl\" data-dojo-type=\"research/employees/PersonNew\" style=\"width:400px;height:200px\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"person_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Person\"'>\r\n\t\t<div data-dojo-attach-point=\"person_delete_ctrl\" data-dojo-type=\"research/employees/PersonDelete\" style=\"width:400px;height:200px\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"contact_merge_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Merge selected Contact to\"'>\r\n\t\t<div data-dojo-attach-point=\"contact_merge_ctrl\" data-dojo-type=\"research/employees/ContactMerge\"></div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
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
define("research/employees/People", [
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
		this._check_call_back= lang.hitch(this, this._check_call);

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
			{label: 'Source',className: "standard",field:"sourcename"},
			{label: 'Country',className: "dgrid-column-status-large",field:"countryname"}
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
		this.filter_country.set("store", PRCOMMON.utils.stores.Countries());
		this.filter_country.set("value", 1);

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
		if (arguments[0].filter_country != '')
			query["filter_countryid"] = arguments[0].filter_country;

		this.people_grid.set("query", query);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.filter_personid.set("value","");
		this.filter_sourcetype.set("value",-1);
		this.filter_country.set("value",-1);
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
		request.post("/research/admin/contacts/research_check",
			utilities2.make_params({data:this.formUpdate.get("value")})).
			then ( this._check_call_back);
	},
	_check_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Contact '" + response.data.firstname+ " " + response.data.familyname + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				request.post('/research/admin/contacts/research_update',
					utilities2.make_params( {data:this.formUpdate.get("value")})).then
					(this._updated_call_back);			
			}
		}
		else if (response.success == 'DU')
		{
			if ((response.exist == true && confirm("Contact already exist with same Firstname and Surname.\nDo you want to proceed?")) || response.exist == false)
			{
				request.post('/research/admin/contacts/research_update',
					utilities2.make_params({ data : this.formUpdate.get("value")})).
					then(this._updated_call_back);				
			}		
		}
		else if (response.success == 'DEL+DU')
		{
			if (confirm("Contact '" + response.data.deletionhistory.firstname+ " " + response.data.deletionhistory.familyname + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				if ((response.data.exist == true && confirm("Contact already exist with same Firstname and Surname.\nDo you want to proceed?")) || response.data.exist == false)
				{
					request.post('/research/admin/contacts/research_update',
						utilities2.make_params({ data : this.formUpdate.get("value")})).
						then(this._updated_call_back);				
				}
			}
		}
		else if (response.success == 'OK')
		{
			request.post('/research/admin/contacts/research_update',
				utilities2.make_params({ data : this.formUpdate.get("value")})).
				then(this._updated_call_back);			
		}
		this.updatenode.cancel();	
	},

	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
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





