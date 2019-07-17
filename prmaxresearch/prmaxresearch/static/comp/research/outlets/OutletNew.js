//-----------------------------------------------------------------------------
// Name:    Interests.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletNew.html",
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
	"prcommon2/geographical/Geographical",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.outlets.OutletNew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._updated_call_back = dojo.hitch ( this , this._updated_call );
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store", PRCOMMON.utils.stores.OutletTypes_noFreelancer());
//		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries())

		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
//		this.frequency.set("value", 5);
		this.countryid.set("value", 1);

		this.inherited(arguments);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		request.post('/research/admin/outlets/research_add_main',
			utilities2.make_params({ data : this.form.get("value")})).
			then ( this._updated_call_back);
	},
	_updated_call: function( response )
	{
		if ( response.success=="OK")
		{
			alert("Outlet Added");
			this.savebtn.cancel();
			this.clear();
			this.outletname.focus();
		}
		else
		{
			alert("Failed to add");
			this.savebtn.cancel();
		}
	},
	clear:function()
	{
//		this.frequency.set("value", 5);
		this.countryid.set("value", 1);
		this.outletname.set("value","");
		this.prmax_outlettypeid.set("value", null ) ;
		this.selectcontact.clear();
		this.jobtitle.set("value","");
//		this.address1.set("value","");
//		this.address2.set("value","");
//		this.townname.set("value","");
//		this.county.set("value","");
//		this.postcode.set("value","");
//		this.www.set("value","");
//		this.email.set("value","");
//		this.tel.set("value","");
//		this.fax.set("value","");
//		this.circulation.set("value",0);
//		this.webbrowsers.set("value",0);
//		this.interests.set("value","");
//		this.coverage.set("value","");
//		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
//		this.twitter.set("value","");
//		this.facebook.set("value","");
//		this.linkedin.set("value","");
//		this.instagram.set("value","");
//		this.profile.set("value","");
		this.savebtn.cancel();
	}
});
});





