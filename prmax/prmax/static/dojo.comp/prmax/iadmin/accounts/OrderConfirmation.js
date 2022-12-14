//-----------------------------------------------------------------------------
// Name:    OrderConfirmation.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------


dojo.provide("prmax.iadmin.accounts.OrderConfirmation");

dojo.require("ttl.BaseWidget");
dojo.require("dojo.number");

dojo.require("prmax.iadmin.accounts.UpgradeOrderConfirmation");

dojo.declare("prmax.iadmin.accounts.OrderConfirmation",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/OrderConfirmation.html"),

	constructor: function()
	{
		this._SendConfirmationCallBack = dojo.hitch ( this , this._SendConfirmationCall );
		this._pricecodes_core =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=core"});
		this._pricecodes_adv =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=adv"});
		this._pricecodes_updatum =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=updatum"});
		this._pricecodes_int =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=pricecodes&type=int"});
		this._userfilter = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=accounts,sales"});
		this._TaskCallBack = dojo.hitch(this,this._TaskCall);
		this._SendConifirmationCallBack = dojo.hitch ( this, this._SendConifirmationCall );
		this._SaveCallBack = dojo.hitch ( this, this._SaveCall);

		this._pmnodd =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=orderpaymentmethods"});

	},
	postCreate:function()
	{
		this._get_prices_call_back_1 = dojo.hitch ( this, this._get_prices_call,this.months_paid) ;
		this._get_prices_call_back_2 = dojo.hitch ( this, this._get_prices_call,this.adv_months_paid) ;
		this._get_prices_call_back_3 = dojo.hitch ( this, this._get_prices_call,this.updatum_months_paid) ;

		this.pricecodeid.set("store",this._pricecodes_core);
		this.pricecoderenewalid.set("store",this._pricecodes_core);
		this.advpricecodeid.set("store",this._pricecodes_adv);
		this.advpricecoderenewalid.set("store",this._pricecodes_adv);
		this.updatumpricecoderenewalid.set("store", this._pricecodes_updatum);
		this.updatumpricecodeid.set("store", this._pricecodes_updatum);
		this.intpricecodeid.set("store", this._pricecodes_int);
		this.intpricecoderenewalid.set("store", this._pricecodes_int);

		this.assigntoid.set("store", this._userfilter ) ;
		this.orderpaymentmethodid.set("store", this._pmnodd );
		this.orderpaymentmethodid.set("value", 1 );

		this.pricecodeid.set("value",1);
		this.pricecoderenewalid.set("value",1);
		this.advpricecodeid.set("value",2);
		this.advpricecoderenewalid.set("value",2);
		this.updatumpricecoderenewalid.set("value",3);
		this.updatumpricecodeid.set("value",3);
		this.intpricecoderenewalid.set("value",19);
		this.intpricecodeid.set("value",19);

		this.inherited(arguments);
	},
	_SendConifirmationCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Order Confirmation");
			this._dialog.hide();
			dojo.publish(PRCOMMON.Events.Task_Refresh, null);

		}
		else
		{
			alert("Problem Sending Order Confirmation");
		}
	},
	_Validate:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return null;
		}

		//
		if (this.updatum.get("checked"))
		{
			if (this.updatum_start_date.get("value")==null)
			{
				alert("Monitoring Need Start Date");
			}
		}

		var content = this.form.get("value");

		content["licence_start_date"] = ttl.utilities.toJsonDate(this.licence_start_date.get("value"));
		content["advance_licence_start"] = ttl.utilities.toJsonDate(this.advance_licence_start.get("value"));
		content["updatum_start_date"] = ttl.utilities.toJsonDate(this.updatum_start_date.get("value"));
		content["icustomerid"] = this._customerid;

		return content;
	},

	_Send:function()
	{
		var content = this._Validate();

		if ( content == null ) return ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SendConifirmationCallBack,
			url:'/iadmin/order_confirmation_send',
			content:content}));
	},
	_SaveCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Order Confirmation");
		}
		else
		{
			alert("Problem Sending Order Confirmation");
		}
	},
	_Save:function()
	{
		var content = this._Validate();

		if ( content == null ) return ;

		content["saveonly"] = "on";

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SaveCallBack,
			url:'/iadmin/order_confirmation_send_save',
			content:content}));
	},
	_TaskCall:function( response )
	{
		if ( response.success == "OK")
		{
			this.assigntoid.set("disabled", false );
			this.assigntoid.set("value", response.task.userid);
			dojo.removeClass(this.owner_view,"prmaxhidden");
		}
		else
		{
			alert("Problem");
		}
	},
	setCustomer:function( customerid , dialog , cust, taskid )
	{
		this._customerid = customerid;

		dojo.attr ( this.customername , "innerHTML" , cust.customername ) ;
		this.taskid.set("value", taskid);
		if ( taskid != null )
		{
			this.assigntoid.set("disabled", false);
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._TaskCallBack,
				url:'/iadmin/task_get',
				content:{taskid:taskid}}));
		}
		else
		{
			this.assigntoid.set("disabled", true);
			dojo.addClass(this.owner_view,"prmaxhidden");
			this.taskid.set("value",-1);
		}
		this.email.set("value",cust.email);
		this._dialog = dialog;
		this._Clear();
		this._PriceChange();
		this.advancefeatures.set("checked", cust.advancefeatures)
		this._ShowHideAdvance ( cust.advancefeatures );
		this.updatum.set("checked", cust.updatum);
		this.has_international_data.set("value",cust.has_international_data);
		this._ShowHideUpdatum ( cust.updatum );
		this._Show_Hide_DD(cust.advancefeatures, cust.updatum, cust.has_international_data, cust.orderpaymentmethodid);

		var tdate = new Date();
		this.licence_start_date.set("value" , tdate );
		this.advance_licence_start.set("value", tdate );
		this.updatum_start_date.set("value", tdate );

		this.orderedby.set("value", cust.orderedby );
		this.order_confirmation_message.set("value", cust.order_confirmation_message);
		this.orderpaymentmethodid.set("value", cust.orderpaymentmethodid);
		this.orderpaymentfreqid.set("value", cust.orderpaymentfreqid);
		this._ProductTypeSetting (cust.customertypeid ) ;

		this.months_free.set("value", cust.months_free);
		this.months_paid.set("value", cust.months_paid);

		this.adv_months_free.set("value", cust.adv_months_free);
		this.adv_months_paid.set("value", cust.adv_months_paid);

		this.updatum_months_free.set("value", cust.updatum_months_free);
		this.updatum_months_paid.set("value", cust.updatum_months_paid);

		this.has_bundled_invoice.set("checked", cust.has_bundled_invoice);

	},
	_Clear:function()
	{
		this.order_confirmation_message.set("value","");
		this.months_free.set("value", 0 ) ;
		this.months_paid.set("value", 12 ) ;
		this.adv_months_free.set("value", 0 ) ;
		this.adv_months_paid.set("value", 12 ) ;
		this.updatum_months_free.set("value", 0 ) ;
		this.updatum_months_paid.set("value", 12 ) ;
		this.orderpaymentfreqid.set("value", 1 ) ;
		this.logins.set("value",1);
	},
	_Preview:function()
	{
		dojo.attr(this.icustomerid,"value", this._customerid );
		this.previewform.submit();
	},
	_Advance:function()
	{
		this._ShowHideAdvance ( this.advancefeatures.get("checked"));
	},
	_international:function()
	{
		this._show_hide_international ( this.has_international_data.get("checked"));

	},
	_show_hide_international:function ( status )
	{
		if ( status )
		{
			var orderpaymentmethodid = this.orderpaymentmethodid.get("value");

			dojo.removeClass(this.int_view_1,"prmaxhidden");
			dojo.removeClass(this.int_view_2,"prmaxhidden");
			dojo.removeClass(this.int_view_3,"prmaxhidden");

			dojo.removeClass(this.int_view_4,"prmaxhidden");
			dojo.removeClass(this.int_view_5,"prmaxhidden");
			dojo.removeClass(this.int_view_6,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.int_view_1,"prmaxhidden");
			dojo.addClass(this.int_view_2,"prmaxhidden");
			dojo.addClass(this.int_view_3,"prmaxhidden");
			dojo.addClass(this.int_view_4,"prmaxhidden");
			dojo.addClass(this.int_view_5,"prmaxhidden");
			dojo.addClass(this.int_view_6,"prmaxhidden");
		}
	},
	_ShowHideAdvance:function ( status )
	{
		if ( status )
		{
			var orderpaymentmethodid = this.orderpaymentmethodid.get("value");

			dojo.removeClass(this.features_view_1,"prmaxhidden");
			dojo.removeClass(this.features_view_2,"prmaxhidden");
			dojo.removeClass(this.features_view_3,"prmaxhidden");

			dojo.removeClass(this.features_view_4,"prmaxhidden");
			dojo.removeClass(this.features_view_5,"prmaxhidden");
			dojo.removeClass(this.features_view_6,"prmaxhidden");
			this.advpricecoderenewalid.set("required",true);
			this.advpricecodeid.set("required",true);
		}
		else
		{
			dojo.addClass(this.features_view_1,"prmaxhidden");
			dojo.addClass(this.features_view_2,"prmaxhidden");
			dojo.addClass(this.features_view_3,"prmaxhidden");
			dojo.addClass(this.features_view_4,"prmaxhidden");
			dojo.addClass(this.features_view_5,"prmaxhidden");
			dojo.addClass(this.features_view_6,"prmaxhidden");
			this.advpricecoderenewalid.set("required",false);
			this.advpricecodeid.set("required",false);
		}
	},
	_Updatum:function()
	{
		this._ShowHideUpdatum ( this.updatum.get("checked"));
	},
	_ShowHideUpdatum:function ( status )
	{
		if ( status )
		{
			var orderpaymentmethodid = this.orderpaymentmethodid.get("value");

			dojo.removeClass(this.updatum_view_1,"prmaxhidden");
			dojo.removeClass(this.updatum_view_2,"prmaxhidden");
			dojo.removeClass(this.view_monitoring,"prmaxhidden");
			dojo.removeClass(this.updatum_view_4,"prmaxhidden");
			dojo.removeClass(this.updatum_view_5,"prmaxhidden");
			dojo.removeClass(this.updatum_view_6,"prmaxhidden");
			this.updatumpricecoderenewalid.set("required",true);
			this.updatumpricecodeid.set("required",true);
		}
		else
		{
			dojo.addClass(this.updatum_view_1,"prmaxhidden");
			dojo.addClass(this.updatum_view_2,"prmaxhidden");
			dojo.addClass(this.updatum_view_3,"prmaxhidden");
			dojo.addClass(this.updatum_view_4,"prmaxhidden");
			dojo.addClass(this.updatum_view_5,"prmaxhidden");
			dojo.addClass(this.updatum_view_6,"prmaxhidden");
			dojo.addClass(this.view_monitoring,"prmaxhidden");
			this.updatumpricecoderenewalid.set("required",false);
			this.updatumpricecodeid.set("required",false);
		}
	},

	_ChangePayment:function()
	{
		this._Show_Hide_DD ( this.advancefeatures.get("checked"),
				this.updatum.get("checked"),
				this.orderpaymentmethodid.get("value"),
				this.has_international_data.get("value"));

	},
_Show_Hide_DD:function( advancefeatures, updatum, has_international_data, orderpaymentmethodid)
	{
		switch ( parseInt(orderpaymentmethodid )) {
			case 4:
			case 5:
			case 6:
				dojo.addClass(this.view_dd_1,"prmaxhidden");
				dojo.addClass(this.view_dd_4,"prmaxhidden");
				if (!advancefeatures)
					dojo.addClass(this.features_view_2,"prmaxhidden");
				dojo.addClass(this.features_view_3,"prmaxhidden");
				if (!updatum)
					dojo.addClass(this.updatum_view_2,"prmaxhidden");
				if(!has_international_data)
					dojo.addClass(this.int_view_2,"prmaxhidden");
				dojo.addClass(this.updatum_view_3,"prmaxhidden");
				break;
			default:
				dojo.removeClass(this.view_dd_1,"prmaxhidden");
				dojo.removeClass(this.view_dd_2,"prmaxhidden");
				dojo.removeClass(this.view_dd_3,"prmaxhidden");
				dojo.removeClass(this.view_dd_4,"prmaxhidden");

				if ( advancefeatures)
				{
					dojo.removeClass(this.features_view_2,"prmaxhidden");
					dojo.removeClass(this.features_view_3,"prmaxhidden");
				}
				else
				{
					dojo.addClass(this.features_view_2,"prmaxhidden");
					dojo.addClass(this.features_view_3,"prmaxhidden");
				}
				if (updatum)
				{
					dojo.removeClass(this.updatum_view_2,"prmaxhidden");
					dojo.removeClass(this.updatum_view_3,"prmaxhidden");
				}
				else
				{
					dojo.addClass(this.updatum_view_2,"prmaxhidden");
					dojo.addClass(this.updatum_view_3,"prmaxhidden");
				}
				if (has_international_data)
				{
					dojo.removeClass(this.int_view_2,"prmaxhidden");
					dojo.removeClass(this.int_view_3,"prmaxhidden");
				}
				else
				{
					dojo.addClass(this.int_view_2,"prmaxhidden");
					dojo.addClass(this.int_view_3,"prmaxhidden");
				}
				break;
		}
	},
	_get_prices_call:function ( paid_months_field, response )
	{
		if ( response.success == "OK" )
		{
			this.cost.set("value" , dojo.number.format (response.cost.media/100.00, {places:2}));
			this.advcost.set("value" , dojo.number.format (response.cost.advance/100.00, {places:2}));
			this.updatumcost.set("value" , dojo.number.format (response.cost.updatum/100.00, {places:2}));
			this.internationalcost.set("value","0.00");
		}
	},
	_PriceChange1:function()
	{
		this._PriceChange ( this._get_prices_call_back_1 );
	},
	_PriceChange2:function()
	{
		this._PriceChange ( this._get_prices_call_back_2 );
	},
	_PriceChange3:function()
	{
		this._PriceChange ( this._get_prices_call_back_3 );
	},
	_PriceChange:function( call_back )
	{
		console.log ("_PriceChange", arguments);
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: call_back,
			url:'/iadmin/prices_get',
			content:this.form.get("value")}));
	},
	_ProductTypeSetting:function( customertypeid )
	{
		// this is one oof ours
		if ( customertypeid == 1 || customertypeid == 20)
		{
			this.emailtocustomer.set("checked", true ) ;
			this.emailtocustomer.set("disabled" , false ) ;
			this.confirmation_accepted.set("checked", true ) ;
			this.confirmation_accepted.set("disabled" , false ) ;
		}
		else
		{
			this.emailtocustomer.set("checked", false ) ;
			this.emailtocustomer.set("disabled" , true ) ;
			this.confirmation_accepted.set("checked", false ) ;
			this.confirmation_accepted.set("disabled" , true ) ;
		}
	}
});
