//-----------------------------------------------------------------------------
// Name:    Payment.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.Payment");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");
dojo.require("prmax.iadmin.accounts.Allocation");

dojo.declare("prmax.iadmin.accounts.Payment",
	[ ttl.BaseWidget,prmax.iadmin.accounts.Allocation ],{
	widgetsInTemplate: true,
	manualmode:false,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/payment.html"),
	constructor: function()
	{
		this._PaymentTakenCallBack = dojo.hitch(this,this._PaymentTakenCall);

		this.paymenttypes = new dojo.data.ItemFileReadStore (
			{url:'/common/lookups?searchtype=paymenttypes',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});
	},
	setCustomer:function( customer, dialog)
	{
		this.btn.cancel();
		this._customerid = customer.customerid;
		this._customername = customer.customername;

		dojo.attr ( this.customername , "innerHTML" , customer.customername ) ;
		if (customer.invoiceemail != null && customer.invoiceemail != "")
			this.email.set("value", customer.invoiceemail);
		else
			this.email.set("value", customer.email);

		this._dialog = dialog;
		if ( this.manualmode)
		{
			this.alloc_grid.resize( {w:590, h:300});
			this.alloc_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),
					{ icustomerid:customer.customerid,
						source:"payment"
					}));
		}
	},
	_PaymentTakenCall:function( response )
	{
		if ( response.success == "OK" )
		{
			if ( this.manualmode )
				alert("Payment Taked");
			else
				alert("Payment Taken and invoice sent");
			this.Clear();
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem taking payment");
		}

		this.btn.cancel();
	},
	_TakePayment:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		if ( this.manualmode )
		{
			if ( this.toallocate.get("value") > this.payment.get("value"))
			{
				alert("Over Allocation");
				this.btn.cancel();
				return ;
			}
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		d = this.payment_date.get("value");
		if ( d != null )
			content["payment_date"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		if ( this.manualmode )
		{
			content["unpaidamount"] = this.toallocate.get("value");
			content['allocations'] = this.getAllocations();

		}
		else
		{
			var d = this.licence_expire.get("value");
			if (d != null)
				content["licence_expire"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._PaymentTakenCallBack,
			url:'/iadmin/payment_take',
			content:content}));
	},
	_onBlurAmount:function()
	{
		if ( this.manualmode)
		{
			var amount = this.payment.get("value");
			var amount_allocated = 0.0;

			for (var c = 0 ;  c < this.alloc_store._items.length; c++)
			{
				if ( this.alloc_store._items[c] == null ) continue;

				amount_allocated += dojo.number.round(parseFloat(this.alloc_store._items[c].i.allocated),2);
			}

			this.toallocate.set("value",dojo.number.format(dojo.number.round(amount - amount_allocated,2),{places:2}));

		}
	},
	Clear:function()
	{
		this.payment.set("value","");
		this.email.set("value","");
		this.emailtocustomer.set("checked",false);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.paymenttypeid.store = this.paymenttypes;
		this.paymenttypeid.set("value","1");
		if (this.manualmode )
		{
			dojo.addClass(this.alloc_view_1, "prmaxhidden");
			dojo.removeClass(this.alloc_view_3, "prmaxhidden");
			dojo.removeClass(this.alloc_view_4, "prmaxhidden");
			this._postCreate();
		}
		else
		{
			dojo.addClass ( this.alloc_view , "prmaxhidden");
		}
	},
	_Allocate:function()
	{
		// verify amount
		if ( this.toallocate_value.isValid() == false )
			return;

		// check
		if ( this._allocted_row.i.unpaidamount/100 <= this.toallocate_value.get("value") )
		{
			alert("Over Allocation");
			return false ;
		}

		this.alloc_store.setValue ( this._allocted_row , "allocated" , this.toallocate_value.get("value"),true );
		this._onBlurAmount();
	}
});