//-----------------------------------------------------------------------------
// Name:    CustomerInvoices.js
// Author:  Chris Hoy
// Purpose:
// Created: 08/09/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.CustomerInvoices");

dojo.declare("prmax.customer.CustomerInvoices",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer","templates/CustomerInvoices.html"),
	constructor: function()
	{
		this.results = new prcommon.data.QueryWriteStore(
			{	url:'/customers/financial_history',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view);
		this.grid._setStore(this.results );

		this.grid.onRowClick = dojo.hitch(this,this._OnSelectRow);
		this.inherited(arguments);
	},
	_OnSelectRow : function(e)
	{
		this._row = this.grid.getItem(e.rowIndex);
		if ( e.cellIndex == 4 )
		{
			dojo.attr(this.documentform_audittrailid,"value",this._row.i.audittrailid);
			this.documentform.submit();
		}

		this.grid.selection.clickSelectEvent(e);
	},
	view: {
		cells: [[
		{name: 'Invoice Date',width: "120px",field:"invoice_date"},
		{name: 'Description',width: "200px",field:"audittext"},
		{name: 'Value',width: "4em",field:'invoiceamount', styles: 'text-align: right;padding-right:2px;',formatter:ttl.utilities.Display_Money },
		{name: 'Inv Nbr',width: "4em",field:'invoicenbr',styles: 'text-align: right;padding-right:2px;' },
		{name: ' ',width:"2em",formatter:ttl.utilities.pdfView }
		]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	}
});
