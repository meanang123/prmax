dojo.provide("prmax.iadmin.sales.ReActivateDemo");

dojo.declare("prmax.iadmin.sales.ReActivateDemo",
	[ ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/ReActivateDemo.html"),
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);
		this._userfilter = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales"});
	},
	postCreate:function()
	{
		this.assigntoid.set("store", this._userfilter ) ;
	},
	Load:function( customerid, dialog )
	{
		this.updBtn.set("disabled", true ) ;
		this.icustomerid.set("value", customerid);
		this._dialog = dialog;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadedCallBack,
			url:'/iadmin/get_internal' ,
			content: {icustomerid : customerid }
		}));
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			var td = new Date();
			var t = new Date(td.getTime()  + 4*24*60*60*1000);
			this.licence_expire.set("value", t);
			this.email.set("value", response.data.cust.email ) ;
			this.displayname.set("value", response.data.cust.displayname );
			this.sendemail.set("checked", true ) ;
			this.updBtn.set("disabled", false ) ;
			this._dialog.show();
			this.updBtn.cancel();
		}
		else
		{
			alert("Problem Loading Expire Details");
		}
	},
	_UpdatedCall:function( response )
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
		this.updBtn.cancel();
	},
	_Update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Missing Data");
			this.updBtn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["licence_expire"] = ttl.utilities.toJsonDate ( this.licence_expire.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._UpdatedCallBack),
			url:'/iadmin/re_activate_trial',
			content:content}));
	}
});