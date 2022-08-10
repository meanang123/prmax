require({cache:{
'url:research/freelance/templates/FreelanceNew.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:3em\"'>\r\n\t\t<div style=\"height:40px;width:100%;overflow:hidden\" class=\"searchresults\">\r\n\t\t\t<div style=\"height:100%;width:45%;float:left;\" class=\"prmaxrowdisplaylarge prmaxHeadingStyle\">Add Research Freelance</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t<form  data-dojo-props='\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"requirednode\" data-dojo-type=\"dijit/form/Form\">\r\n\t<table style=\"width:100%\" class=\"prmaxtable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t<tr><td width=\"9em\" align=\"right\" class=\"prmaxrowtag\">Person</td><td><div data-dojo-type=\"research/employees/EmployeeSelect\" data-dojo-attach-point=\"selectcontact\" data-dojo-props='displayname:\"\",mustexists:true,required:true,invalidMessage:\"Person Must be selected\"'></div></td></tr>\r\n\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Country</td><td><select data-dojo-props='style:\"width:200px\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\" ' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",size:40,required:false,style:\"width:24em\"' data-dojo-type=\"dijit/form/TextBox\" /></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"address2\",type:\"text\",size:40,maxlength:80,style:\"width:24em\"'/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td>\t<td><input data-dojo-attach-point=\"townname\" data-dojo-props='name:\"townname\",type:\"text\",size:\"30\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-props='name:\"county\",type:\"text\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Postcode</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"postcode\",type:\"text\",size:\"20\",maxlength:\"10\",style:\"width:10em\"'/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"www\",type:\"text\",size:\"40\",maxlength:\"120\",trim:true,style:\"width:30em\"'/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"email\",type:\"text\",size:40,maxlength:80,trim:true,pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:\"40\",maxlength:\"70\",style:\"width:24em\"'/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='name:\"tel\",type:\"text\",size:\"25\",maxlength:\"40\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-props='name:\"fax\",type:\"text\",size:\"25\",maxlength:\"40\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-attach-point=\"mobile\" data-dojo-props='name:\"mobile\",type:\"text\",size:\"25\",maxlength:\"40\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><input data-dojo-attach-point=\"twitter\" data-dojo-props='\"class\":\"prmaxinput\",name:\"twitter\",type:\"text\",maxlength:\"80\",pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\r\n\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Keywords</td><td><div  data-dojo-attach-point=\"interests\" data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-props='name:\"interests\",title:\"\",startopen:true,restrict:0,selectonly:true,keytypeid:6,displaytitle:\"\"'></div></td></tr>\r\n\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Profile</td><td><div class=\"dialogprofileframelarge\"><textarea data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"profile\",style:\"width: 100%; height:100%\"' ></textarea></div></td></tr>\r\n\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"center\" valign=\"top\">Reason </td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Code</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"' /></td></tr>\r\n\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"reason\",required:true,style:\"width:99%;height:80%\"'  ></textarea></div></td></tr>\r\n</table>\r\n</form>\r\n</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table style=\"width:100%;border-style:collapsed\"><tr><td align=\"right\">\r\n\t\t\t<button data-dojo-attach-point=\"savenode\"  data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Add Freelancer\"' data-dojo-attach-event=\"onClick:_save\"></button>\r\n\t\t\t</td></tr></table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/freelance/FreelanceNew", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceNew.html",
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
	"research/employees/EmployeeSelect",
	"dojox/validate",
	"prcommon2/interests/Interests",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.freelance.FreelanceNew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this._saved_call_back = lang.hitch(this, this._saved);
		this._load_call_back= lang.hitch(this, this._loaded);
		this._deleted_call_back= lang.hitch(this, this._deleted_call);
		this.outletid = -1 ;
	},
	postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.countryid.set("value", 1);

		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Added");
			this.new_freelance();
			this.selectcontact.focus();
		}
		else
		{
			alert("Failed");
		}
		this.savenode.cancel();
	},
	_save:function()
	{
		var data = {};
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		
		if ( confirm("Add Freelance?"))
		{
			request.post('/research/admin/outlets/research_freelance_check',
				utilities2.make_params({ data : this.requirednode.get("value")})).
				then(this._deleted_call_back);
		}
	},
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Freelance '" + response.data.outlet_name + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				data = 	this.requirednode.get("value");
				data['outletid'] = this.outletid;
				request.post('/research/admin/outlets/freelance_research_add',
					utilities2.make_params( {data:data})).then
					(this._saved_call_back);			
			}
		}
		else
		{
			data = 	this.requirednode.get("value");
			data['outletid'] = this.outletid;
			request.post('/research/admin/outlets/freelance_research_add',
				utilities2.make_params( {data:data})).then
				(this._saved_call_back);			
		}
		this.savenode.cancel();	
	},
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.countryid.set("value", 1);
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
	}
});
});
