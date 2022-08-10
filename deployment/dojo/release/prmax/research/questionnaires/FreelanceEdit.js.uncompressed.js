require({cache:{
'url:research/questionnaires/templates/FreelanceEdit.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-attach-point=\"outlet_container\" data-dojo-props='region:\"center\"' >\r\n\t\t<div title=\"Freelance Details\"  data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false' data-dojo-attach-point=\"freelance_details_view\">\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%padding-left:5px\",\"class\":\"scrollpanel\",region:\"center\"'>\r\n\t\t\t\t<form  data-dojo-data='\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"requirednode\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t<input data-dojo-attach-point=\"researchprojectitemid\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"'/>\r\n\t\t\t\t\t<table style=\"width:98%\" class=\"prmaxtable\" cellspacing=\"0\" cellpadding=\"0\" >\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Contact</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<table style=\"width:99%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" width=\"50px\" >Prefix</td><td></td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"prmaxrowtag\" width=\"120px\" >First</td><td></td>\r\n\t\t\t\t\t\t\t\t\t\t\t<td class=\"prmaxrowtag\">Surname</td><td></td>\r\n\t\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-props='type:\"text\",trim:true,style:\"width: 2em\",\"class\":\"prmaxinput\",name:\"prefix\"' data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" ></input></td><td align=\"left\" width=\"30px\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"prefix_modified\"></div></td>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-props= '\"class\":\"prmaxinput\",name:\"firstname\",style:\"width: 5em;\",type:\"text\",trim:true' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td><td align=\"left\" width=\"30px\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"firstname_modified\"></div></td>\r\n\t\t\t\t\t\t\t\t\t\t<td><input data-dojo-attach-point=\"familyname\" data-dojo-props='name:\"familyname\", type:\"text\", trim:true, required:\"true\",style:\"width: 18em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td><td align=\"left\" width=\"30px\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"familyname_modified\"></div></td>\r\n\t\t\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t\t</table>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"job_title\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:98%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Sort Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"sortname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter sortname\",uppercase:true' data-dojo-attach-point=\"sortname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" width=\"100px\" >Country</td><td><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td><td width=\"50px\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"countryid_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"address1\",type:\"text\",size:40,required:false,style:\"width:90%\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address1_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"address2\",type:\"text\",size:40,maxlength:80,style:\"width:90%\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address2_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-props='name:\"townname\",type:\"text\",size:30' data-dojo-type=\"dijit/form/TextBox\"/><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"townname_modified\"></div></td></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-props='name:\"county\",type:\"text\"' data-dojo-type=\"dijit/form/TextBox\"/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"county_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Postcode</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"postcode\",type:\"text\",size:20,maxlength:10,style:\"width:10em\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"postcode_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Blog</td><td><input data-dojo-attach-point=\"blog\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"blog\",type:\"text\",maxlength:120,style:\"width:90%\",pattern:dojox.validate.regexp.url,trim:true'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"blog_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td><td><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"www\",type:\"text\",maxlength:120,style:\"width:90%\",pattern:dojox.validate.regexp.url,trim:true'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"www_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"email\",type:\"text\",size:40,maxlength:80,trim:true,pattern:dojox.validate.regexp.emailAddress, invalidMessage:\"invalid email address\",style:\"width:90%\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"email_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"tel\",type:\"text\",size:25,maxlength:40' /></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"tel_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"fax\",type:\"text\",size:25,maxlength:40' /></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"fax_modified\"></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='name:\"mobile\",type:\"text\",size:25,maxlength:40' /></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"mobile_modified\"></div></td></tr>\r\n\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"twitter\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"twitter_modified\"></div></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"facebook_modified\"></div></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"linkedin_modified\"></div></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"instagram_modified\"></div></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Writes About</td><td class=\"prmaxrowemphasise\" data-dojo-attach-point=\"interests_user\"></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Keywords</td><td><div  data-dojo-attach-point=\"interests\" data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-props='name:\"interests\",title:\"\",startopen:true,restrict:0,selectonly:true,keytypeid:6,displaytitle:\"\"'></div></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\"  valign=\"top\" class=\"prmaxrowtag\">Profile</td>\r\n\t\t\t\t\t\t<td><div class=\"dialogprofileframelarge\" ><textarea data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"editorialprofile\",style:\"width:99%;height:99%\"' ></textarea></div></td><td valign=\"top\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"editorialprofile_modified\"></div></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t\t\t<table style=\"width:100%;border-style:collapsed\">\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_delete\" data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",label:\"Delete\"'></button></td>\r\n\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"savenode\"  data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",type:\"button\",busyLabe:\"Please Wait Saving...\",label:\"Update\"' data-dojo-attach-event=\"onClick:_save\"></button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"outlet_audit_ctrl\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='objecttypeid:4,style:\"width:100%;height:100%\",title:\"Freelance Activity\" '></div>\r\n\t\t<div data-dojo-attach-point=\"outlet_research_ctrl\" data-dojo-type=\"research/ResearchDetails\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Research\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Freelance\"'>\r\n\t\t<div data-dojo-attach-point=\"delete_ctrl\" data-dojo-type=\"research/freelance/FreelanceDelete\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.freelance.FreelanceNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/02/2010
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/questionnaires/FreelanceEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/FreelanceEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/dom-attr",
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
	"dijit/form/NumberTextBox",
	"research/audit/AuditViewer",
	"research/ResearchDetails",
	"research/freelance/FreelanceDelete",
	"research/questionnaires/UserModified",
	"prcommon2/web/WebButton"	
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, domattr, ItemFileReadStore, lang, topic){
 return declare("research.questionnaires.FreelanceEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._saved_call_back = lang.hitch(this,this._saved);
		this._load_call_back= lang.hitch(this,this._loaded);
	},
	postCreate:function()
	{
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());
		this.delete_ctrl.set("dialog", this.delete_dlg);

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
		}
		else
		{
			alert("Failed to update ");
		}
		this.savenode.cancel();
	},
	_reset_fields:function()
	{
		this.address1_modified.clear();
		this.address2_modified.clear();
		this.townname_modified.clear();
		this.county_modified.clear();
		this.postcode_modified.clear();
		this.blog_modified.clear();
		this.www_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.mobile_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.instagram_modified.clear();
		this.editorialprofile_modified.clear();
		this.prefix_modified.clear();
		this.firstname_modified.clear();
		this.familyname_modified.clear();
		this.blog_modified.clear();
		this.countryid_modified.clear();

	},
	_save:function()
	{
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/projects/user_feed_accept_freelance' ,
					utilities2.make_params({ data: this.requirednode.get("value") })).then
					(this._saved_call_back);
	},
	new_freelance:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.researchprojectitemid.set("value",-1);
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
		this.sortname.set("value","");
		domattr.set(this.interests_user,"innerHTML", "");
		this.familyname.set("value","");
		this.firstname.set("value","");
		this.prefix.set("value","");

	},
	load:function( researchprojectitemid )
	{
		this.researchprojectitemid.set("value", researchprojectitemid);

		request.post ('/research/admin/projects/load_user_feedback',
			utilities2.make_params({ data : {researchprojectitemid: researchprojectitemid} })).then
			(this._load_call_back);
	},
	_loaded:function( response )
	{
		this.savenode.cancel();

		if  ( response.success == "OK" )
		{
			var data = response.data;

			this._reset_fields();

			this._name = data.primary.contact.familyname;

			this.familyname.set("value",data.primary.contact.familyname);
			this.firstname.set("value",data.primary.contact.firstname);
			this.prefix.set("value",data.primary.contact.prefix);

			this.job_title.set("value",data.primary.employee.job_title);
			this.sortname.set("value",data.outlet.outlet.sortname);
			this.address1.set("value",data.outlet.address.address1);
			this.address2.set("value",data.outlet.address.address2);
			this.townname.set("value",data.outlet.address.townname);
			this.county.set("value",data.outlet.address.county);
			this.postcode.set("value",data.outlet.address.postcode);
			this.www.set("value", data.outlet.outlet.www);
			this.email.set("value",data.outlet.communications.email);
			this.tel.set("value",data.outlet.communications.tel);
			this.fax.set("value",data.outlet.communications.fax);
			this.mobile.set("value",data.outlet.communications.mobile);
			this.interests.set("value",data.primary.interests);
			if (data.outlet.profile.profile)
				this.editorialprofile.set("value",data.outlet.profile.profile.editorialprofile);
			else
				this.editorialprofile.set("value", data.outlet.outlet.profile);

			this.countryid.set("value",data.outlet.outlet.countryid);
			this.twitter.set("value",data.outlet.communications.twitter);
			this.facebook.set("value",data.outlet.communications.facebook);
			this.linkedin.set("value",data.outlet.communications.linkedin);
			this.instagram.set("value",data.outlet.communications.instagram);
			this.blog.set("value",data.outlet.communications.blog);

			this.outlet_research_ctrl.load( data.outlet.outlet.outletid,19 );
			this.outlet_audit_ctrl.load ( data.outlet.outlet.outletid ) ;

			domattr.set(this.interests_user,"innerHTML", "");

			for (var key in data.user_changes)
			{
				var  change_record = data.user_changes[key]

				switch (change_record.fieldid)
				{
					case 3 : // profile
						var editorialprofile  = "";

						if (data.outlet.profile.profile)
							editorialprofile = data.outlet.profile.profile.editorialprofile;

						this.editorialprofile_modified.load(change_record.value, editorialprofile, this.editorialprofile);
						break;
					case 4 : // email
						this.email_modified.load(change_record.value, data.outlet.communications.email, this.email);
						break;
					case 5: // tel
						this.tel_modified.load(change_record.value, data.outlet.communications.tel, this.tel);
						break;
					case 6: //fax
						this.fax_modified.load(change_record.value, data.outlet.communications.fax, this.fax);
						break;
					case 7: //mobile
						this.mobile_modified.load(change_record.value, data.outlet.communications.mobile, this.mobile);
						break;
					case 8: // interests
						domattr.set(this.interests_user,"innerHTML",change_record.value);
						break;
					case 12: // address 1
						this.address1_modified.load(change_record.value, data.outlet.address.address1, this.address1);
						break;
					case 13: // address 2
						this.address2_modified.load(change_record.value, data.outlet.address.address2, this.address2);
						break;
					case 14: // townname
						this.townname_modified.load(change_record.value, data.outlet.address.townname, this.townname);
						break;
					case 15: // county
						this.county_modified.load(change_record.value, data.outlet.address.county, this.county);
						break;
					case 16: // post code
						this.postcode_modified.load(change_record.value, data.outlet.address.postcode, this.postcode);
						break;
					case 17: // www
						this.www_modified.load(change_record.value, data.outlet.outlet.www, this.www);
						break;
					case 50: // blog
						this.blog_modified.load(change_record.value, data.outlet.communications.blog, this.blog);
						break;
					case 25: // twitter
						this.twitter_modified.load(change_record.value, data.outlet.communications.twitter, this.twitter);
						break;
					case 26: // facebook
						this.facebook_modified.load(change_record.value, data.outlet.communications.facebook, this.facebook);
						break;
					case 27: // Country Id
						this.countryid_modified.load(change_record.value, data.outlet.outlet.countryid, this.countryid);
						break;
					case 28: // linkedin
						this.linkedin_modified.load(change_record.value, data.outlet.communications.linkedin, this.linkedin);
						break;
					case 72: // instagram
						this.instagram_modified.load(change_record.value, data.outlet.communications.instagram, this.instagram);
						break;
					case 21: //prefix
						this.prefix_modified.load(change_record.value, data.primary.contact.prefix, this.prefix);
						break;
					case 22: //firstname
						this.firstname_modified.load(change_record.value, data.primary.contact.firstname, this.firstname);
						break;
					case 23: //fmailyname
						this.familyname_modified.load(change_record.value, data.primary.contact.familyname, this.familyname);
						break;
				}
			}
		}
		else
		{
			alert("Problem Loading freelancer");
		}
	},
	_delete:function()
	{
		this.delete_ctrl.load ( this._outletid ,this._name);
		this.delete_dlg.show();
	}
});
});
