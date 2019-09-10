//-----------------------------------------------------------------------------
// Name:    DeletionHistoryAdd
// Author:  Stamatia Vatsi
// Purpose:
// Created: August/2019
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../deletionhistory/templates/DeletionHistoryAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",	
	"dojo/topic",
	"dojo/data/ItemFileReadStore",	
	"dojox/data/JsonRestStore",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"dijit/form/DateTextBox"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, domattr, topic, ItemFileReadStore, JsonRestStore){
 return declare("prcommon2.deletionhistory.DeletionHistoryAdd",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this.deletionhistorytypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=deletionhistorytype"});
		this._users = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});		
		this._researchprojects = new JsonRestStore({target:'/research/admin/projects/get_list', labelAttribute:"researchprojectname", idProperty:"researchprojectid"});
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._dialog = null;
		this._deletionhistoryid = null;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Hist_Codes());	
		this.deletionhistorytypeid.set("store", this.deletionhistorytypes);
		this.deletiondate.set("value", new Date());		
		this.iuserid.set("store",this._users);	
		this.iuserid.set("value", -1);	
		this.deletionhistorytypeid.set("value", 1);
		this.reasoncodeid.set("value", 29);
		this.researchprojectid.set("store", this._researchprojects);
		this.inherited(arguments);
		domclass.remove(this.close_button, "prmaxhidden");
		domclass.add(this.delete_button,"prmaxhidden");
	},
	_add_deletionhistory:function()
	{
		if (utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		var data = this.form.get("value");
		data["deletiondate"] = utilities2.to_json_date(this.deletiondate.get("value"));

		if (this.mode == "add")
		{
			if (confirm("Add Deletion?"))
			{
				request.post('/research/admin/deletionhistory/deletionhistory_add',
					utilities2.make_params({data: data})).
					then(this._add_call_back);
			}
		}
		else
		{
			if (confirm("Update Deletion?"))
			{
				request.post('/research/admin/deletionhistory/deletionhistory_update',
					utilities2.make_params({data: data})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function(response)
	{
		if (response.success=="OK")
		{
			alert("Deletion Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish('deletionhistory/add', response.deletionhistory);
			this._deletionhistoryid = response.deletionhistory.deletionhistoryid;
		}
		else if (response.success == "DU")
		{
			alert("Already Exists");
			this.deletionhistorydescription.focus();
		}
		else
		{
			alert("Failed");
		}
		this.savenode.cancel();
	},
	_update_call:function(response)
	{
		if (response.success=="OK")
		{
			alert("Deletion Updated");
			topic.publish('deletionhistory/update', response.deletionhistory);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			this._deletionhistoryid = response.deletionhistory.deletionhistoryid;

		}
		else if (response.success == "DU")
		{
			alert("Already Exists");
			this.deletionhistorydescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.deletionhistoryid.set("value", -1);
		this.outletname.set("value", "");
		this.firstname.set("value", "");
		this.familyname.set("value", "");
		this.domain.set("value", "");
		this.researchprojectid.set("value", -1);
		this.reasoncodeid.set("value", 29);
		this.deletionhistorytypeid.set("value", 1);
		this.iuserid.set("value", -1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.deletionhistorydescription.focus();
	},
	_setDialogAttr:function(dialog)
	{
		this._dialog = dialog;
	},
	
	load:function(deletionhistoryid)
	{
		this.clear();
		domclass.add(this.close_button, "prmaxhidden");
		domclass.remove(this.delete_button, "prmaxhidden");
		this._deletionhistoryid = deletionhistoryid;

		request.post('/research/admin/deletionhistory/deletionhistory_get',
				utilities2.make_params({data: {deletionhistoryid: deletionhistoryid}})).
				then(this._load_call_back);
	},
	_load_call:function(response)
	{
		if (response.success == "OK")
		{
			this.deletiondate.set("value", response.data.deletiondate);
			this.deletionhistoryid.set("value", response.data.deletionhistoryid);
			this.deletionhistorydescription.set("value", response.data.deletionhistorydescription);
			this.outletname.set("value", response.data.outletname);
			this.firstname.set("value", response.data.firstname);
			this.familyname.set("value", response.data.familyname);
			this.domain.set("value", response.data.domain);
			this.reasoncodeid.set("value", response.data.reasoncodeid);
			this.deletionhistorytypeid.set("value", response.data.deletionhistorytypeid);
			this.iuserid.set("value", response.data.userid);
			if (response.data.researchprojectid != null)
			{
				this.researchprojectid.set("value", response.data.researchprojectid);
			}
			else 
			{
				this.researchprojectid.set("value",-1);
			}
			this._dialog.show();
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog.hide();
	},
	_delete:function()
	{
		request.post('/research/admin/deletionhistory/deletionhistory_delete',
				utilities2.make_params({data: {deletionhistoryid: this._deletionhistoryid}})).
				then(this._delete_call_back);	
	},
	_delete_call:function(response)
	{
		if (response.success == "OK")
		{
			alert("Deletion deleted");
			topic.publish('deletionhistory/delete', [this._deletionhistoryid]);
		}
		else
		{
			alert("Failed");
		}
		this._dialog.hide();		
	}
});
});
