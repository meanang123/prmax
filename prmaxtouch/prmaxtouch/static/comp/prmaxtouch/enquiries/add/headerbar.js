define([
	"dojo/_base/declare", // declare
	"prmaxtouch/customdialog",
	"ttl/BaseWidgetAMD",
	"dojo/text!../add/templates/headerbar.html",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer"
	],
	function(declare, customdialog, BaseWidgetAMD, template, lang, domclass, domattr, topic, ContentPane){
return declare("prmaxtouch.enquiries.add.headerbar",
	[BaseWidgetAMD, ContentPane],{
	templateString:template,
	pprdialog:new customdialog(),
	customerid:-1,
	constructor: function()
	{
		this.returnurl = null;
		topic.subscribe("confirm/prmaxtouch/logout", lang.hitch(this, this._logout_confirm));
	},

	postCreate:function()
	{
		this.inherited(arguments);
	},

	_fill:function(logout,posid,customerid,returnurl,customeronly)
	{
	},
	_home:function()
	{
		window.location = "/start";
	},

	_logout:function()
	{
		this.pprdialog.confirm({
			topic: "confirm/prmaxtouch/logout",
			title: "Logout",
			message: "Are you sure you wish to"+
				"<br/>logout of Prmax?"});
	},
	_logout_confirm:function(response)
	{
		if (response == "yes")
		{
			if (this.returnurl)
				window.location = this.returnurl;
			else
				window.location.href = "/logout";
		}
	}

});
});

