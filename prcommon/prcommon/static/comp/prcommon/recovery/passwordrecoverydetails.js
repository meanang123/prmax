//-----------------------------------------------------------------------------
// Name:    passwordrecoverydetails
// Author:
// Purpose:
// Created: Feb 2018
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prcommon.recovery.passwordrecoverydetails");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.recovery.passwordrecoverydetails",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.recovery","templates/passwordrecoverydetails.html"),
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);
		this._load_call_back = dojo.hitch(this,this._load_call);
		
		this._message = '';
	},
	load:function ( dialog, show_message, message)
	{
		if (show_message && message=='set')
		{
			this._message = message;
			dojo.removeClass(this.message, 'prmaxhidden');	
			dojo.attr(this.message, 'innerHTML' , 'Please set your password recovery details by entering:</br>1. An email address different than your username and your user email address</br>2. A secret word of at least 8 characters');
			dojo.attr(this.savebtn, 'label', 'Save');
		}
		else if(show_message && message=='update')
		{
			this._message = message;
			dojo.removeClass(this.message, 'prmaxhidden');	
			dojo.attr(this.message, 'innerHTML', 'Please confirm your password recovery details');
			dojo.attr(this.savebtn, 'label', 'Confirm');
		}
		else
		{
			dojo.addClass(this.message, 'prmaxhidden');	
			dojo.attr(this.savebtn, 'label', 'Save');
		}
		this._dialog = dialog;
		
		dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._load_call_back,
				url:'/user/get_password_recovery_details'})	);		
	},	
	_load_call:function(response)
	{
		if (response.success == 'OK')
		{
			if (PRMAX.utils.settings.passwordrecovery && response.details)
			{
				this.recovery_email.set("value", response.details.recovery_email);
	//			this.recovery_phone.set("value", response.details.recovery_phone);
				this.recovery_word.set("value", response.details.recovery_word);		
			}
		}
	},
	_save:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false)
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			if (this._message == 'update')
			{
				dojo.attr(this.savebtn, 'label', 'Confirm');	
			}
			return false;
		}
		if (this.recovery_word.get("value").length < 8)
		{
			alert("Please enter secret word of minimum 8 characters");
			this.savebtn.cancel();
			if (this._message == 'update')
			{
				dojo.attr(this.savebtn, 'label', 'Confirm');	
			}
			return;
		}
		if (this.recovery_email.get("value").toLowerCase() == PRMAX.utils.settings.username.toLowerCase() || this.recovery_email.get("value").toLowerCase() == PRMAX.utils.settings.uemail.toLowerCase())
		{
			alert("Please enter different email address than your username and your user email address");
			this.savebtn.cancel();
			if (this._message == 'update')
			{
				dojo.attr(this.savebtn, 'label', 'Confirm');	
			}			
			return;
		}

		var data = this.form.get("value");
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._save_call_back,
						url:"/user/set_password_recovery" ,
						content: data
						}));

	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Saved Details for Password Recovery");
			this.savebtn.cancel();
			this._dialog.hide();
		}
		else
		{
			alert("Problem Adding Details for Password Recovery");
		}
		this.savebtn.cancel();
		if (this._message == 'update')
		{
			dojo.attr(this.savebtn, 'label', 'Confirm');	
		}		
	},	
	_close:function()
	{
		this._dialog.hide();
	},
	_clear:function()
	{
		this.recovery_email.set("value", "");
//		this.recovery_phone.set("value", "");
		this.recovery_word.set("value", "");
	}
	
});
