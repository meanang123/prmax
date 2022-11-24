//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceNew.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/employees/EmployeeSelect",
	"dojox/validate",
	"prcommon2/interests/Interests",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.freelance.FreelanceNew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this._saved_call_back = lang.hitch(this, this._saved);
		this._load_call_back= lang.hitch(this, this._loaded);
		this._deleted_call_back= lang.hitch(this, this._deleted_call);
		this.outletid = -1 ;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.countryid.set("value", 1);

		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Added");
			this.new_freelance();
			this.selectcontact.focus();
		}
		else
		{
			alert("Failed");
		}
		this.savenode.cancel();
	},
	_save:function()
	{
		var data = {};
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		
		if ( confirm("Add Freelance?"))
		{
			request.post('/research/admin/outlets/research_freelance_check',
				utilities2.make_params({ data : this.requirednode.get("value")})).
				then(this._deleted_call_back);
		}
	},
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Freelance '" + response.data.outlet_name + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				data = 	this.requirednode.get("value");
				data['outletid'] = this.outletid;
				request.post('/research/admin/outlets/freelance_research_add',
					utilities2.make_params( {data:data})).then
					(this._saved_call_back);			
			}
		}
		else
		{
			data = 	this.requirednode.get("value");
			data['outletid'] = this.outletid;
			request.post('/research/admin/outlets/freelance_research_add',
				utilities2.make_params( {data:data})).then
				(this._saved_call_back);			
		}
		this.savenode.cancel();	
	},
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.countryid.set("value", 1);
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
	}
});
});
