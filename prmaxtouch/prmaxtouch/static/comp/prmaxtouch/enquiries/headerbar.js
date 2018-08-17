define([
	"dojo/_base/declare", // declare
	"prmaxtouch/customdialog",
	"ttl/BaseWidgetAMD",
	"dojo/text!../enquiries/templates/headerbar.html",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/topic"
	],
	function(declare, customdialog, BaseWidgetAMD, template, lang, domclass, domattr, topic){
 return declare("enquiries.headerbar",
	[BaseWidgetAMD],{
	templateString:template,
	pprdialog:new customdialog(),
	summary: 0,
	list: '',
	constructor: function()
	{
		this._customerid = -1;
		this.returnurl = null;
		
		topic.subscribe("confirm/prmaxtouch/logout", lang.hitch(this, this._logout_confirm));
	},
	
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_fill:function(logout,icon,employeeid,outletid,subject,familyname,firstname,returnurl,printurl)
	{
		if (!logout)
			domclass.add(this.logoutcell, "pprhidden");
			
		this._employeeid = employeeid;
		this._outletid = outletid;

		domclass.add(this.header_icon, icon);

		this.returnurl = returnurl;
		this.printurl = printurl;
		if (returnurl)
			this.logoutbtn.title = "Exit";
		else
			this.logoutbtn.title = "Logout";

		if (familyname)
			domattr.set(this.full_name,"innerHTML",familyname + " " + firstname);
		else
			domattr.set(this.full_name,"innerHTML","No Contact");
		if (subject)
			domattr.set(this.subject,"innerHTML",subject);
		else
			domattr.set(this.subject,"innerHTML","No Subject");
	},
	
	_open_menu:function()
	{
	},
	_add:function()
	{
		var location = "/enquiries/new";
		
		if (this._employeeid)
			location += "?employeeid=" +this._employeeid;
		if (this._outletid)
			location += "&outletid=" +this._outletid;
		window.location = location;
	},
	_search:function()
	{
		window.location = "/enquiries/search/search";
	},
	_home:function()
	{
		window.location = "/start";
	},
	_logout:function()
	{
		if (this.returnurl)
			this.pprdialog.confirm({
				topic: "confirm/prmaxtouch/logout",
				title: "Exit Prmax",
				message: "Are you sure you wish"+
					"<br/>to exit Prmax?"});
		else
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