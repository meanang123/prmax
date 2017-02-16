dojo.provide("prmax.iadmin.sales.SetFreeSEOCount");

dojo.declare("prmax.iadmin.sales.SetFreeSEOCount",
	[ ttl.BaseWidget],{
	templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/SetFreeSEOCount.html"),
	constructor: function()
	{
		this._UpdatedCallBack = dojo.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);
	},
	Load:function( customerid)
	{
		this.icustomerid.set("value", customerid);

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
			this.Clear();
			this.reason.set("value", "");
			this.seonbrincredit.set("value", response.data.cust.seonbrincredit);
			this.dlg.show();
		}
		else
		{
			alert("Problem Loading SEO Value");
		}
	},
	Clear:function()
	{
		this.updBtn.cancel();
		this.reason.set("value, ");
		this.seonbrincredit.set("value", 0);

	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("SEO Free Count Updated");
			this.dlg.hide();
			this.Clear();
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

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._UpdatedCallBack),
			url:'/iadmin/customer_seo_qty_update',
			content:this.form.get("value")}));
	},
	_Close:function()
	{
		this.dlg.hide();
		this.Clear();
	}
});