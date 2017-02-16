//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.questionnaires.SendSingle.js
// Author:  Chris Hoy
// Purpose:
// Created: 29/03/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.questionnaires.SendSingle");

dojo.declare("prmax.dataadmin.questionnaires.SendSingle",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.questionnaires","templates/SendSingle.html"),
	constructor: function()
	{
		this._SendCallBack = dojo.hitch(this, this._SendCall );
	},
	postCreate:function()
	{
		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_Send:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required fields filled in");
			this.sendemail.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SendCallBack,
			url:'/dataadmin/send_questionnaire',
			content: this.form.get("value")
		}));
	},
	_SendCall:function( response )
	{

		if ( response.success == "OK")
		{
			alert("Questionnaire Sent");
			this._dialog.hide();
		}
		else
		{

			alert("Problem Sending Questionnaire");
			this.sendemail.cancel();
		}

	},
	_Close:function()
	{
		this._dialog.hide();
	},
	Load:function( objectid , objecttypeid, emailaddress, name, dialog )
	{
		this._Clear();
		this.objecttypeid.set("value",objecttypeid);
		this.objectid.set("value",objectid);
		this.toemail.set("value",emailaddress);
		this.toname.set("value", name);
		this._dialog = dialog;
		this._dialog.show();
	},
	_Clear:function()
	{
		this.sendemail.cancel();
		this.objecttypeid.set("value",-1);
		this.objectid.set("value",-1);
		this.toname.set("value","");
		this.toemail.set("value","");
		this.subject.set("value","");
		this.body.set("value","");
	}
});





