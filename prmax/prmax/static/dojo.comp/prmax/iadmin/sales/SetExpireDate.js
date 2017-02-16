dojo.provide("prmax.iadmin.sales.SetExpireDate");

dojo.require("dijit.Dialog");
dojo.require("ttl.utilities");

dojo.declare("prmax.iadmin.sales.SetExpireDate",
	[ ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/SetExpireDate.html"),
	constructor: function()
	{
		this._SetExpireDateCall = dojo.hitch(this,this._SetExpireDate);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);

	},
	Load:function( customerid, taskid )
	{
		this.icustomerid.set("value", customerid);
		this.taskid.set("value", taskid);

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
			this._advancefeatures = response.data.cust.advancefeatures;
			this.licence_expire.set("value", new Date(response.data.cust.licence_expire.year, response.data.cust.licence_expire.month-1, response.data.cust.licence_expire.day));
			if (response.data.cust.licence_start_date_d)
				this.licence_start_date.set("value", new Date(response.data.cust.licence_start_date_d.year, response.data.cust.licence_start_date_d.month-1, response.data.cust.licence_start_date_d.day));
			else
				this.licence_start_date.set("value",null);

			if ( this._advancefeatures )
			{
				dojo.removeClass(this.view1,"prmaxhidden");
				if (response.data.cust.advance_licence_expired_d)
					this.advance_licence_expired.set("value", new Date(response.data.cust.advance_licence_expired_d.year, response.data.cust.advance_licence_expired_d.month-1, response.data.cust.advance_licence_expired_d.day));
				else
					this.advance_licence_expired.set("value",null);

				if (response.data.cust.advance_licence_start_d)
					this.advance_licence_start.set("value", new Date(response.data.cust.advance_licence_start_d.year, response.data.cust.advance_licence_start_d.month-1, response.data.cust.advance_licence_start_d.day));
				else
					this.advance_licence_start.set("value",null);
			}
			else
			{
				dojo.addClass(this.view1,"prmaxhidden");
			}
			if ( response.data.cust.updatum )
			{
				dojo.removeClass(this.view2,"prmaxhidden");
				if (response.data.cust.updatum_end_date_d)
					this.updatum_end_date.set("value", new Date(response.data.cust.updatum_end_date_d.year, response.data.cust.updatum_end_date_d.month-1, response.data.cust.updatum_end_date_d.day));
				else
					this.updatum_end_date.set("value",null);

				if (response.data.cust.updatum_start_date_d)
					this.updatum_start_date.set("value", new Date(response.data.cust.updatum_start_date_d.year, response.data.cust.updatum_start_date_d.month-1, response.data.cust.updatum_start_date_d.day));
				else
					this.updatum_start_date.set("value",null);
			}
			else
			{
				dojo.addClass(this.view2,"prmaxhidden");
			}
			this.reason.set("value","");
			this.dlg.show();
		}
		else
		{
			alert("Problem Loading Expire Details");
		}
	},
	_SetExpireDate:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("expire date re-set");
			dojo.publish(PRCOMMON.Events.Expire_Date_Changed, [response.data.cust]);
			this.dlg.hide();
		}
		else
			alert("Problem resetting expire date");
	},
	_Update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Invalid Expire Date");
			return false;
		}
		if ( this.reason.get("value") == "" )
		{
			alert("No Reason Given");
			this.reason.focus();
			return false;
		}

		var content = this.form.get("value");
		content["licence_expire"] = ttl.utilities.toJsonDate ( this.licence_expire.get("value"));
		content["licence_start_date"] = ttl.utilities.toJsonDate ( this.licence_start_date.get("value"));
		content["advance_licence_start"] = ttl.utilities.toJsonDate ( this.advance_licence_start.get("value"));
		content["advance_licence_expired"] = ttl.utilities.toJsonDate ( this.advance_licence_expired.get("value"));
		content["updatum_start_date"] = ttl.utilities.toJsonDate ( this.updatum_start_date.get("value"));
		content["updatum_end_date"] = ttl.utilities.toJsonDate ( this.updatum_end_date.get("value"));

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._SetExpireDateCall),
			url:'/iadmin/set_expire_date',
			content:content}));
	},
	_Close:function()
	{
		this.dlg.hide();
	}
});