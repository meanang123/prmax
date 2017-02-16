define([
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
