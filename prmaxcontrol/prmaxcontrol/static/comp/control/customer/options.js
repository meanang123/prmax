define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/options.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"control/accounts/PriceCodes",
	"control/customer/view_internal",
	"control/customer/view_partner",
	"control/customer/options/emailserver",
	"control/customer/options/extendedsettings",
	"control/customer/options/prmaxdatasets",
	"control/customer/options/details",
	
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass){

 return declare("control.customer.options",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	},
	postCreate:function()
	{
	},
	load:function(customer, emailserver, mediaaccesstype, custsource)
	{
		this.emailserver.load(customer, emailserver);
		this.extendedsettings.load(customer, mediaaccesstype);
		this.datasets.load(customer.customerid, customer.has_international_data);
		this.options_tab_details.load(customer, custsource);
		this.options_tab.selectChild(this.options_tab_details);
	},
	
});
});
