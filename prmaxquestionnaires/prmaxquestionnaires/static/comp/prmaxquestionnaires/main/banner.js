define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../main/templates/banner.html",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/_base/lang"
], function(declare, BaseWidgetAMD, template, topic, ContentPane, domclass, domattr, lang){

 return declare("prmaxquestionnaires.main.banner",
	[BaseWidgetAMD, ContentPane],{
	templateString: template,
	mode:"normal",
	questionnaireid:-1,
	constructor: function()
	{
		topic.subscribe("/q/oname", lang.hitch(this,this._outlet_name_event));
	},
	postCreate:function()
	{
		this.inherited(arguments);

		domattr.set(this.title_text,"innerHTML",PRMAX.questionnaire.outlet.outlet.outletname);
		domattr.set(this.deadline_text,"innerHTML",PRMAX.questionnaire.expire_date);
		topic.subscribe("/shop_page_tab", lang.hitch(this, this._move_tab_event));

		// using the data check to see if this is a freelance if so
		// shopw only freelance tabs
	},
	_show_title:function()
	{
		this._show_page_call("title");
		topic.publish("/show_page","title");
	},
	_show_profile:function()
	{
		this._show_page_call("profile");
		topic.publish("/show_page","profile");
	},
	_show_journalists:function()
	{
		this._show_page_call("journalists");
		topic.publish("/show_page","journalists");
	},
	_show_related_outlets:function()
	{
		this._show_page_call("related_outlets");
		topic.publish("/show_page","related_outlets");
	},
	_show_geographical_coverage:function()
	{
		this._show_page_call("geographical_coverage");
		topic.publish("/show_page","geographical_coverage");

	},
	_move_tab_event:function ( pagename )
	{
		this._show_page_call(pagename);
	},
	_show_page_call:function ( pagename )
	{
		switch ( pagename)
		{
		case "title":
			domclass.remove(this.profile_view,"selected");
			domclass.remove(this.journalists_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.remove(this.geographical_coverage_view,"selected");
			domclass.add(this.title_view,"selected");
			break;
		case "profile":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.journalists_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.remove(this.geographical_coverage_view,"selected");
			domclass.add(this.profile_view,"selected");
			break;
		case "journalists":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.profile_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.remove(this.geographical_coverage_view,"selected");
			domclass.add(this.journalists_view,"selected");
			break;
		case "related_outlets":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.journalists_view,"selected");
			domclass.remove(this.profile_view,"selected");
			domclass.remove(this.geographical_coverage_view,"selected");
			domclass.add(this.related_outlets_view,"selected");
			break;
		case "geographical_coverage":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.journalists_view,"selected");
			domclass.remove(this.profile_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.add(this.geographical_coverage_view,"selected");
			break;
		}
	},
	_outlet_name_event:function( outletname )
	{
		domattr.set(this.title_text,"innerHTML", outletname );
	}
});
});
