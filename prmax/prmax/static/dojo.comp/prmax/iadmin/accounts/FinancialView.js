//-----------------------------------------------------------------------------
// Name:    FinancialView.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/03/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.FinancialView");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.iadmin.accounts.ReAllocation");

dojo.declare("prmax.iadmin.accounts.FinancialView",
	[ttl.BaseWidget],{
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/financialview.html"),
	constructor: function()
	{
		this.financial_data = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/customer_financial',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

		this.allocation_data  = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/allocation_details',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

		this._DeleteAlocationCallBack = dojo.hitch( this, this._DeleteAlocationCall);
		this._LoadBalanceCallBack = dojo.hitch(this, this._LoadBalanceCall);
		dojo.subscribe(PRCOMMON.Events.Financial_ReLoad, dojo.hitch(this,this._RefreshView));

	},
	postCreate:function()
	{
		this.inherited(arguments);


		var td = new Date();
		var t = new Date(td.getTime() - 370*24*60*60*1000);
		this.filterdate.set("value", t );

		this.financialgrid.set("structure",this.view);
		this.allocations_grid.set("structure", this.view2);

		this.financialgrid._setStore(this.financial_data );
		this.allocations_grid._setStore ( this.allocation_data );

		this.financialgrid['onRowClick'] = dojo.hitch(this,this._OnSelectFinancial);
		this.allocations_grid['onRowClick'] = dojo.hitch(this,this._OnSelectAllocation);
	},
	Load:function(customerid)
	{
		this._customerid = customerid;

		var command = {icustomerid:this._customerid,
				 unallocated: this.unallocated.get("checked"),
				 moneyonly: this.moneyonly.get("checked")};

		this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(), command));
		this._GetBalance();
	},
	resize:function()
	{
		this.inherited(arguments);
		this.borderControl.resize(arguments[0]);
	},
	view :{noscroll: false,
			cells: [[
			{name: 'Logged',width: "5em",field:'auditdate'},
			{name: 'Date',width: "5em",field:'invoice_date' },
			{name: 'Text',width: "20em",field:'audittext'},
			{name: 'Charge',width: "4em",field:'charge', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
			{name: 'Paid',width: "4em",field:'paid', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
			{name: 'Un All.',width: "4em",field:'unallocated', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
			{name: 'Inv/Cd Nbr',width: "4em",field:'invoicenbr',styles: 'text-align: right;padding-right:2px;' },
			{name: 'Month',width: "5em",field:'payment_month_display',styles: 'text-align: right;padding-right:2px;' },
			{name: ' ',width: "2em",field:'documentpresent',formatter:ttl.utilities.documentExists},
			{name: 'Reason',width: "auto",field:'reason' }
		]]
	},
	view2 :{noscroll: false,
			cells: [[
			{name: 'Type',width: "12em",field:'type'},
			{name: 'Allocated',width: "5em",field:'amount', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
			{name: 'Value',width: "5em",field:'amount', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
			{name: 'Inv Id',width: "4em",field:'invoicenbr',styles: 'text-align: right;padding-right:2px;' },
			{name: 'Date',width: "5em",field:'invoicedate' },
			{name: ' ',width: "2em",formatter: ttl.utilities.deleteRowCtrl }
		]]
	},
	_OnSelectFinancial:function ( e )
	{
		this._row = this.financialgrid.getItem(e.rowIndex);

		// open invoice
		if ( e.cellIndex  == 8 && this._row.i.documentpresent == true )
		{
			if ( this._row.i.audittypeid == 17 )
			{
				dojo.attr(this.htmlform_audittrailid,"value", this._row.i.audittrailid);
				dojo.attr(this.htmlform, "action", "/iadmin/viewhtml/" + this._row.i.audittrailid);
				this.htmlform.submit();
			}
			else
			{
				dojo.attr(this.documentform_audittrailid,"value", this._row.i.audittrailid);
				dojo.attr(this.documentform, "action", "/iadmin/viewpdf/" + this._row.i.audittrailid);
				this.documentform.submit();
			}
		}
		else
		{
			this.allocations_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{keyid:this._row.i.keyid}));
			this.zone.selectChild ( ( this._row.i.keyid == null) ? this.blank_view : this.allocations_view ) ;
			if (this._row.i.keyid == null )
				dojo.addClass(this.reallocate,"prmaxhidden");
			else
				dojo.removeClass(this.reallocate,"prmaxhidden");
		}
		this.financialgrid.selection.clickSelectEvent(e);
	},
	_DeleteAlocationCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.allocation_data.deleteItem ( this._alloc_row ) ;
			this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:this._customerid}));
			alert("Allocation Deleted");
		}
		else
		{
			alert("Problem Deleting Allocation");
		}
	},
	_OnSelectAllocation:function ( e )
	{
		this._alloc_row = this.allocations_grid.getItem(e.rowIndex);
		if ( e.cellIndex  == 5 )
		{
			if ( confirm ("Delete Allocation"))
			{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._DeleteAlocationCallBack),
				url:'/iadmin/allocation_delete',
				content:{customerpaymentallocationid:this._alloc_row.i.customerpaymentallocationid}}));
			}
		}
	},
	_ReAllocate:function()
	{
		this.reallocation.Load ( this._customerid , this._row.i.keyid ) ;
	},
	_RefreshView:function()
	{
		var command = {icustomerid:this._customerid,
				 filter_date: ttl.utilities.toJsonDate( this.filterdate.get("value")),
				 unallocated: this.unallocated.get("value"),
				 moneyonly: this.moneyonly.get("value")
				};
		this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),command));

		if ( this._row != null && this._row.i.keyid != null )
			this.allocations_grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{keyid:this._row.i.keyid}));
		this._GetBalance();
	},
	_FilterBy:function()
	{
		var command = {icustomerid:this._customerid,
				 filter_date: ttl.utilities.toJsonDate( this.filterdate.get("value")),
				 unallocated: this.unallocated.get("value"),
				 moneyonly: this.moneyonly.get("value")
				};
		this.financialgrid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),command));
		dojo.addClass(this.reallocate,"prmaxhidden");
		this._GetBalance();
	},
	_GetBalance:function()
	{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadBalanceCallBack,
				url:'/iadmin/customer_balance',
				content:{'icustomerid':this._customerid}
				}));
	},
	_LoadBalanceCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.attr(this.balance_figure, "innerHTML", dojo.number.format ( response.balances.balance/100.00,{places:2}));
		}
		else
		{
			dojo.attr(this.balance_figure, "innerHTML", "ERROR");
		}
	}
});
