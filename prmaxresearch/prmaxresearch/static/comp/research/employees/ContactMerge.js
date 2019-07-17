//-----------------------------------------------------------------------------
// Name:    prmax.employee.ContactMerge
// Author:  
// Purpose: 
// Created: Oct 2017
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../employees/templates/ContactMerge.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"research/employees/PersonNew"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.employees.ContactMerge",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this.contactstore =  new JsonRestStore({target:"/research/admin/contacts/research_lookuplist_rest", idProperty:"contactid",  labelAttribute:"contactname"});
		this._merge_call_back = lang.hitch(this,this._merge_call);
		this._dlg = null;
	},
	postCreate:function()
	{
		this.contactlist.set("store",this.contactstore );

		this.inherited(arguments);

	},
	load:function(contactid,contactname,dlg)
	{
		this._dlg = dlg;
		this._contactid = contactid;
		this.contactlist.set("value", "");
		if (contactname)
			domattr.set(this.destination_details,"innerHTML",contactname + " - " + contactid);
		else
			domattr.set(this.destination_details,"innerHTML",contactid);

		this.mergebtn.cancel();
		this._dlg.show();
	},
	_do_close:function()
	{
		this._dlg.hide();
	},
	_do_merge:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}
		if (confirm("Merge Contacts"))
		{
			var data = {};
			data['contactid'] = this.contactlist.item.contactid;
			data['sourcecontactid'] = this._contactid;
			this._sourcecontactid = data['sourcecontactid'];
			request.post('/research/admin/contacts/research_merge',
				utilities2.make_params({ data: data} )).
				then (this._merge_call_back);
		}
	},
	_merge_call:function(response)
	{
		if (response.success == "OK")
		{
			alert("Merge Completed");
			topic.publish('contacts/merge_contact', {has_deleted:true, contactid:response.contact.contactid, sourcecontactid:this._sourcecontactid, contact:response.contact} );
			this._dlg.hide();
			//this.clear();
		}
		else
		{
			alert("Problem Merging Contacts");
		}

		this.mergebtn.cancel();
	},
	_clear:function()
	{
		domattr.set(this.destination_details,"innerHTML",-1);
		this.contactlist.set("value",null);
		this.mergebtn.cancel();
	},
});
});
