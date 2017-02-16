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
	"control/customer/view_partner"
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
	load:function(icustomerid)
	{
	}
});
});
