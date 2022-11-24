define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/topic",
	"dojo/text!../main/templates/freelanceframe.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojox/collections/Dictionary",
	"dijit/layout/ContentPane",
	"dijit/layout/StackContainer",
	"prmaxquestionnaires/pages/Freelance"
], function(declare, BaseWidgetAMD, topic, template, BorderContainer, lang, domclass, domattr, Dictionary){

 return declare("prmaxquestionnaires.main.freelanceframe",
	[BaseWidgetAMD, BorderContainer],{
	questionnaireid:-1,
	gutters:true,
	templateString: template,
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);

		domattr.set(this.deadline_text,"innerHTML",PRMAX.questionnaire.expire_date);
		domattr.set(this.title_text,"innerHTML",PRMAX.questionnaire.outlet.outlet.outletname);

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.support_email_address,"href","mailto:researchgroup@prmax.co.uk");
			domattr.set(this.support_email_address,"innerHTML","researchgroup@prmax.co.uk");
		}
	},
	_save_completed:function()
	{
		this.savebtn.cancel();
		alert("Saved");
	},
	_update_save:function()
	{
		this.maindetails.update();
	}
});
});
