dojo.provide("prmax.iadmin.support.ResetAndSend");

dojo.declare("prmax.iadmin.support.ResetAndSend",
	[ ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.support","templates/ResetAndSend.html"),
	constructor: function()
	{
		this._updated_call_back = dojo.hitch(this,this._update_call);
		this._loaded_call_back = dojo.hitch(this, this._loaded_call);
	},
	load:function( iuserid , dialog )
	{
		this.updbtn.cancel();
		this.iuserid.set("value", iuserid);
		this.email.set("value","");
		this.password.set("value","");
		this._dialog = dialog;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._loaded_call_back,
			url:'/iadmin/get_user_internal' ,
			content: {iuserid : iuserid }
		}));
	},
	_loaded_call:function ( response )
	{
		if ( response.success == "OK")
		{
			//displayname
			dojo.attr( this.displayname ,"innerHTML", response.data.display_name + " | "  + response.data.user_name);
			this.email.set("value",response.data.user_name);
			this._dialog.show();
		}
		else
		{
			alert("Problem Loading User Details");
		}
	},
	_updated_call:function( response )
	{
		if ( response.success == "OK" )
		{

			if (this ._dialog)
				this._dialog.hide();
		}
		else
		{
			if ( response.message)
				alert( response.message ) ;
			else
				alert("Problem Upating");
		}
		this.updbtn.cancel();
	},
	_update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Missing Data");
			this.updbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this, this._updated_call_back),
			url:'/iadmin/send_login_details',
			content:this.form.get("value")}));
	},
	_update_call:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Email Sent");
		}
		else
		{
		alert("problem Sending Email");
		}
		this.updbtn.cancel();
	}
});

