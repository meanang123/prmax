define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/SetExpireDate.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"dijit/form/SimpleTextarea"],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.SetExpireDate",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._SetExpireDateCall = lang.hitch(this,this._SetExpireDate);
		this._LoadedCallBack = lang.hitch(this, this._LoadedCall);

	},
	Load:function( customerid, taskid )
	{
		this.icustomerid.set("value", customerid);
		this.taskid.set("value", taskid);

		request.post ('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid:this.icustomerid.get("value")}})).then
			(this._LoadedCallBack);
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
				domclass.remove(this.view1,"prmaxhidden");
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
				domclass.add(this.view1,"prmaxhidden");
			}
			if ( response.data.cust.updatum )
			{
				domclass.remove(this.view2,"prmaxhidden");
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
				domclass.add(this.view2,"prmaxhidden");
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
		if (utilities2.form_validator( this.form ) == false )
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
		content["licence_expire"] = utilities2.to_json_date ( this.licence_expire.get("value"));
		content["licence_start_date"] = utilities2.to_json_date ( this.licence_start_date.get("value"));
		content["advance_licence_start"] = utilities2.to_json_date ( this.advance_licence_start.get("value"));
		content["advance_licence_expired"] = utilities2.to_json_date ( this.advance_licence_expired.get("value"));
		content["updatum_start_date"] = utilities2.to_json_date ( this.updatum_start_date.get("value"));
		content["updatum_end_date"] = utilities2.to_json_date ( this.updatum_end_date.get("value"));

		request.post ('/customer/set_expire_date',
			utilities2.make_params({ data : content})).then
			(this._SetExpireDateCall);
	},
	_Close:function()
	{
		this.dlg.hide();
	}
});
});