require({cache:{
'url:prmaxquestionnaires/main/templates/deskbanner.html':"<div class=\"banner_body\">\r\n<div style=\"float:left;width:100%\">\r\n\t<p style=\"float:left\" class=\"mb_details_large\">Your update for&nbsp;<span data-dojo-attach-point=\"title_text\"></span></p>\r\n\t<p style=\"float:right\" class=\"mb_details_large\">The deadline for this update is: <span data-dojo-attach-point=\"deadline_text\"></span></p>\r\n</div>\r\n\t<ul class=\"main-menu\" style=\"float:right;text-align:right\">\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_title\" data-dojo-attach-point=\"title_view\" class=\"first selected\"><a title=\"1. Name &amp; Address\" >1.Name &amp; Address</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_journalists\" data-dojo-attach-point=\"journalists_view\" class=\"std\"><a title=\"2. Journalists\">2. Journalists</a></li>\r\n\t\t<li data-dojo-attach-event=\"onclick:_show_related_outlets\" data-dojo-attach-point=\"related_outlets_view\" class=\"last\"><a title=\"3. Your Details\">3. Your Details</a></li>\r\n\t</ul>\r\n</div>\r\n"}});
define("prmaxquestionnaires/main/deskbanner", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../main/templates/deskbanner.html",
	"prmaxquestionnaires/main/banner",
	"dojo/dom-attr",
	"dojo/topic",
	"dojo/dom-class"
], function(declare, BaseWidgetAMD, template, Banner,domattr,topic, domclass){

 return declare("prmaxquestionnaires.main.deskbanner",
	[Banner],{
	templateString: template,
	mode:"normal",
	questionnaireid:-1,
	postCreate:function()
	{
		this.inherited(arguments);

		domattr.set(this.title_text,"innerHTML",PRMAX.questionnaire.outlet.desk.deskname + " - " + PRMAX.questionnaire.outlet.outlet.outletname);
	},
	_show_page_call:function ( pagename )
	{
		switch ( pagename)
		{
		case "title":
			domclass.remove(this.journalists_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.add(this.title_view,"selected");
			break;
		case "journalists":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.related_outlets_view,"selected");
			domclass.add(this.journalists_view,"selected");
			break;
		case "related_outlets":
			domclass.remove(this.title_view,"selected");
			domclass.remove(this.journalists_view,"selected");
			domclass.add(this.related_outlets_view,"selected");
			break;
		}
	}
});
});
