//-----------------------------------------------------------------------------
// Name:    PriceCodes.js
// Author:  Chris Hoy
// Purpose:
// Created: 18/05/2011
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.accounts.PriceCodes");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.PriceCodes",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/PriceCodes.html"),
	constructor: function()
	{
		this._AddPriceCallBack = dojo.hitch(this, this._AddPriceCall);
		this._DeletePriceCallBack = dojo.hitch ( this, this._DeletePriceCall);
		this._UpdatePriceCallBack = dojo.hitch ( this, this._UpdatePriceCall);

		this._pricecodes = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/pricecodes',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			});

		this._modules = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxmodules',onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true });

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.view_grid.set("structure",this.view);
		this.view_grid._setStore(this._pricecodes);
		this.view_grid['onRowClick'] = dojo.hitch(this,this._OnSelectRow);
		this.prmaxmoduleid.store = this._modules;
		this.prmaxmoduleid2.store = this._modules;
	},
	_OnSelectRow : function(e)
	{
		this._row = this.view_grid.getItem(e.rowIndex);
		if ( e.cellIndex  == 9)
		{
			if ( confirm("Delete Price Code " + this._row.i.pricecodedescription + "?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeletePriceCallBack,
					url:'/iadmin/pricecode_delete',
					content: { pricecodeid: this._row.i.pricecodeid}}));
			}
		}
		else if ( e.cellIndex == 10 )
		{
			this.pricecodedescription2.set("value", this._row.i.pricecodedescription);
			this.pricecodelongdescription2.set("value", this._row.i.pricecodelongdescription);
			this.pricecodeid.set("value", this._row.i.pricecodeid);
			this.prmaxmoduleid2.set("value", this._row.i.prmaxmoduleid);
			this.fixed_salesprice2.set("value", this._row.i.fixed_salesprice);
			this.fixed_renewalprice2.set("value", this._row.i.fixed_renewalprice);
			this.monthly_salesprice2.set("value", this._row.i.monthly_salesprice);
			this.monthly_renewalprice2.set("value", this._row.i.monthly_renewalprice);
			this.concurrentusers2.set("value", this._row.i.concurrentusers);
			this.paid_months2.set("value", this._row.i.paid_months);

			this.pricecodeupddialog.show();
		}
		this.view_grid.selection.clickSelectEvent(e);
	},
	view:{noscroll: false,
			cells: [[
			{name: 'Price Code',width: "200px",field:'pricecodedescription'},
			{name: 'Description',width: "200px",field:'pricecodelongdescription'},
			{name: 'Module',width: "100px",field:'prmaxmoduledescription'},
			{name: 'Fixed Renewal Price',width: "5em",field:'fixed_renewalprice', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money},
			{name: 'Fixed Sales Price',width: "5em",field:'fixed_salesprice', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money},
			{name: 'Monthly Renewal Price',width: "5em",field:'monthly_renewalprice', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money},
			{name: 'Monthly Sales Price',width: "5em",field:'monthly_salesprice', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money},
			{name: 'Con. Users',width: "5em",field:'concurrentusers', styles: 'text-align: right;padding-right:2px;'},
			{name: 'Paid Months',width: "5em",field:'paid_months', styles: 'text-align: right;padding-right:2px;'},
			{name: ' ',width: "2em",field:'pricecodeid',formatter:ttl.utilities.deleteRowCtrl},
			{name: ' ',width: "2em",field:'pricecodeid',formatter:ttl.utilities.formatRowCtrl}
		]]
	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
		this.inherited(arguments);

	},
	_New:function()
	{
		this.pricecodedescription.set("value","");
		this.pricecodelongdescription.set("value","");
		this.prmaxmoduleid.set("value",1);
		this.fixed_salesprice.set("value",0.0);
		this.fixed_renewalprice.set("value",0.0);
		this.monthly_salesprice.set("value",0.0);
		this.monthly_renewalprice.set("value",0.0);
		this.concurrentusers.set("value",1);
		this.paid_months.set("value",12)
		this.pricecodedialog.show();
		this.pricecodedescription.focus();
	},
	_Close:function()
	{
		this.pricecodedialog.hide();
	},
	_Add:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			this.addbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._AddPriceCallBack,
			url:'/iadmin/pricecode_add',
			content:this.form.get("value")}));
	},
	_AddPriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.newItem( response.data );
			this._Close();
			this.pricecodedescription.set("value","");
			this.pricecodelongdescription.set("value","");
		}
		else if ( response.success == "DU")
		{
			alert("Already exists");
		}
		else
		{
			alert("Problem Adding");
		}

		this.addbtn.cancel();
	},
	_DeletePriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.deleteItem( this._row )
		}
		else
		{
			alert("Problem Deleting (Probably in use)");
		}
	},
	_UpdatePriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.setValue(this._row, "pricecodedescription" , response.data.pricecodedescription, true ) ;
			this._pricecodes.setValue(this._row, "pricecodelongdescription" , response.data.pricecodelongdescription, true ) ;
			this._pricecodes.setValue(this._row, "prmaxmoduledescription" , response.data.prmaxmoduledescription, true ) ;
			this._pricecodes.setValue(this._row, "fixed_salesprice" , response.data.fixed_salesprice, true ) ;
			this._pricecodes.setValue(this._row, "fixed_renewalprice" , response.data.fixed_renewalprice, true ) ;
			this._pricecodes.setValue(this._row, "monthly_salesprice" , response.data.monthly_salesprice, true ) ;
			this._pricecodes.setValue(this._row, "monthly_renewalprice" , response.data.monthly_renewalprice, true ) ;
			this._pricecodes.setValue(this._row, "concurrentusers", response.data.concurrentusers,true);
			this._pricecodes.setValue(this._row, "paid_months", response.data.paid_months,true);

			this._Close2();
		}
		else if ( response.success == "DU")
		{
			alert("Already Exists");
			this.pricecodedescription2.focus();
		}
		else
		{
			alert("Problem Adding");
		}

		this.updbtn.cancel();
	},
	_Update:function()
	{
		if (ttl.utilities.formValidator( this.formupd ) == false )
		{
			this.updbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._UpdatePriceCallBack,
			url:'/iadmin/pricecode_update',
			content:this.formupd.get("value")}));
	},
	_Close2:function()
	{
		this.pricecodeupddialog.hide();
	}
});