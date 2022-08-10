require({cache:{
'url:control/customer/templates/view_internal.html':"<div>\r\n\t<div data-dojo-attach-point=\"tab_frame\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='style:\"width:100%;height:100%\",region:\"center\",gutters:\"false\"'>\r\n\t\t<div data-dojo-attach-point=\"view_summary\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"Summary\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_users\" data-dojo-type=\"control/customer/users\" data-dojo-props='title:\"Users\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_details\" data-dojo-type=\"control/customer/details\" data-dojo-props='title:\"Details\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_options\" data-dojo-type=\"control/customer/options\" data-dojo-props='title:\"Options\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_financial_details\" data-dojo-type=\"control/customer/financial\" data-dojo-props='title:\"Financial\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_financial_log\" data-dojo-type=\"control/customer/financiallog\" data-dojo-props='title:\"Financial Log\",style:\"width:100%;height:100%\"' ></div>\r\n\t\t<div data-dojo-attach-point=\"view_audit\" data-dojo-type=\"control/customer/audit\" data-dojo-props='title:\"Audit\",style:\"width:100%;height:100%\"' ></div>\r\n\t</div>\r\n</div>\r\n"}});
define("control/customer/view_internal", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/view_internal.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/string",
	"control/customer/users",
	"control/customer/details",
	"control/customer/options",
	"control/customer/financial",
	"control/customer/financiallog",
	"control/customer/audit"
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,string){

 return declare("control.customer.view_internal",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	mainViewString:"/customer/summary?icustomerid=${icustomerid}",

	constructor: function()
	{
	 this._load_details_call_back = lang.hitch(this, this._load_details_call);
	 this._error_call_back = lang.hitch(this, this._error_call);
	 topic.subscribe("/customer/p_upd", lang.hitch(this, this._refresh_event));
	 this._icustomerid = null;
	},
	postCreate:function()
	{
	},
	load:function(icustomerid,display_func)
	{
	 this._display_func = display_func;
	 this._icustomerid = icustomerid;
	 request.post('/customer/get_internal',
		utilities2.make_params({data: {icustomerid:icustomerid}})).then
					(this._load_details_call_back, this._error_call_back);
		this.view_summary.set("href",string.substitute(this.mainViewString,{icustomerid:icustomerid}));
	},
	_load_details_call:function(response)
	{
	 if (response.success=="OK")
	 {
		this.view_users.load(this._icustomerid);
		this.view_details.load(response.data);
		this.view_financial_details.load(response.data);
		this.view_financial_log.load(this._icustomerid);
		this.view_audit.load(this._icustomerid);
		this._display_func("view_internal");
		this.view_options.load(response.data.cust, response.data.emailserver, response.data.mediaaccesstype, response.data.custsource)
	 }
	 else
	 {

	 }
	},
	_error_call:function()
	{
	 alert(arguments[0]);
	},
	clear:function()
	{
	 this.view_summary.set("content","");
	 this._icustomerid = null;
	},
	_refresh_event:function()
	{
	 if (this._icustomerid != null)
	 {
		this.view_summary.set("href",string.substitute(this.mainViewString,{icustomerid:this._icustomerid}));
	 }
	}
});
});
