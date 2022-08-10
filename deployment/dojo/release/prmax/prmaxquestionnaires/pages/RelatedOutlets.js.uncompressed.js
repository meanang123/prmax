require({cache:{
'url:prmaxquestionnaires/pages/templates/RelatedOutlets.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\"' class=\"scrollpanel\" >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"questionnaireid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"questionnaireid\">\r\n\t\t\t</br/>\r\n\t\t\t<table width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td></td>\r\n\t\t\t\t\t<td class=\"prmaxrowtag\" width=\"50px\" >Prefix</td><td class=\"prmaxrowtag\" width=\"120px\" >First</td><td class=\"prmaxrowtag\" width=\"120px\" >Surname</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"110px\">Name</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"research_prefix\",type:\"text\",style:\"width:3em\"'></td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"research_firstname\",type:\"text\",style:\"width:8em\"'></input></td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"surname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"research_surname\",type:\"text\",trim:true,invalidMessage:\"Please enter conatct surname\",style:\"width:12em\"'></input></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td colspan=\"3\" ><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"research_job_title\",type:\"text\",style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td colspan=\"3\" ><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"research_email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n<!--\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td colspan=\"3\" ><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"research_tel\",type:\"text\",maxlength:40,trim:true,style:\"width:30%\"' /></td></tr>\r\n-->\t\t\t\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' class=\"scrollpanel\" >\r\n\t\t<div style=\"border:1px solid black;text-align: center;vertical-align: middle; margin: auto;margin: 5%;font-size:1.1em;padding:4px\">\r\n\t\t\t<p><b>PRmax contact</b></p>\r\n\t\t\t<p>Are you the right person to contact to update our information?</p>\r\n\t\t\t<p>If not, please update the fields to the left with the correct details.</p>\r\n\t\t\t<p>Thank you for your help.</p><br/>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prmaxquestionnaires/pages/RelatedOutlets", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/RelatedOutlets.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"prcommon2/outlet/OutletSelect",
	"prcommon2/outlet/OutletSelectSimple",
	"prcommon2/outlet/SelectMultipleOutlets"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request , JsonRest, ItemFileReadStore){
 return declare("prmaxquestionnaires.pages.RelatedOutlets",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.load(PRMAX.questionnaire);

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			if ( outlet.research != null)
			{
				this.surname.set("value", outlet.research.research_surname );
				this.firstname.set("value", outlet.research.research_firstname );
				this.prefix.set("value", outlet.research.research_prefix );
				this.email.set("value", outlet.research.research_email );
//				this.tel.set("value", outlet.research.research_tel );
				this.job_title.set("value", outlet.research.research_job_title );
			}
		}
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update_related:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/questionnaire/update_related_outlets',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Related Outlets Updated");
		}
		else
		{
			alert("Changes Failed to Apply");
			if ( this._page_error)
				this._page_error();
		}
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		if ( this._page_error)
			this._page_error();
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update_related();
	}
});
});





