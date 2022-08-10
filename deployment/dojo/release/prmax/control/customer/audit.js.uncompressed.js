require({cache:{
'url:control/customer/templates/audit.html':"<div>\r\n        <div data-dojo-attach-point=\"auditgrid\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'></div>\r\n    \r\n    <form data-dojo-attach-point=\"documentform\" target=\"_blank\" method=\"post\" action=\"/audit/viewpdf\">\r\n        <input type=\"hidden\" name=\"audittrailid\"data-dojo-attach-point=\"documentform_audittrailid\">\r\n    </form>\r\n    <form data-dojo-attach-point=\"htmlform\" target=\"_blank\" method=\"post\" action=\"/audit/viewhtml\">\r\n        <input type=\"hidden\" name=\"audittrailid\" data-dojo-attach-point=\"htmlform_audittrailid\">\r\n    </form>\r\n</div>\r\n"}});
define("control/customer/audit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/audit.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, request,utilities2,lang,topic,domclass, domattr, JsonRest, Observable, Grid){

 return declare("control.customer.audit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.auditlist = new Observable(new JsonRest(
			{target:'/audit/audit',
			idProperty:'audittrailid',
			onError:utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			}));	
			
		this._icustomerid = null;
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Type',className:"dgrid-column-nbr-right",field:'audittypeid'},
			{label: 'Date',className:"dgrid-column-date",field:'auditdate'},
			{label: 'Text',className:"dgrid-column-status-large",field:'audittext'},
			{label: ' ',className:"dgrid-column-type-boolean",field:'documentpresent',formatter:utilities2.document_exists},
			{label: 'Who',className:"dgrid-column-status",field:'user_name'}
		];		
		
		this.auditgrid_view = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.auditlist,
			sort: [{ attribute: "auditdate", descending: true }],
			query:{}
		});

		this.auditgrid.set("content", this.auditgrid_view);
		this.auditgrid_view.on(".dgrid-cell:click", lang.hitch(this,this._OnSelectAudit));		

		this.inherited(arguments);	
	},
	load:function(icustomerid)
	{
		this._customerid = icustomerid;
		this.auditgrid_view.set("query", {icustomerid: this._customerid});
	},
	_OnSelectAudit:function (e)
	{
		var cell = this.auditgrid_view.cell(e);
		if (cell == null || cell.row == null ) return;
		
		var row = cell.row.data;
		
		if (cell.column.id == 3 && row.documentpresent == true)
		{
			if ( row.audittypeid == 17 || row.audittypeid == 24 )
			{
				domattr.set(this.htmlform_audittrailid,"value", row.audittrailid);
				domattr.set(this.htmlform, "action", "/audit/viewhtml/" + row.audittrailid);
				this.htmlform.submit();
			}
			else
			{
				domattr.set(this.documentform_audittrailid,"value", row.audittrailid);
				domattr.set(this.documentform, "action", "/audit/viewpdf/" + row.audittrailid);
				this.documentform.submit();
			}
		}
	},	
});
});
