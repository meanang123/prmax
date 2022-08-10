require({cache:{
'url:prmaxquestionnaires/pages/templates/DeskDetails.html':"<div >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\"' class=\"scrollpanel\" >\r\n\t\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t<input data-dojo-props='type:\"hidden\",name:\"questionnaireid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"questionnaireid\">\r\n\t\t\t\t<table width=\"100%\" cellspacing=\"1\" cellpadding=\"1\">\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"100px\">Desk Name</td><td><input data-dojo-props='style:\"width:90%\",name:\"deskname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter deskname\"' data-dojo-attach-point=\"deskname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:70%\",required:false' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town/City</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:90%\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"right\",style:\"width:50%;height:100%\"' class=\"scrollpanel\" >\r\n\t\t\t<div style=\"border:1px solid black;text-align: center;vertical-align: middle; margin: auto;margin: 5%;font-size:1.1em;padding:4px\">\r\n\t\t\t\t<p><b>Welcome to the PRmax editorial desk update wizard</b></p>\r\n\t\t\t\t<p>Working through the wizard will mean the details we hold about your editorial desk and its journalists will be accurate and up-to-date.</p>\r\n\t\t\t\t<p>Please check the information in the fields to the left and amend as necessary. Then select the \"Next\" button in the bottom right hand corner of the screen to move to the next step in the wizard.</p>\r\n\t\t\t\t<p>There are three steps in total as indicated by the progress tabs that run along the top of the screen. You can move forward and back through the wizard at anytime.</p>\r\n\t\t\t\t<p>You can save any amendments made at anytime by selecting the \"Save\" button in the bottom right hand corner of each tab.</p>\r\n\t\t\t\t<p>The deadline for each update is given in the top right hand corner of the screen. In total you will receive two reminders to update your desk before the deadline passes.</p>\r\n\t\t\t\t<p>If the details are correct or when you have completed your update press the Save button and close the browser tab or page.</p>\r\n\t\t\t\t<p>If you have any questions please email the Research team at <a data-dojo-attach-point=\"support_email_address\" target=\"_blank\" href=\"mailto:updates@prmax.co.uk\">updates@prmax.co.uk</a></p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n</div>\r\n"}});
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
define("prmaxquestionnaires/pages/DeskDetails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/DeskDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dojox/validate"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr ){
 return declare("prmaxquestionnaires.pages.DeskDetails",
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
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Updated");
		}
		else
		{
			alert("Failed to updated");
			if ( this._page_error)
				this._page_error();
		}
	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			this.deskname.set("value",outlet.desk.deskname);
			this.countryid.set("value",outlet.outlet.countryid);
			this.address1.set("value",outlet.address.address1);
			this.address2.set("value",outlet.address.address2);
			this.townname.set("value",outlet.address.townname);
			this.county.set("value",outlet.address.county);
			this.postcode.set("value",outlet.address.postcode);

			this.email.set("value",outlet.communications.email);
			this.tel.set("value",outlet.communications.tel);
			this.fax.set("value",outlet.communications.fax);
			this.linkedin.set("value",outlet.communications.linkedin);
			this.twitter.set("value",outlet.communications.twitter);
			this.facebook.set("value",outlet.communications.facebook);
			this.instagram.set("value",outlet.communications.instagram);
		}

		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			if (this._page_error)
				this._page_error();
			throw "n";
		}
		 request.post('/questionnaire/update_desk_details',
			utilities2.make_params({ data : this.form.get("value")})).
			then (this._updated_call_back,this._error_handler_call_back);
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		if (this._page_error)
			this._page_error();
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update();
	}
});
});





