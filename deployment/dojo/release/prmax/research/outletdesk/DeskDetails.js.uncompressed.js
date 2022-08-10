require({cache:{
'url:research/outletdesk/templates/DeskDetails.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Desk Name1</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"deskname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter deskname\"' data-dojo-attach-point=\"deskname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">House/Street</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,required:false,style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td></tr>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\t\t\t\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\t\t\t\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\t\t\t\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\t\t\t\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"updatebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Updating Desk...\",label:\"Update Desk\"'></button></td>\r\n\t\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    DeskDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 21/01/2015
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outletdesk/DeskDetails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outletdesk/templates/DeskDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/validate/regexp",
	"dijit/form/Button",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dojox/validate",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, JsonRestStore, ItemFileReadStore ){
 return declare("research.outletdesk.DeskDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._data = null;
		this._updated_call_back = lang.hitch ( this , this._updated_call );
	},
	postCreate:function()
	{
//		this.facebook_show.set("source",this.facebook);
//		this.twitter_show.set("source",this.twitter);	
//		this.linkedin_show.set("source",this.linkedin);
//		this.instagram_show.set("source",this.instagram);

		this.inherited(arguments);
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
		this.updatebtn.cancel();
	},
	clear:function()
	{
		this.updatebtn.cancel();
//		this._reset_fields();
	},

	load:function(data, researchprojectitemid)
	{
	
		this._data = data;

		this.deskname.set("value", data.outletdesk.deskname) ;

		var address1="";
		var address2="";
		var townname="";
		var county="";
		var postcode="";


		if (data.deskaddress)
		{
			address1 = data.deskaddress.address1;
			address2 = data.deskaddress.address2;
			townname = data.deskaddress.townname;
			county = data.deskaddress.county;
			postcode = data.deskaddress.postcode;
		}

		this.address1.set("value", address1);
		this.address2.set("value", address2);
		this.townname.set("value", townname);
		this.county.set("value", county);
		this.postcode.set("value", postcode);

		this.email.set("value",data.outletdeskcomms.email);
		this.tel.set("value",data.outletdeskcomms.tel);
		this.fax.set("value",data.outletdeskcomms.fax);
		this.linkedin.set("value",data.outletdeskcomms.linkedin);
		this.twitter.set("value",data.outletdeskcomms.twitter);
		this.facebook.set("value",data.outletdeskcomms.facebook);
		this.instagram.set("value",data.outletdeskcomms.instagram);
		this.researchprojectitemid.set("value",researchprojectitemid);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		var data = this.form.get("value");
		data['outletdeskid'] = this._data.outletdesk.outletdeskid;
		request.post('/research/admin/outlets/desks/update_details',
			utilities2.make_params({ data : data})).
			then (this._updated_call_back);
	}
});
});





