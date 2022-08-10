require({cache:{
'url:control/customer/templates/options.html':"<div>\r\n    <div  data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\", gutters:false' data-dojo-attach-point=\"optionsview\" >\r\n        <div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\", style:\"width:99%;height:100%\"' data-dojo-attach-point=\"options_tab\">\r\n            <div data-dojo-type=\"control/customer/options/details\" data-dojo-props='style:\"width:99%;height:100%\", title:\"Details\"' data-dojo-attach-point=\"options_tab_details\"></div>\r\n            <div data-dojo-type=\"control/customer/options/PrmaxDataSets\" data-dojo-props='style:\"width:99%;height:100%\", title:\"Data Sets\"' data-dojo-attach-point=\"datasets\"></div>\r\n            <div data-dojo-type=\"control/customer/options/extendedsettings\" data-dojo-props='style:\"width:99%;height:100%\", title:\"Extended Settings\"' data-dojo-attach-point=\"extendedsettings\"></div>\r\n            <div data-dojo-type=\"control/customer/options/emailserver\" data-dojo-props='style:\"width:99%;height:100%\", title:\"Email Server\"' data-dojo-attach-point=\"emailserver\"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n"}});
define("control/customer/options", [
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
	"control/customer/options/PrmaxDataSets",
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
