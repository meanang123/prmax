require({cache:{
'url:prmaxquestionnaires/main/templates/banner.html':"<div class=\"banner_body\">\r\n<div style=\"float:left;width:100%\">\r\n\t<p style=\"float:left\" class=\"mb_details_large\">Your update for&nbsp;<span data-dojo-attach-point=\"title_text\"></span></p>\r\n\t<p style=\"float:right\" class=\"mb_details_large\">The deadline for this update is: <span data-dojo-attach-point=\"deadline_text\"></span></p>\r\n</div>\r\n\t<ul class=\"main-menu\" style=\"float:right;text-align:right\">\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_title\" data-dojo-attach-point=\"title_view\" class=\"first selected\"><a title=\"1. Name &amp; Address\" >1.Name &amp; Address</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_journalists\" data-dojo-attach-point=\"journalists_view\" class=\"std\"><a title=\"2. Journalists\">2. Journalists</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_profile\" data-dojo-attach-point=\"profile_view\" class=\"std\"><a title=\"3. Profile\">3. Profile</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_geographical_coverage\" data-dojo-attach-point=\"geographical_coverage_view\" class=\"std\"><a title=\"4. Geographical Coverage\">4. Coverage</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_related_outlets\" data-dojo-attach-point=\"related_outlets_view\" class=\"last\"><a title=\"5. Your Details\">5. Your Details</a></li>\r\n\t</ul>\r\n</div>\r\n"}});
define("prmaxquestionnaires/main/banner", [
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
