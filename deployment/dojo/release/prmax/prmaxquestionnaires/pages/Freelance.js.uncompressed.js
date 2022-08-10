require({cache:{
'url:prmaxquestionnaires/pages/templates/Freelance.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\"' class=\"scrollpanel\">\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"questionnaireid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"questionnaireid\">\r\n\t\t\t<table width=\"100%\" cellspacing=\"1\" cellpadding=\"1\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Name</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<table style=\"width:99%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" width=\"50px\">Prefix</td><td class=\"prmaxrowtag\" width=\"120px\">First</td>\r\n\t\t\t\t\t\t\t\t\t\t<td class=\"prmaxrowtag\">Surname</td>\r\n\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 2em\",\"class\":\"prmaxinput\",name:\"prefix\"' data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\"></input></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-props= '\"class\":\"prmaxinput\",name:\"firstname\",style:\"width: 5em;\",type:\"text\",trim:true' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\"></input></td>\r\n\t\t\t\t\t\t\t\t<td><input data-dojo-attach-point=\"familyname\" data-dojo-props='name:\"familyname\", type:\"text\", trim:true, required:\"true\",style:\"width: 18em\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:\"120\",style:\"width:90%\",trim:true' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Blog</td><td><input data-dojo-attach-point=\"blog\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"blog\",type:\"text\",maxlength:\"120\",style:\"width:90%\",trim:true' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town/City</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:90%\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"mobile\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Writes about&nbsp;</td><td data-dojo-attach-point=\"interests_org\"></td></tr>\r\n\t\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" valign=\"top\">Update Writes about - In the box below please add, amend or request deletion of the areas of interest.</td></tr>\r\n\t\t\t\t<tr><td></td><td><div class=\"fixedsmalltextframe\"><textarea data-dojo-attach-point=\"interests\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"interests\",style:\"width:99%;height:99%\",placeHolder:\"add, amend or request deletion of the areas of interest\"'></textarea></div></td></tr>\r\n\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"right\",style:\"width:50%;height:100%\"' class=\"scrollpanel\">\r\n\t\t<div style=\"border:1px solid black;text-align: center;vertical-align: middle; margin: auto;margin: 5%;font-size:1.1em;padding:4px\">\r\n\t\t\t<p style=\"text-align:center\"><b>Welcome to the PRmax freelancer update</b></p>\r\n\t\t\t<p style=\"text-align:center\">Please check the information in the fields and amend as necessary.</p>\r\n\t\t\t<p style=\"text-align:center\">You can save any amendments made at anytime by selecting the \"Save\" button in the bottom right hand corner of the screen.</p>\r\n\t\t\t<p style=\"text-align:center\">The deadline for each update is given in the top right hand corner of the screen. In total you will receive two reminders to update your listing before the deadline passes.</p>\r\n\t\t\t<p style=\"text-align:center\">When your update is complete press the Save button and close the browser tab or page.</p>\r\n\t\t\t<p style=\"text-align:center\">If you have any questions please email the Research team at <a data-dojo-attach-point=\"support_email_address\" target=\"_blank\" href=\"mailto:updatesh@prmax.co.uk\">updates@prmax.co.uk</a></p>\r\n\t\t</div>\r\n\t\t<br/>\r\n\t\t<p style=\"text-align:center\" class=\"prmaxrowtag\">Profile</p>\r\n\t\t<div class=\"stdtextframe2\"><textarea data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"editorialprofile\",style:\"width:99%;height:99%;font-family:sans-serif;font-size:10pt\"' ></textarea></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    MainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/11/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prmaxquestionnaires/pages/Freelance", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/Freelance.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/registry",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dojox/validate"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr, registry ){
 return declare("prmaxquestionnaires.pages.Freelance",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{

		this._updated_call_back = lang.hitch ( this , this._updated_call );
		this._error_handler_call_back = lang.hitch(this,this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;
	},
	postCreate:function()
	{
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.load(PRMAX.questionnaire);

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.support_email_address,"href","mailto:researchgroup@prmax.co.uk");
			domattr.set(this.support_email_address,"innerHTML","researchgroup@prmax.co.uk");
		}

		this.inherited(arguments)
	},
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Failed to updated");
		}

		registry.byId("mainframe").savebtn.cancel();

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			this.countryid.set("value",outlet.outlet.countryid);
			this.address1.set("value",outlet.address.address1);
			this.address2.set("value",outlet.address.address2);
			this.townname.set("value",outlet.address.townname);
			this.county.set("value",outlet.address.county);
			this.postcode.set("value",outlet.address.postcode);
			this.www.set("value",outlet.outlet.www);
			this.email.set("value",outlet.communications.email);
			this.tel.set("value",outlet.communications.tel);
			this.mobile.set("value",outlet.communications.mobile);
			this.fax.set("value",outlet.communications.fax);
			this.linkedin.set("value",outlet.communications.linkedin);
			this.twitter.set("value",outlet.communications.twitter);
			this.facebook.set("value",outlet.communications.facebook);
			this.instagram.set("value",outlet.communications.instagram);
			this.blog.set("value",outlet.communications.blog);
			this.prefix.set("value",contact.prefix);
			this.firstname.set("value",contact.firstname);
			this.familyname.set("value",contact.familyname);
			this.interests.set("value",contact.interests);

			domattr.set(this.interests_org,"innerHTML",contact.interests_org);
			if (outlet.outletprofile.profile)
			{
				if (outlet.outletprofile.profile.editorialprofile != null)
					this.editorialprofile.set("value", outlet.outletprofile.profile.editorialprofile.replace(/<br\/>/gi, "\n"));
				}
			else
			{
				this.editorialprofile.set("value", "");
			}
		}
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "n";
		}

		var content=this.form.get("value");

		content["editorialprofile"] = this.editorialprofile.get("value");

		request.post('/questionnaire/update_freelance',
			utilities2.make_params({ data : content})).
			then (this._updated_call_back,this._error_handler_call_back);
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		registry.byId("mainframe").savebtn.cancel();
	}
});
});





