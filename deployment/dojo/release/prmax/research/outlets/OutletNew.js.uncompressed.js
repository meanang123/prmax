require({cache:{
'url:research/outlets/templates/OutletNew.html':"\t<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:3em\"'>\r\n\t\t<div style=\"height:40px;width:100%;overflow:hidden\" class=\"searchresults\">\r\n\t\t\t<div style=\"height:100%;width:15%;float:left;\" class=\"prmaxrowdisplaylarge\">New Outlets</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\"  data-dojo-props='region:\"center\",style:\"overflow:auto;overflow-x:hidden\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Outlets Name</td><td><input  data-dojo-attach-point=\"outletname\" data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"outletname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter outletname\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:15em\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Media Channel</td><td class=\"prmaxrowdisplay\"><select data-dojo-props='style:\"width:20em\",\"class\":\"prmaxrequired\",name:\"prmax_outlettypeid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select outlet type\",labelType:\"html\"' \tdata-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"prmax_outlettypeid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Primary Contact</td><td><div data-dojo-props='\"class\":\"prmaxrequired\"' data-dojo-type=\"research/employees/EmployeeSelect\" data-dojo-attach-point=\"selectcontact\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title </td><td><input data-dojo-attach-point=\"jobtitle\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"jobtitle\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter primary contact job title\",style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td><input data-dojo-attach-point=\"www\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:120,pattern:dojox.validate.regexp.url,style:\"width:90%\"' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\r\n<!--\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='\"class\":\"prmaxrequired\" ,name:\"address1\",type:\"text\",trim:true,required:false,invalidMessage:\"Please enter address\",style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40,trim:true' data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><div data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation</td><td><input data-dojo-attach-point=\"circulation\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"circulation\",type:\"text\",value:0,constraints:{min:0,max:99999999},trim:true,style:\"width:6em\"'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Web Browsers</td><td><input data-dojo-attach-point=\"webbrowsers\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"webbrowsers\",type:\"text\",value:0,constraints:{min:0,max:99999999},trim:true,style:\"width:6em\"'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Frequency</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"frequency\" data-dojo-props='name:\"frequencyid\",\"class\":\"prmaxrequired\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select frequency\",labelType:\"html\"' ></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Keywords</td><td ><div data-dojo-attach-point=\"interests\" data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-props='name:\"interests\",selectonly:true,size:6,displaytitle:\"\",startopen:true,restrict:0,keytypeid:6,title:\"Select\"'></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Geo. Coverage</td><td ><div data-dojo-attach-point=\"coverage\" data-dojo-type=\"prcommon2/geographical/Geographical\" data-dojo-props='name:\"coverage\",selectonly:true,size:6,displaytitle:\"\",startopen:true,title:\"Select\"'></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Profile</td><td><div class=\"dialogprofileframelarge\"><textarea data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='\"class\":\"prmaxinput\",name:\"profile\",style:\"width: 100%;height:100%\"' ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Description</td><td ><div class=\"reasonframe\" ><textarea data-dojo-attach-point=\"reason\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"reason\",required:true,style:\"width:99%;height:80%\"'  ></textarea></div></td></tr>\r\n-->\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason Code</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:12em\",\"class\":\"prmaxrequired\"'  /></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr><td align=\"right\"><button data-dojo-attach-point=\"savebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",label:\"Add Outlet\",busyLabel:\"Please Wait Adding Outlet ...\"'></button></td></tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Interests.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outlets/OutletNew", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletNew.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"dojox/data/JsonRestStore",
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
	"prcommon2/geographical/Geographical",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRestStore, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.outlets.OutletNew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._updated_call_back = dojo.hitch ( this , this._updated_call );
		this._deleted_call_back = lang.hitch(this,this._deleted_call);

		this._store = new ItemFileReadStore({target:'/research/admin/deletionhistory/list', idProperty:"deletionhistoryid"});
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store", PRCOMMON.utils.stores.OutletTypes_noFreelancer());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries())

		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
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
		
		if ( confirm("Add Outlet?"))
		{
			request.post('/research/admin/outlets/research_check',
				utilities2.make_params({ data : this.form.get("value")})).
				then(this._deleted_call_back);
		}		

	},
	
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Outlet '" + response.data.outlet_name + "' with domain '" + response.data.domain + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				request.post('/research/admin/outlets/research_add_main',
					utilities2.make_params({ data : this.form.get("value")})).
					then ( this._updated_call_back);			
			}
		}
		else
		{
			request.post('/research/admin/outlets/research_add_main',
				utilities2.make_params({ data : this.form.get("value")})).
				then ( this._updated_call_back);			
		}
		this.savebtn.cancel();
	},
	
	_updated_call: function( response )
	{
		if ( response.success=="OK")
		{
			alert("Outlet Added");
			this.clear();
			this.outletname.focus();
		}
		else
		{
			alert("Failed to add");
		}
		this.savebtn.cancel();
	},
	clear:function()
	{
//		this.frequency.set("value", 5);
		this.countryid.set("value", 1);
		this.outletname.set("value","");
		this.prmax_outlettypeid.set("value", null ) ;
		this.selectcontact.clear();
		this.jobtitle.set("value","");
//		this.address1.set("value","");
//		this.address2.set("value","");
//		this.townname.set("value","");
//		this.county.set("value","");
//		this.postcode.set("value","");
		this.www.set("value","");
//		this.email.set("value","");
//		this.tel.set("value","");
//		this.fax.set("value","");
//		this.circulation.set("value",0);
//		this.webbrowsers.set("value",0);
//		this.interests.set("value","");
//		this.coverage.set("value","");
//		this.reason.set("value","");
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
//		this.twitter.set("value","");
//		this.facebook.set("value","");
//		this.linkedin.set("value","");
//		this.instagram.set("value","");
//		this.profile.set("value","");
		this.savebtn.cancel();
	}
});
});





