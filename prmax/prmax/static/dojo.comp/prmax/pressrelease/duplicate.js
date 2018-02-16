//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.duplicate
// Author:  Chris Hoy
// Purpose: To Duplicate a release
// Created: 06/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.Duplicate");

dojo.declare("prmax.pressrelease.Duplicate",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/duplicate.html"),
	constructor: function()
	{
		this._dlg = null;
		this._SavedCall = dojo.hitch(this,this._Saved);
	},
	postCreate:function()
	{
		dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SubmitAdd));
		dojo.attr(this.distr_label, "innerHTML", "New " + PRMAX.utils.settings.distribution_description + " Name");

		this.inherited(arguments);
	},
	_UpdateDistributionLabelEvent:function()
	{
		dojo.attr(this.distr_label, "innerHTML", "New " + PRMAX.utils.settings.distribution_description + " Name");
	},
	Load:function( dlg , tmp_emailtemplateid)
	{
		this._dlg = dlg;
		this._Clear();
		this.emailtemplateid.set("value",tmp_emailtemplateid);
	},
	_Cancel:function()
	{
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
				url: "/emails/template_duplicate" ,
				content: this.form.get("value")
			}));
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.PressReleaseStart, [response.data]) ;
			this.hide();
		}
		else if (response.success=="DU")
		{
			alert("Distribution Name Already Exists");
			this.emailtemplatename.focus();
		}
		else if (response.success=="VF")
		{
			alert( "Distribution: " + response.error_message[0][1]);
			this.emailtemplatename.focus();
		}
		else
		{
			alert("Problem with Distribution");
			this.emailtemplatename.focus();
		}
		this.saveNode.cancel();
	},
	_Clear:function()
	{
		this.emailtemplatename.set("value",null);
		this.saveNode.cancel();
		this.emailtemplateid.set("value",null);
	},
	hide:function()
	{
		if ( this._dlg)
			this._dlg.hide();
		this._Clear();
	}
});
