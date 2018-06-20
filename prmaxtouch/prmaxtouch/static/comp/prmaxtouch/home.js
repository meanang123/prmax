define([
    "dojo/_base/declare", // declare
    "prmaxtouch/customdialog",
    "ttl/BaseWidgetAMD",
    "dojo/text!../prmaxtouch/templates/home.html",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/topic",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
    ],
       function(declare, customdialog, BaseWidgetAMD, template, lang, domclass, topic){
	return declare("prmaxtouch.home",
                [BaseWidgetAMD],{
        templateString:template,
    pprdialog:new customdialog(),
    constructor: function()
    {
        topic.subscribe("confirm/embedded/logout", lang.hitch(this, this._logout_confirm));
	},
    postCreate:function()
    {
        this.inherited(arguments);

		this.shop_name.innerHTML = this.shopname;

	},
    _enquiry:function()
    {
		window.location = "/contact/search" ;
	},

    _outlet:function()
    {
        window.location = "/outlet/search";
	},
    _logout:function()
    {
        if (this.returnurl)
        window.location = this.returnurl;
            else
        this.pprdialog.confirm({
                topic: "confirm/embedded/logout",
                title: "Logout",
                message: "Are you sure you wish to"+
                "<br/>logout of PRMax?"});
	},

    _logout_confirm:function(response)
    {
        if (response == "yes")
        	window.location.href = "/logout";
    }
});
});

