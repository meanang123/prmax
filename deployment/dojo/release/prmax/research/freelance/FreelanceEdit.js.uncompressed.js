require({cache:{
'url:research/freelance/templates/FreelanceEdit.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-attach-point=\"outlet_container\" data-dojo-props='region:\"center\"' >\r\n\t\t<div title=\"Freelance Details\"  data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"freelance_details_view\">\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%padding-left:5px\",\"class\":\"scrollpanel\",region:\"center\"'>\r\n\t\t\t\t<form  data-dojo-data='\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"requirednode\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t<table style=\"width:98%\" class=\"prmaxtable\" cellspacing=\"0\" cellpadding=\"0\" >\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Person</td><td><div data-dojo-type=\"research/employees/EmployeeSelect\" data-dojo-attach-point=\"selectcontact\"data-dojo-props='mustexists:true,nonew:true,required:true, InvalidMessage:\"Person Must be selected\",style:\"width:200px\"'></div></td></tr>\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Sort Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"sortname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter sortname\",uppercase:true' data-dojo-attach-point=\"sortname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"job_title\",type:\"text\",maxlength:80,trim:true,required:false,style:\"width:98%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" width=\"100px\" >Country</td><td><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"address1\",type:\"text\",size:40,required:false,style:\"width:90%\",trim:true'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"address2\",type:\"text\",size:40,maxlength:80,style:\"width:90%\",trim:true'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-props='name:\"townname\",type:\"text\",size:30' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-props='name:\"county\",type:\"text\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Postcode</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"postcode\",type:\"text\",size:20,maxlength:10,style:\"width:10em\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Blog</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<span><input data-dojo-attach-point=\"blog\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"blog\",type:\"text\",maxlength:120,style:\"width:90%\",pattern:dojox.validate.regexp.url,trim:true'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"blog_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\t\t\t\t\t\t\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<span><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"www\",type:\"text\",maxlength:120,style:\"width:90%\",pattern:dojox.validate.regexp.url,trim:true'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"www_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"email\",type:\"text\",size:40,maxlength:80,trim:true,pattern:dojox.validate.regexp.emailAddress, invalidMessage:\"invalid email address\",style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"tel\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"fax\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"mobile\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"twitter\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Media Channel</td><td class=\"prmaxrowdisplay\"><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"prmax_outlettypeid\",readOnly:\"readOnly\", autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select outlet type\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\"  data-dojo-attach-point=\"prmax_outlettypeid\"></select></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Keywords</td><td><div  data-dojo-attach-point=\"interests\" data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-props='name:\"interests\",title:\"\",startopen:true,restrict:0,selectonly:true,keytypeid:6,displaytitle:\"\"'></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Profile</td>\r\n\t\t\t\t\t\t<td><div class=\"dialogprofileframelarge\" ><textarea data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"profile\",style:\"width:99%;height:99%\"' ></textarea></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t\t\t<table style=\"width:100%;border-style:collapsed\">\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_delete\" data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",label:\"Delete\"'></button></td>\r\n\t\t\t\t\t\t<td><label class=\"prmaxrowtag\">Reason Code</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\",style:\"width:120px\"' /></td>\r\n\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"savenode\"  data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",busyLabe:\"Please Wait Saving...\",label:\"Update\"' data-dojo-attach-event=\"onClick:_save\"></button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"outlet_audit_ctrl\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='objecttypeid:4,style:\"width:100%;height:100%\",title:\"Freelance Activity\" '></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_research_ctrl\" data-dojo-type=\"research/ResearchDetails\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Research\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Freelance\"'>\r\n\t\t<div data-dojo-attach-point=\"delete_ctrl\" data-dojo-type=\"research/freelance/FreelanceDelete\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/freelance/FreelanceEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",	
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
	"dijit/form/NumberTextBox",
	"research/audit/AuditViewer",
	"research/ResearchDetails",
	"research/freelance/FreelanceDelete",
	"prcommon2/web/WebButton",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, ItemFileReadStore, lang, topic, domattr ){
 return declare("research.freelance.FreelanceEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._saved_call_back = lang.hitch(this,this._saved);
		this._load_call_back= lang.hitch(this,this._loaded);
		this._deleted_call_back= lang.hitch(this, this._deleted_call);
		this.outletid = -1 ;
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.prmax_outlettypeid.set("value",42);

		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.delete_ctrl.set("dialog", this.delete_dlg);

		this.blog_show.set("source",this.blog);
		this.www_show.set("source",this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.instagram_show.set("source",this.instagram);
		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Updated");
			if (response.data.comm.tel != this.tel.get("value"))
			{
				this.tel.set("value", response.data.comm.tel)
			}
			if (response.data.comm.fax != this.fax.get("value"))
			{
				this.fax.set("value", response.data.comm.fax)
			}
			this._clear_reason();
		}
		else
		{
			alert("Failed to update ");
		}
		this.savenode.cancel();
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		var data = this.requirednode.get("value");
		data['outletid'] = this.outletid;
		request.post('/research/admin/outlets/research_freelance_check',
			utilities2.make_params({ data : data})).
			then(this._deleted_call_back);		
	},
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Freelance '" + response.data.outlet_name + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				data = 	this.requirednode.get("value");
				data["reasoncodeid"] = this.reasoncodeid.get("value");
				data['outletid'] = this.outletid;
				request.post('/research/admin/outlets/freelance_research_update',
					utilities2.make_params( {data:data})).then
					(this._saved_call_back);			
			}
		}
		else
		{
			data = 	this.requirednode.get("value");
			data["reasoncodeid"] = this.reasoncodeid.get("value");
			data['outletid'] = this.outletid;
			request.post('/research/admin/outlets/freelance_research_update',
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
		this.outletid = -1;
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
		this.countryid.set("value",1);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.blog.set("value","");
		this.prmax_outlettypeid.set("value",42);
		this._clear_reason();
	},
	load:function( outletid )
	{
		this.outletid = outletid;
		this._name = "";
		this.outlet_audit_ctrl.load ( this.outletid ) ;

		request.post ('/research/admin/outlets/freelance_get_for_load',
			utilities2.make_params({ data : {outletid: outletid} })).then
			(this._load_call_back);
	},
	_loaded:function( response )
	{
		if  ( response.success == "OK" )
		{
			var data = response.data;

			this._name = data.contact.familyname;

			this.selectcontact.contactid.set("value",data.employee.contactid);
			domattr.set(this.selectcontact.contactid.display, "innerHTML", data.contactname);
			this.sortname.set("value",data.outlet.sortname);
			this.job_title.set("value",data.employee.job_title);
			this.outletid = data.outlet.outletid;
			this.address1.set("value",data.address.address1);
			this.address2.set("value",data.address.address2);
			this.townname.set("value",data.address.townname);
			this.county.set("value",data.address.county);
			this.postcode.set("value",data.address.postcode);
			this.www.set("value", data.outlet.www);
			this.email.set("value",data.comm.email);
			this.tel.set("value",data.comm.tel);
			this.fax.set("value",data.comm.fax);
			this.mobile.set("value",data.comm.mobile);
			this.interests.set("value",data.interests);
			this.profile.set("value",data.profile);
			this.countryid.set("value",data.outlet.countryid);
			this.twitter.set("value",data.comm.twitter);
			this.facebook.set("value",data.comm.facebook);
			this.linkedin.set("value",data.comm.linkedin);
			this.instagram.set("value",data.comm.instagram);
			this.blog.set("value",data.comm.blog);
			this.prmax_outlettypeid.set("value",data.outlet.prmax_outlettypeid);


			this._clear_reason();
			this.outlet_research_ctrl.load( data.outlet.outletid,19 );
		}
		else
		{
			alert("Problem Loading freelancer");
		}
	},
	_delete:function()
	{
		this.delete_ctrl.load ( this.outletid ,this._name);
		this.delete_dlg.show();
	}
});
});
