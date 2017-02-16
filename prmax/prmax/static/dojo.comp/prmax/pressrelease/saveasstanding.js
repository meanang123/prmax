//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.saveasstanding.html
// Author:  Chris Hoy
// Purpose:
// Created: 11/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.saveasstanding");

dojo.declare("prmax.pressrelease.saveasstanding",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/saveasstanding.html"),
	constructor: function()
	{
		this._SavedCall = dojo.hitch(this,this._Saved);
	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SubmitAdd));
		this.inherited(arguments);
	},
	_Cancel:function()
	{
		this._Clear();
		this.hide();
	},
	_Save:function()
	{
		this.form.submit();
	},
	_SubmitAdd:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavedCall,
				url: "/emails/templates_save_as_standing" ,
				content: this.form.get("value")
			}));
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.List_Add, [response.data ] );
			this.hide();
			this._Clear();
		}
		else if (response.success=="DU")
		{
			alert("Media List Already Exists");
			this.listname.focus();
		}
		else if (response.success=="VF")
		{
			alert( "Media List: " + response.error_message[0][1]);
			this.listname.focus();
		}
		else
		{
			alert("Problem with Media List");
			this.listname.focus();
		}
		this.saveNode.cancel();
	},
	_Clear:function()
	{
		this.listname.set("value",null);
		this.emailtemplateid.set("value", "" ) ;
		this.saveNode.cancel();
	},
	Load:function( dlg, emailtemplateid )
	{
		this.emailtemplateid.set("value", emailtemplateid ) ;
		this._dlg = dlg;
	},
	hide:function()
	{
		this._dlg.hide();
	}
});
