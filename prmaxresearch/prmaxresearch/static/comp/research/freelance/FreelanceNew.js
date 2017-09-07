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
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/outlets/freelance_research_add',
			utilities2.make_params( {data:this.requirednode.get("value")})).then
			(this._saved_call_back);
	},
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.outletnode.set("value",-1);
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
