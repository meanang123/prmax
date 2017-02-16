//-----------------------------------------------------------------------------
// Name:    Adjustments.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.Adjustments");

dojo.require("prmax.iadmin.accounts.Allocation");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.Adjustments",
	[  ttl.BaseWidget,prmax.iadmin.accounts.Allocation ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/Adjustments.html"),
	constructor: function()
	{
		this._AdjustmentCallBack = dojo.hitch(this,this._AdjustmentCall);
		this.adjustmenttypes = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=adjustmenttypes',onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
	},
	setCustomer:function( customerid , customername , dialog)
	{
		this._customerid = customerid;
		this._customername = customername;

		dojo.attr ( this.customername , "innerHTML" , this._customername ) ;
		this._dialog = dialog;
		this.alloc_grid.resize( {w:590, h:300});
		this.alloc_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),
				{ icustomerid:customerid,
					source: "adjustments"
				}));

		this.addbtn.cancel();
	},
	_AdjustmentCall:function( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish(PRCOMMON.Events.Financial_ReLoad, []);
			alert("Adjustment Added");
			this._dialog.hide();
			this.Clear();
		}
		else
		{
			alert("Problem making Adjustment");
		}

		this.addbtn.cancel();

	},
	_Adjustment:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		if ( this.toallocate.get("value") > Math.abs(this.payment.get("value")))
		{
			alert("Over Allocation");
			this.addbtn.cancel();
			return ;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		content['allocations'] = this.getAllocations();
		content["adjustmentdate"] = ttl.utilities.toJsonDate ( this.adjustmentdate.get("value") ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AdjustmentCallBack,
			url:'/iadmin/adjust_account',
			content:content}));
	},
	Clear:function()
	{
		this.payment.set("value","");
		this.message.set("value","");
	},
	postCreate:function()
	{
		this.adjustmentdate.set("value",new Date());
		this.adjustmenttypeid.store = this.adjustmenttypes;
		this.adjustmenttypeid.set("value",1);
		this._postCreate();

		this.inherited(arguments);
	},
	_onBlurAmount:function()
	{
		this._doallocation();
	}
});