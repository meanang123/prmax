require({cache:{
'url:control/templates/admin.html':"<div>\r\n\t<div  data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%\"' >\r\n\t\t<div style=\"height:46px;width:100%;overflow:hidden;padding:0px;margin:0px\" class=\"searchresults\">\r\n\t\t\t<div class=\"dijitToolbarTop\" data-dojo-type=\"dijit/Toolbar\" style=\"float:left;height:100%;width:100%;padding:0px;margin:0px\" >\r\n\t\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\" data-dojo-props='iconClass:\"fa fa-filter fa-3x\",showLabel:true,label:\"Filter By\"'>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" data-dojo-props='title:\"Enter Project filter\"' data-dojo-attach-event=\"execute: _execute_customer_filter\">\r\n\t\t\t\t\t\t<table width=\"500px\">\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>Status</label></td><td>\r\n\t\t\t\t\t\t\t<select data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"filter_customer_statusid\" data-dojo-props='name:\"customerstatusid\",autoComplete:true,labelType:\"html\"'></select></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_6\"><td class=\"prmaxrowtag\" align=\"right\"><label>Customer Source</label></td><td><select data-dojo-props='name:\"customertypeid\",autoComplete:true,labelType:\"html\"'  data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"filter_customertypeid\" ></select></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_1\"><td class=\"prmaxrowtag\" align=\"right\"><label>Financial Status</label></td><td><select data-dojo-props='name:\"financialstatusid\",autoComplete:true,labelType:\"html\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"filter_financialstatus\" ></select></td></tr>\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>Customer Name</label></td><td><input data-dojo-props='type:\"text\",name:\"customername\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_customername\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>Account Nbr</label></td><td><input data-dojo-props='type:\"text\",name:\"accountnbr\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_accountnbr\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>Not Expired</label></td><td><input data-dojo-props='type:\"checkbox\",name:\"licence_expired\"' data-dojo-attach-point=\"filter_licence_expired\" data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>Email</label></td><td><input data-dojo-props='type:\"text\",name:\"email\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_customeremail\"></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_2\"><td class=\"prmaxrowtag\" align=\"right\"><label>Is Internal</label></td><td><input data-dojo-props='type:\"text\",name:\"isinternal\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"filter_isinternal\"></td></tr>\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\"><label>User Name</label></td><td><input data-dojo-props='type:\"text\",name:\"contactname\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_contactname\"></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_3\"><td class=\"prmaxrowtag\" align=\"right\"><label>Invoice Nbr</label></td><td><input data-dojo-props='type:\"text\",name:\"invoicenbr\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_invoicenbr\"></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_4\"><td class=\"prmaxrowtag\" align=\"right\"><label>Credit Nt/ Nbr</label></td><td><input data-dojo-props='type:\"text\",name:\"creditnotenbr\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_icreditnotenbr\"></td></tr>\r\n\t\t\t\t\t\t\t<tr data-dojo-attach-point=\"filter_show_5\"><td class=\"prmaxrowtag\" align=\"right\"><label>UnAllocated</label></td><td><input data-dojo-props='type:\"checkbox\",name:\"unallocated\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"filter_unallocated\"></td></tr>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_clear_filter\">Clear</button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Submit</button></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_logout\" data-dojo-props='showLabel:\"true\",iconClass:\"fa fa-sign-out fa-3x\"'>Logout</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\",gutters:false' >\r\n\t\t<div data-dojo-attach-point=\"searchgrid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:40%;height:100%\"' ></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"options\" data-dojo-props='region:\"center\"'>\r\n\t\t\t<div title=\"blank\" data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='selected:\"selected\",style:\"width:100%;height:100%\"'></div>\r\n\t\t\t<div title=\"view_internal\" data-dojo-attach-point=\"view_internal\" data-dojo-type=\"control/customer/view_internal\" data-dojo-props='style:\"width:100%;height:100%\"'></div>\r\n\t\t\t<div title=\"view_partner\" data-dojo-attach-point=\"view_partner\" data-dojo-type=\"control/customer/view_partner\" data-dojo-props='style:\"width:100%;height:100%\"'></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
define("control/admin", [
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
