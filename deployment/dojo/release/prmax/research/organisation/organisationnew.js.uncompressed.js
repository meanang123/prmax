require({cache:{
'url:research/organisation/templates/organisationnew.html':"<div>\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:3em\"'>\n\t\t<h1 class=\"prmaxrowdisplaylarge\">New Organisation</h1>\n\t</div>\n\t<div data-dojo-type=\"dijit/layout/ContentPane\"  data-dojo-props='region:\"center\",style:\"overflow:auto;overflow-x:hidden\"' >\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"150px\">Outlets Name</td><td><input  data-dojo-attach-point=\"outletname\" data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"outletname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter outletname\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Media Channel</td><td class=\"prmaxrowdisplay\"><select data-dojo-props='style:\"width:20em\",\"class\":\"prmaxrequired\",name:\"prmax_outlettypeid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select outlet type\",labelType:\"html\"' \tdata-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"prmax_outlettypeid\"></select></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:15em\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='\"class\":\"prmaxrequired\" ,name:\"address1\",type:\"text\",trim:true,required:false,invalidMessage:\"Please enter address\",style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td><input data-dojo-attach-point=\"www\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:120,pattern:dojox.validate.regexp.url,style:\"width:90%\"' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><div data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Profile</td><td><div class=\"dialogprofileframelarge\"><textarea data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='\"class\":\"prmaxinput\",name:\"profile\",style:\"width: 100%;height:100%\"' ></textarea></div></td></tr>\n\t\t\t</table>\n\t\t</form>\n\t</div>\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n\t\t\t<tr><td align=\"right\"><button data-dojo-attach-point=\"savebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",label:\"Add Outlet\",busyLabel:\"Please Wait Adding Outlet ...\",iconClass:\"fa fa-search-plus fa-2x\"'></button></td></tr>\n\t\t</table>\n\t</div>\n</div>\n"}});
//-----------------------------------------------------------------------------
// Name:    organisationnew.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/organisation/organisationnew", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../organisation/templates/organisationnew.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.organisation.organisationnew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._updated_call_back = lang.hitch (this, this._updated_call);
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store", PRCOMMON.utils.stores.OutletTypes_noFreelancer());
		//this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries())

		//this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.countryid.set("value", 1);

		this.inherited(arguments);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		request.post('/research/admin/organisation/research_add_organisation',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._updated_call_back);
	},
	_updated_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Organisation Added");
			this.savebtn.cancel();
			this.clear();
			this.outletname.focus();
		}
		else
		{
			alert("Failed to add");
			this.savebtn.cancel();
		}
	},
	clear:function()
	{
		this.prmax_outlettypeid.set("value", null ) ;
		this.countryid.set("value", 1);
		this.outletname.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.tel.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.profile.set("value","");
		this.savebtn.cancel();
	}
});
});





