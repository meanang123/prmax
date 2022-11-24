//-----------------------------------------------------------------------------
// Name:    PriceCodes.js
// Author:  
// Purpose:
// Created: 21/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../accounts/templates/PriceCodes.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/form/CurrencyTextBox",
	"dijit/form/NumberTextBox",
	"dijit/Toolbar",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore,Grid,JsonRest,Observable){

return declare("control.accounts.PriceCodes",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._AddPriceCallBack = lang.hitch(this, this._AddPriceCall);
		this._DeletePriceCallBack = lang.hitch ( this, this._DeletePriceCall);
		this._UpdatePriceCallBack = lang.hitch ( this, this._UpdatePriceCall);

		this._pricecodes = new Observable(new JsonRest(
			{target:'/pricecode/pricecodes',
			idProperty:'pricecodeid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			}));

		this._modules = new ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxmodules',onError:utilities2.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
		this._modules = new ItemFileReadStore ( {url:'/common/lookups?searchtype=prmaxmodules'});
		this._customersources = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customersources&nofilter=-1'});
		this._products = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customerproducts'});
	},

	postCreate:function()
	{
		this.inherited(arguments);	
		var cells =
		[
			{label: 'Product',className:"dgrid-column-status-small",field:'customerproductdescription'},
			{label: 'Price Code',className:"dgrid-column-status",field:'pricecodedescription'},
			{label: 'Description',className:"dgrid-column-status-large",field:'pricecodelongdescription'},
			{label: 'Module',className:"dgrid-column-status-small",field:'prmaxmoduledescription'},
			{label: 'Partners',className:"dgrid-column-status-small",field:'customersourcedescription'},
			{label: 'Fixed Renewal Price',className:"dgrid-column-money",field:'fixed_renewalprice',formatter:utilities2.display_money},
			{label: 'Fixed Sales Price',className:"dgrid-column-money",field:'fixed_salesprice', formatter:utilities2.display_money},
			{label: 'Monthly Renewal Price',className:"dgrid-column-money",field:'monthly_renewalprice', formatter:utilities2.display_money},
			{label: 'Monthly Sales Price',className:"dgrid-column-money",field:'monthly_salesprice', formatter:utilities2.display_money},
			{label: 'Con. Users',className:"dgrid-column-nbr-right",field:'concurrentusers'},
			{label: 'Paid Months',className:"dgrid-column-nbr-right",field:'paid_months'},
			{label: ' ',name:'delete', className:"dgrid-column-type-boolean",field:'pricecodeid',formatter:utilities2.delete_row_ctrl},
			{label: ' ',name:'update',className:"dgrid-column-type-boolean",field:'pricecodeid',formatter:utilities2.format_row_ctrl}			
		];		

		this.view = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._pricecodes,
			sort: [{ attribute: "pricecodedescription", descending: false }],
			query:{}
		});

		this.view_grid.set("content", this.view);
		this.view.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectRow));

		this.prmaxmoduleid.set('store', this._modules);
		this.prmaxmoduleid2.set('store',this._modules);
		this.customersourceid.set('store', this._customersources);
		this.customersourceid2.set('store', this._customersources);
		this.customerproductid.set('store', this._products);
		this.customerproductid2.set('store', this._products);
	},

	_OnSelectRow : function(e)
	{
		var cell = this.view.cell(e);
		
		this._row = cell.row.data;
		if ( cell.column.id  == 11)
		{
			if ( confirm("Delete Price Code " + this._row.pricecodedescription + "?"))
			{
				request.post("/pricecode/pricecode_delete",
					utilities2.make_params({ data : {pricecodeid : this._row.pricecodeid}})).
					then(this._DeletePriceCallBack);
			}
		}
		else if ( cell.column.id == 12 )
		{
			this.pricecodedescription2.set("value", this._row.pricecodedescription);
			this.pricecodelongdescription2.set("value", this._row.pricecodelongdescription);
			this.pricecodeid.set("value", this._row.pricecodeid);
			this.prmaxmoduleid2.set("value", this._row.prmaxmoduleid);
			this.customersourceid2.set("value", this._row.customersourceid);
			this.customerproductid2.set("value", this._row.customerproductid);
			this.fixed_salesprice2.set("value", this._row.fixed_salesprice);
			this.fixed_renewalprice2.set("value", this._row.fixed_renewalprice);
			this.monthly_salesprice2.set("value", this._row.monthly_salesprice);
			this.monthly_renewalprice2.set("value", this._row.monthly_renewalprice);
			this.concurrentusers2.set("value", this._row.concurrentusers);
			this.paid_months2.set("value", this._row.paid_months);

			this.pricecodeupddialog.show();
		}
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
		this.customersourceid.set("value",5);
		this.customerproductid.set("value",2);
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
		if (utilities2.form_validator( this.form ) == false )
		{
			this.addbtn.cancel();
			return false;
		}
		request.post("/pricecode/pricecode_add",
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._AddPriceCallBack);			
	},
	_AddPriceCall:function( response )
	{
		if ( response.success == "OK")
		{
			this._pricecodes.add( response.data );
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
			this._pricecodes.remove(this._row.pricecodeid)
			this._row = null;
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
		
			this.view.set("query",{});
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
		if (utilities2.form_validator( this.formupd ) == false )
		{
			this.updbtn.cancel();
			return false;
		}
		request.post("/pricecode/pricecode_update",
			utilities2.make_params({ data : this.formupd.get("value")})).
			then(this._UpdatePriceCallBack);				
	},
	_Close2:function()
	{
		this.pricecodeupddialog.hide();
	}
});
});
