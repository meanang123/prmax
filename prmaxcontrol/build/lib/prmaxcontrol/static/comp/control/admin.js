define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../control/templates/admin.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"control/customer/view_partner",
	"control/customer/view_internal",
	"control/accounts/PriceCodes"
	], function(declare, BaseWidgetAMD, template, BorderContainer,Grid,JsonRest,Observable,request,utilities2,ItemFileReadStore,lang,topic,domclass){
 return declare("control.admin",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
			this.model =  new Observable( new JsonRest( {target:'/customer/list_limited', idProperty:"customerid"}));
			this._display_details_call_back = lang.hitch(this, this._display_details);

			topic.subscribe("/customer/p_add", lang.hitch(this, this._new_customer_event));
			topic.subscribe("/customer/p_upd", lang.hitch(this, this._upd_customer_event));

	},
	postCreate:function()
	{

		if (PRMAX.Settings.uctid != null)
		{
			domclass.add(this.filter_show_1,"prmaxhidden");
			domclass.add(this.filter_show_2,"prmaxhidden");
			domclass.add(this.filter_show_3,"prmaxhidden");
			domclass.add(this.filter_show_4,"prmaxhidden");
			domclass.add(this.filter_show_5,"prmaxhidden");
			domclass.add(this.filter_show_6,"prmaxhidden");
		}
		var cells =
		[
			{label: 'Acc',className:"dgrid-column-type-boolean",field:'customerid',styles:"text-align:right;padding-right:3px;"},
			{label: 'Customer name',className:"dgrid-column-title",field:'customername'},
			{label: 'Source',className:"dgrid-column-type-small",field:'customertypename'},
			{label: 'Contact',className:"dgrid-column-status",field:'contactname'},
			{label: 'Expires',className:"dgrid-column-type-small",field:'licence_expire'},
			{label: 'Status',className:"dgrid-column-type-small",field:'customerstatusname'}
		];

		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			sort: [{ attribute: "customerid", descending: false }],
			query: {active_only:true}
		});

		this.filter_customer_statusid.set("store",new ItemFileReadStore({url:"/common/lookups?searchtype=customerstatus&nofilter=1"}))
		this.filter_customer_statusid.set("value",-1);
		this.filter_customertypeid.set("store",new ItemFileReadStore({url:"/common/lookups?searchtype=customertypes&nofilter=1"}))
		this.filter_customertypeid.set("value",-1);
		this.filter_financialstatus.set("store",new ItemFileReadStore({url:"/common/lookups?searchtype=financialstatus&nofilter=1"}))
		this.filter_financialstatus.set("value",-1);

		this.searchgrid_view.set("content", this.searchgrid);
		this.searchgrid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
	},
	_execute_customer_filter:function()
	{
		var query = {
			accountnbr:arguments[0].accountnbr,
			invoicenbr:arguments[0].invoicenbr,
			contactname:arguments[0].contactname,
			customername:arguments[0].customername,
			licence_expired:arguments[0].licence_expired,
			email:arguments[0].email,
			isinternal:arguments[0].isinternal,
			creditnotenbr:arguments[0].creditnotenbr,
			unallocated:arguments[0].unallocated,
			customertypeid:arguments[0].customertypeid,
			financialstatusid:arguments[0].financialstatusid
		};
		var empty = true;

		if ( arguments[0].customerstatusid != "-1")
		{
			query["statusid"] = arguments[0].customerstatusid;
			empty = false;
		}

		if (empty==true)
			query["active_only"] = true ;

		this.searchgrid.set("query", query);
		this._display_details("blank");

	},
	_clear_filter:function()
	{
		this.filter_customer_statusid.set("value",-1);
		this.searchgrid.set("query",{active_only:true});
		this._display_details("blank");
	},
	_logout:function()
	{
		window.location.href = "/logout";
	},
	_on_cell_call:function(e)
	{
		var cell = this.searchgrid.cell(e);

		if ( cell == null || cell.row == null) return ;

		this._show_details(cell.row.data.customerid);

	},
	_show_details:function(customerid)
	{
		if (PRMAX.Settings.uctid != null)
		{
			this.view_partner.load(customerid, this._display_details_call_back);
		}
		else
		{
			this.view_internal.load(customerid, this._display_details_call_back);
		}
	},
	_display_details:function(view_name)
	{
		switch(view_name)
		{
		case "view_partner":
			this.options.selectChild(this.view_partner);
			break;
		case "view_internal":
			this.options.selectChild(this.view_internal);
			break;
		case "blank":
			this.options.selectChild(this.blank);
			break;
		}
	},
	_new_customer_event:function(customer)
	{
		this.searchgrid.select(this.model.add(customer));
		this._show_details(customer.customerid);
	},
	_upd_customer_event:function(customer)
	{
		this.searchgrid.select(this.model.add(customer));
	}
});
});
