require({cache:{
'url:prmaxquestionnaires/main/templates/freelanceframe.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:37px\",title:\"Banner\",\"class\":\"banner_body\"'>\r\n\t\t<div style=\"float:left;width:100%\">\r\n\t\t\t<p style=\"float:left\" class=\"mb_details_large\">Your update for &nbsp;<span data-dojo-attach-point=\"title_text\"></span></p>\r\n\t\t\t<p style=\"float:right\" class=\"mb_details_large\">The deadline for this update is: <span data-dojo-attach-point=\"deadline_text\"></span></p>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"prmaxquestionnaires/pages/Freelance\" data-dojo-attach-point=\"maindetails\" data-dojo-props='region:\"center\"'></div>\r\n\t<div  data-dojo-props='region:\"bottom\",style:\"height:55px;width:100%;overflow:hidden\"' data-dojo-attach-point=\"bottom_panel\" data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td><p class=\"footer_text\">Contact PRmax. Email <a data-dojo-attach-point=\"support_email_address\" href=\"mailto:updates@prmax.co.uk\" target=\"_blank\">updates@prmax.co.uk</a></p></td>\r\n\t\t\t\t<td><p class=\"footer_text\"><a href=\"http://app.prmax.co.uk/static2/html/prmax-data-use-policy.html\" target=\"_blank\">Data Protection statement</a></p></td>\r\n\t\t\t\t<td><p class=\"footer_text\"><a href=\"http://app.prmax.co.uk/static2/html/prmax-copyright-statement.html\" target=\"_blank\">Copyright statement</a></p></td>\r\n\t\t\t\t<td align=\"right\">\r\n\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_update_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='float:\"right\",type:\"button\",busyLabel:\"Please Wait\",label:\"Save\"'></button>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
define("prmaxquestionnaires/main/freelanceframe", [
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
