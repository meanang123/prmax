//-----------------------------------------------------------------------------
// Name:    financiallog.js
// Author:  Chris Hoy
// Purpose:
// Created:  Nov/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/financiallog.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileWriteStore",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dijit/layout/ContentPane",
	"dijit/form/DateTextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/layout/StackContainer",
	"control/customer/reallocation",
	"dojox/grid/DataGrid"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr, ItemFileWriteStore, ItemFileReadStore, Grid, JsonRest, Observable){

 return declare("control.customer.financiallog",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.financial_data = new Observable(new JsonRest(
			{target:'/audit/customer_financial',
			idProperty:'audittrailid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			}));
		this.allocation_data  = new Observable(new JsonRest(
			{target:'/allocation/allocation_details',
			idProperty:'customerpaymentallocationid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			}));
			
		this._DeleteAlocationCallBack = lang.hitch(this, this._DeleteAlocationCall);
		this._LoadBalanceCallBack = lang.hitch(this, this._LoadBalanceCall);
		topic.subscribe(PRCOMMON.Events.Financial_ReLoad, lang.hitch(this,this._RefreshView));
	},
	
	postCreate:function()
	{
		this.inherited(arguments);
		var cells =
		[
			{label: 'Logged',className:"dgrid-column-status-small",field:'auditdate'},
			{label: 'Date',className:"dgrid-column-date",field:'invoice_date' },
			{label: 'Text',className:"dgrid-column-status-large",field:'audittext'},
			{label: 'Charge',className:"dgrid-column-money",field:'charge',formatter:utilities2.display_money },
			{label: 'Paid',className:"dgrid-column-money",field:'paid', formatter:utilities2.display_money },
			{label: 'Un All.',className:"dgrid-column-money",field:'unallocated', formatter:utilities2.display_money },
			{label: 'Inv/Cd Nbr',className:"dgrid-column-nbr-right",field:'invoicenbr' },
			{label: 'Month',className:"dgrid-column-status-small",field:'payment_month_display'},
			{label: ' ', className:"dgrid-column-type-boolean",field:'documentpresent',formatter:utilities2.document_exists},
			{label: 'Reason',className:"dgrid-column-status-large",field:'reason' }
		];		
		var cells2 =
		[
			{label: 'Type',className:"dgrid-column-status",field:'type'},
			{label: 'Allocated',className:"dgrid-column-money",field:'amount', formatter:utilities2.display_money },
			{label: 'Value',className:"dgrid-column-money",field:'amount', formatter:utilities2.display_money },
			{label: 'Inv Id',className:"dgrid-column-nbr-right",field:'invoicenbr',},
			{label: 'Date',className:"dgrid-column-date",field:'invoicedate' },
			{label: ' ',className:"dgrid-column-type-boolean",formatter: utilities2.delete_row_ctrl }
		];		

		this.view1 = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.financial_data,
			sort: [{ attribute: "auditdate", descending: true }],
			query:{}
		});
		
		this.view2 = new Grid({
			columns: cells2,
			selectionMode: "single",
			store: this.allocation_data,
			sort: [{ attribute: "customerpaymentallocationid", descending: true }],
			query:{}
		});
		
		var td = new Date();
		var t = new Date(td.getTime() - 370*24*60*60*1000);
		this.filterdate.set("value", t );
		
		this.financialgrid.set("content",this.view1);
		this.allocations_grid.set("content", this.view2);
		this.view1.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectFinancial));		
		this.view2.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectAllocation));
	},
	load:function(customerid)
	{
		this._customerid = customerid;

		var command = {icustomerid:this._customerid,
				 unallocated: this.unallocated.get("checked"),
				 moneyonly: this.moneyonly.get("checked")};

		var query = lang.mixin(utilities2.get_prevent_cache(), command);
		this.view1.set("query", query);
		this._GetBalance();
	},
	resize:function()
	{
		this.inherited(arguments);
		this.borderControl.resize(arguments[0]);
	},
	_OnSelectFinancial:function ( e )
	{
		var cell = this.view1.cell(e);
		this._row = cell.row.data;
		
		// open invoice
		if ( cell.column.id  == 8 && this._row.documentpresent == true )
		{
			if ( this._row.audittypeid == 17 )
			{
				domattr.set(this.htmlform_audittrailid,"value", this._row.audittrailid);
				domattr.set(this.htmlform, "action", "/audit/viewhtml/" + this._row.audittrailid);
				this.htmlform.submit();
			}
			else
			{
				domattr.set(this.documentform_audittrailid,"value", this._row.audittrailid);
				domattr.set(this.documentform, "action", "/audit/viewpdf/" + this._row.audittrailid);
				this.documentform.submit();
			}
		}
		else
		{
			var query = lang.mixin(utilities2.get_prevent_cache(),{keyid:this._row.keyid});
			this.view2.set("query", query);
			this.zone.selectChild ( ( this._row.keyid == null) ? this.blank_view : this.allocations_view ) ;
			if (this._row.keyid == null )
				domclass.add(this.reallocate,"prmaxhidden");
			else
				domclass.remove(this.reallocate,"prmaxhidden");
		}
//		this.financialgrid.selection.clickSelectEvent(e);
	},
	_DeleteAlocationCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.allocation_data.remove(this._alloc_row.customerpaymentallocationid ) ;
			var query = lang.mixin(utilities2.get_prevent_cache(),{icustomerid:this._customerid});
			this.view1.set("query", query);
			alert("Allocation Deleted");
		}
		else
		{
			alert("Problem Deleting Allocation");
		}
	},
	_OnSelectAllocation:function ( e )
	{
		var cell = this.view2.cell(e);
		this._alloc_row = cell.row.data;
		
		if ( cell.column.id   == 5 )
		{
			if ( confirm ("Delete Allocation"))
			{
			request.post('/allocation/allocation_delete',
				utilities2.make_params({ data : {customerpaymentallocationid:this._alloc_row.customerpaymentallocationid}})).
				then(this._DeleteAlocationCallBack);					
			}
		}
	},
	_ReAllocate:function()
	{
		this.reallocation.Load ( this._customerid , this._row.keyid ) ;
	},
	_RefreshView:function()
	{
		var command = {icustomerid:this._customerid,
				 filter_date: utilities2.to_json_date( this.filterdate.get("value")),
				 unallocated: this.unallocated.get("value"),
				 moneyonly: this.moneyonly.get("value")
				};
		var query = lang.mixin(utilities2.get_prevent_cache(),command);				
		this.view1.set("query", query);

		if ( this._row != null && this._row.keyid != null )
			var query = lang.mixin(utilities2.get_prevent_cache(),{keyid:this._row.keyid});
			this.view2.set("query", query);
		this._GetBalance();
	},
	_FilterBy:function()
	{
		var command = {icustomerid:this._customerid,
				 filter_date: utilities2.to_json_date( this.filterdate.get("value")),
				 unallocated: this.unallocated.get("value"),
				 moneyonly: this.moneyonly.get("value")
				};
		var query = lang.mixin(utilities2.get_prevent_cache(),command);
		this.view1.set("query", query);
		domclass.add(this.reallocate,"prmaxhidden");
		this._GetBalance();
	},
	_GetBalance:function()
	{
			request.post('/customer/customer_balance',
				utilities2.make_params({ data:{icustomerid:this._customerid}})).
				then(this._LoadBalanceCallBack);				
	},
	_LoadBalanceCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			domattr.set(this.balance_figure, "innerHTML", dojo.number.format ( response.balances.balance/100.00,{places:2}));
		}
		else
		{
			domattr.set(this.balance_figure, "innerHTML", "ERROR");
		}
	}
});
});