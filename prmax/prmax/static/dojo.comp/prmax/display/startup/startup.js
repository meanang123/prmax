dojo.provide("prmax.display.startup.startup");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.layout.GridContainer");
dojo.require("dojox.widget.Portlet");
dojo.require("dojox.widget.FeedPortlet");

dojo.require("prmax.display.startup.plugins.standing");
dojo.require("prmax.display.startup.plugins.distribution");
dojo.require("prmax.display.startup.plugins.contactus");
dojo.require("prmax.display.startup.plugins.updatum");
dojo.require("prmax.display.startup.plugins.prrequests");


dojo.require("dojox.data.AtomReadStore");

dojo.declare("prmax.display.startup.startup",
	[ ttl.BaseWidget ],{
	url:"",
	templatePath: dojo.moduleUrl( "prmax.display.startup","templates/startup.html"),
	postCreate:function()
	{

		// for later
		//if (PRMAX.utils.settings.updatum == true)
		//{
			//var updatum = new prmax.display.startup.plugins.updatum({ dndType:"Portlet", dragRestriction:true});
			//this.frame.addChild(updatum, 0, 0);
		//}
		var tmp = new dijit.layout.ContentPane({ dndType:"Portlet", dragRestriction:true, style:"width:100%;height:100%"});
		this.frame.addChild(tmp, 0, 0);

		this.frame.addChild(new prmax.display.startup.plugins.distribution({ dndType:"Portlet", dragRestriction:true}), 0, 0);
		this.frame.addChild(new prmax.display.startup.plugins.standing({ dndType:"Portlet", dragRestriction:true}), 0, 0);

		this.frame.addChild(new prmax.display.startup.plugins.contactus({ dndType:"Portlet", dragRestriction:true}), 1, 0);
		this.frame.addChild(new dojox.widget.ExpandableFeedPortlet({
			dndType:"Portlet",
			dragRestriction:true,
			url:"http://prnewslink.net/rss.xml",
			maxResults:3,
			closable:false,
			toggleable:false }), 1, 0);
		this.frame.addChild(new prmax.display.startup.plugins.prrequests({ dndType:"Portlet", dragRestriction:true}), 1, 0);


		this.inherited(arguments);
	},
	resize:function()
	{
		var tmp = arguments[0];
		console.log("STARTUP",tmp);
		this.frame.resize( arguments[0] );
	}
});
