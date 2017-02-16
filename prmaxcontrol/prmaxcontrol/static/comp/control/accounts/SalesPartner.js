//-----------------------------------------------------------------------------
// Name:    SalesPartner.js
// Author:  
// Purpose:
// Created: 18/01/2017
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../accounts/templates/SalesPartner.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",	
	"dojo/data/ItemFileReadStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid",	
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/form/CurrencyTextBox",
	"dijit/form/NumberTextBox",
	"dijit/Toolbar",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
    "prcommon2/reports/ReportBuilder",
	"prcommon2/date/daterange",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore,JsonRest,Observable,Grid){

return declare("control.accounts.SalesPartner",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.financial_data = new Observable(new JsonRest(
			{target:'/audit/partners_financial',
			idProperty:'audittrailid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			}));

		this.customers_data = new Observable(new JsonRest(
			{target:'/customer/partner_customers',
			idProperty:'customerid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			}));

	
		this._customersources = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customersources&nofilter=-1'});	
		this._countries = new ItemFileReadStore ( {url:'/common/lookups?searchtype=countries'});	
		this._customerstatus = new ItemFileReadStore ( {url:'/common/lookups?searchtype=customerstatus&show_all=0'});	
		
		this._get_partner_call_back = lang.hitch(this, this._get_partner_call);		
		this._update_partner_call_back = lang.hitch(this, this._update_partner_call);		
		this._complete_listing_call_back = lang.hitch(this, this._complete_listing_call);
		this._complete_statement_call_back = lang.hitch(this, this._complete_statement_call);
		this._complete_listing_excel_call_back = lang.hitch(this, this._complete_listing_excel_call);
		this._complete_statement_excel_call_back = lang.hitch(this, this._complete_statement_excel_call);
		
	},

	postCreate:function()
	{
		this.customersourceid.set('store', this._customersources);	
		this.customersourceid.set("value", -1);
		this.country.set('store', this._countries);	
		this.customerstatus.set('store', this._customerstatus)
		this.customerstatus.set("value", 0);

		this.inherited(arguments);
		var cells =
		[
			{label: 'Customer',className:"dgrid-column-status-large",field:'customername'},
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
			{label: 'Customer',className:"dgrid-column-status-large",field:'customername'},
			{label: 'Contact',className:"dgrid-column-status-large",field:'contactname'},
			{label: 'Status',className:"dgrid-column-status-small",field:'customerstatusname'}
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
			store: this.customers_data,
			sort: [{ attribute: "customername"}],
			query:{}
		});
		this.financialgrid.set("content",this.view1);
		this.view1.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectFinancial));		
		this.customersgrid.set("content",this.view2);
		
	},
	_change_partner:function()
	{
		this.customersourceid.get("value");
		this._customersourceid = this.customersourceid;
		
		request.post("/partners/get_partner",
			utilities2.make_params({ data : {'customersourceid':this.customersourceid}})).
			then(this._get_partner_call_back);	

	},
	_update_partner:function()
	{
		
		if (utilities2.form_validator( this.DetailsForm ) == false )
		{
			return false;
		}		
		var content = this.DetailsForm.get("value");
		content['customersourceid'] = this.customersourceid.get("value");
		
		request.post("/partners/update_partner",
			utilities2.make_params({ data : content})).
			then(this._update_partner_call_back);		

	},
	_get_partner_call:function( response)
	{
		if ( response.success == "OK")
		{
			this.name.set("value", response.data.name);
			this.contactname.set("value", response.data.contactname);
			this.address1.set("value", response.data.address1);
			this.address2.set("value", response.data.address2);
			this.county.set("value", response.data.county);
			this.postcode.set("value", response.data.postcode);
			this.townname.set("value", response.data.townname);
			this.country.set("value", response.data.country);
			this.email.set("value", response.data.email);
			this.phone.set("value", response.data.phone);
			
			
			var command = this._get_filters();
	
			var query = lang.mixin(utilities2.get_prevent_cache(), command);
			this.view1.set("query", query);			
			this.view2.set("query", query);	
		}
		else
		{
			alert("Problem Loading Partner");
		}
	},	
	_update_partner_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Partner Updated");
		}
		else
		{
			alert("Problem Updating Partner");
		}
	},	
	_listing_report:function()
	{
		var content = {};

		content['reportoutputtypeid'] = 0;
		content['reporttemplateid'] = 28;
		content['customersourceid'] = this.customersourceid.get("value");
		content['customerid'] = -1
		content['customerstatusid'] = this.customerstatus.get("value");
		
		this.listing_report_dlg.show();
		this.listing_report_node.SetCompleted(this._complete_listing_call_back);
		this.listing_report_node.start(content);
	},

	_listing_report_excel:function()
	{
		var content = {};

		content['reportoutputtypeid'] = 4;
		content['reporttemplateid'] = 28;
		content['customersourceid'] = this.customersourceid.get("value");
		content['customerid'] = -1
		content['customerstatusid'] = this.customerstatus.get("value");
		
		this.listing_report_dlg.show();
		this.listing_report_node.SetCompleted(this._complete_listing_excel_call_back);
		this.listing_report_node.start(content);
	},
	_complete_listing_call:function()
	{
		this.listingreportbtn.cancel();
		this.listing_report_dlg.hide();
	},

	_complete_listing_excel_call:function()
	{
		this.listingreportexcelbtn.cancel();
		this.listing_report_dlg.hide();
	},

	_statement_report:function()
	{
		var content = {};

		content['reportoutputtypeid'] = 0;
		content['reporttemplateid'] = 29;
		content['customersourceid'] = this.customersourceid.get("value");
		content['customerid'] = -1

		this.statement_report_dlg.show();
		this.statement_report_node.SetCompleted(this._complete_statement_call_back);
		this.statement_report_node.start(content);
	},
	_statement_report_excel:function()
	{
		var content = {};

		content['reportoutputtypeid'] = 4;
		content['reporttemplateid'] = 29;
		content['customersourceid'] = this.customersourceid.get("value");
		content['customerid'] = -1

		this.statement_report_dlg.show();
		this.statement_report_node.SetCompleted(this._complete_statement_excel_call_back);
		this.statement_report_node.start(content);
	},
	_complete_statement_call:function()
	{
		this.statementreportbtn.cancel();
		this.statement_report_dlg.hide();
	},
	_complete_statement_excel_call:function()
	{
		this.statementreportexcelbtn.cancel();
		this.statement_report_dlg.hide();
	},
	_OnSelectFinancial:function ( e )
	{

		var cell = this.view1.cell(e);
		this._row = cell.row.data;
		
		// open invoice
		if ( cell.column.id  == 9 && this._row.documentpresent == true )
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

	},
	_getFilterAttr:function()
	{
		return this._get_filters();
	},
	_get_filters:function()
	{
		var filter = {customersourceid:this._customersourceid,
						daterange : this.date_search.get("value"),
						unallocated: this.unallocated.get("checked")
					};
		return filter;
	},
	_get_filters_customers:function()
	{
		var filter = {customersourceid:this._customersourceid,
					customerstatus : this.customerstatus.get("value")
					};
		return filter;
	},
	_FilterBy:function()
	{
		var command = this._get_filters();
		var query = lang.mixin(utilities2.get_prevent_cache(),command);
		this.view1.set("query", query);
	},
	_FilterBy_Customers:function()
	{
		var command = this._get_filters_customers();
		var query = lang.mixin(utilities2.get_prevent_cache(),command);
		this.view2.set("query", query);
	}
	
});
});
