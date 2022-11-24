define([
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
