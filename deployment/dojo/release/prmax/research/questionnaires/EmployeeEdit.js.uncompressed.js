require({cache:{
'url:research/questionnaires/templates/EmployeeEdit.html':"<div>\r\n\t<form data-dojo-attach-point=\"formnode\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"prmaxdefault\"' >\r\n\t\t<input data-dojo-attach-point=\"employeeidnode\" data-dojo-props='type:\"hidden\",name:\"employeeid\"' data-dojo-type=\"dijit/form/TextBox\"></input>\r\n\t\t<input data-dojo-attach-point=\"researchprojectitemid\" data-dojo-props='name:\"researchprojectitemid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\"></input>\r\n\t\t<input data-dojo-attach-point=\"researchprojectitemchangeid\" data-dojo-props='name:\"researchprojectitemchangeid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\"></input>\r\n\t\t<table style=\"width:97%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t\r\n\t\t\t<tr><td width=\"15%\" class=\"prmaxrowtag\" valign=\"top\"align=\"right\">Person</td><td><div data-dojo-props='\"class\":\"prmaxrequired\"' data-dojo-type=\"research/employees/EmployeeSelect\" data-dojo-attach-point=\"selectcontact\"></div><div data-dojo-attach-point=\"contact_name_display\" style=\"color:red;font-weight:bold\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"job_title\",type:\"text\",maxlength:80,trim:true,required:false,style:\"width:98%\"'/></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"job_title_modified\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Job Roles</td><td><div data-dojo-attach-point=\"jobroles\" data-dojo-type=\"prcommon2/roles/Roles\" data-dojo-props='name:\"jobroles\",value:\"\",startopen:true, size:6, searchmode:true, selectonly:true' ></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Desk</td><td><select data-dojo-attach-point=\"outletdeskid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"outletdeskid\",searchAttr:\"deskname\",labelType:\"html\",\"class\":\"prmaxrequired\"' /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"email\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:98%\",maxlength:70'></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"email_modified\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",size:25,maxlength:40' data-dojo-type=\"dijit/form/TextBox\"/></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"tel_modified\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",size:25,maxlength:40' /></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"fax_modified\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"mobile\",type:\"text\",size:25,maxlength:40' data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/TextBox\"/></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"mobile_modified\"></div></td></tr>\r\n\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"twitter_modified\"></div></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"facebook_modified\"></div></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"linkedin_modified\"></div></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t</td>\r\n\t\t\t\t<td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"instagram_modified\"></div></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Different Address</td><td><input data-dojo-props='name:\"no_address\",type:\"checkbox\"' data-dojo-attach-point=\"no_address\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_address_show\" /></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"addr1\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:90%\"'></input></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address1_modified\"></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"addr2\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:90%\"'></input></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address2_modified\"></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"addr3\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"townname_modified\"></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"addr4\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"county_modified\"></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"addr5\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"postcode_modified\"></div></td></tr>\r\n\t\t\t<tr><td></td><td data-dojo-attach-point=\"copy_keywords_btn\" align=\"left\" class=\"prmaxrowtag\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Copy Keywords from Outlet\"' data-dojo-attach-event=\"onClick:_copy_keywords_btn\"></button></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" >Writes About:</td><td class=\"prmaxrowemphasise\" data-dojo-attach-point=\"interests\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" >Keywords:</td><td><div data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests_org\" data-dojo-props='displaytitle:\"\",restrict:0,size:6,name:\"interests\",startopen:true,selectonly:true,nofilter:true,keytypeid:1,interesttypeid:1' ></div></td><td width=\"5%\"><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"interests_modified\"></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Profile</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"profile\",style:\"width:99%;height:99%\"' ></textarea></div></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\" align=\"right\"><button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving ...\" label=\"Save\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.questionnaires.EmployeeEdit
// Author:  Chris Hoy
// Purpose:
// Created: 19/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/questionnaires/EmployeeEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../questionnaires/templates/EmployeeEdit.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/validate",
	"research/employees/EmployeeSelect",
	"prcommon2/roles/Roles",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass){
 return declare("research.questionnaires.EmployeeEdit",
	[BaseWidgetAMD,ContentPane],{
	templateString:template,
	prmaxcontext:"outlet",
	constructor: function()
	{
		this._saved_call = lang.hitch(this,this._saved);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._copy_interests_call = lang.hitch(this, this._copy_interests);
		this._desklist = null;
		this._count_desks = 0;		
		this._has_address_old = null;
		this._has_address_new = null;
		this._series_parent = false;
		this.outletid = -1;
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this.employeeidnode.get("value")==-1)
			{
				topic.publish(PRCOMMON.Events.Employee_Quest_Add, "A" + response.objectid);
				alert("Contact added. Please verify the 'Research tab' to make sure these changes haven't effected it");
			}
			else
			{
				try
				{
					topic.publish(PRCOMMON.Events.Employee_Quest_Updated, "E" + this.employeeid, response.data, this.prmaxcontext);
				}
				catch(e)
				{
					alert(e);
				}
				alert("Contact updated. Please verify the 'Research tab' to make sure these changes haven't effected it");
			}
			
			if (response.data.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}	
			
			this._has_address_old = this._has_address_new;
			if (this._has_address_new == false)
			{
				this._clear_address();	
			}		
			if (response.data.tel != this.tel.get("value"))
			{
				this.tel.set("value", response.data.tel);
			}
			if (response.data.fax != this.fax.get("value"))
			{
				this.fax.set("value", response.data.fax);
			}
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.savenode.cancel();
	},
	postCreate:function()
	{
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);		
		this.instagram_show.set("source",this.instagram);		
		this.inherited(arguments);
	},
	_reset_fields:function()
	{
		this.job_title_modified.clear();
		this.mobile_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.instagram_modified.clear();
	},
	load:function( data, user_changes, outletdesks )
	{
		this._reset_fields();
		this.employeeid = -1;
		if (outletdesks)
		{
			this._count_desks = outletdesks.length;
		}

		if ( data.employeeid)
		{
			this.employeeid = data.employee.employeeid;
			this.outletid = data.outlet.outletid;
			this.employeeidnode.set("value",data.employee.employeeid);
			this.researchprojectitemid.set("value", data.researchprojectitemid);
			this.researchprojectitemchangeid.set("value",data.researchprojectitemchangeid);
			this.job_title.set("value", data.employee.job_title);
			this.email.set("value", data.comm.email);
			this.tel.set("value", data.comm.tel);
			this.fax.set("value", data.comm.fax);
			this.twitter.set("value", data.comm.twitter);
			this.facebook.set("value", data.comm.facebook);
			this.linkedin.set("value", data.comm.linkedin);
			this.instagram.set("value", data.comm.instagram);
			this.mobile.set("value", data.comm.mobile);
			this.interests_org.set("value", data.interests);
			domattr.set(this.interests,"innerHTML"," ");
			this.profile.set("value", data.employee.profile);
			this.jobroles.set("value", data.jobroles);
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+ data.employee.outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
			this.outletdeskid.set("value", (data.employee.outletdeskid == null)? -1 : data.employee.outletdeskid);
			domclass.remove(this.copy_keywords_btn, "prmaxhidden");
			
			if (data.contact_name_display != undefined)
				domattr.set(this.contact_name_display,"innerHTML", data.contact_name_display);
			else
				domattr.set(this.contact_name_display,"innerHTML", "");

			if (data.employee.contactid==null)
			{
				this.selectcontact.set_no_contact();
			}
			else
			{
				this.selectcontact.set("checked",false);
				this.selectcontact.contactid.set("value",data.employee.contactid);
				domattr.set(this.selectcontact.contactid.display, "innerHTML", data.contactname);				
			}
			if (data.employee.communicationid == null )
			{
				this.no_address.set("checked", false );
				this._has_address_old = false;
				this._address_show_do(false);
			}
			else
			{
				if (data.address != null )
				{
					this.no_address.set("checked", true );
					this._has_address_old = true;
					this._address_show_do(true);
					this.address1.set("value", data.address.address1);
					this.address2.set("value", data.address.address2);
					this.townname.set("value", data.address.townname);
					this.county.set("value", data.address.county);
					this.postcode.set("value",data.address.postcode);
				}
				else
				{
					this.no_address.set("checked", false );
					this._has_address_old = false;
					this._clear_address();
				}
			}
			for (var key in user_changes)
			{
				var  change_record = user_changes[key]

				switch (change_record.fieldid)
				{
					case 2: // job_title
						this.job_title_modified.load(change_record.value, data.employee.job_title, this.job_title);
						break;
					case 7: // mobile
						this.mobile_modified.load(change_record.value, data.comm.mobile, this.mobile);
						break;
					case 4: // email
						this.email_modified.load(change_record.value, data.comm.email, this.email);
						break;
					case 5: // tel
						this.tel_modified.load(change_record.value, data.comm.tel, this.tel);
						break;
					case 6: // fax
						this.fax_modified.load(change_record.value, data.comm.fax, this.fax);
						break;
					case 25: // twitter
						this.twitter_modified.load(change_record.value, data.comm.twitter, this.twitter);
						break;
					case 26: // facebook
						this.facebook_modified.load(change_record.value, data.comm.facebook, this.facebook);
						break;
					case 28: // linkedin
						this.linkedin_modified.load(change_record.value, data.comm.linkedin, this.linkedin);
						break;
					case 72: // instagram
						this.instagram_modified.load(change_record.value, data.comm.instagram, this.instagram);
						break;
					case 12: // address 1
						var address1 = "";
						this.address1_modified.load(change_record.value, data.address == null ? "" :data.address.address1, this.address1);
						break;
					case 13: // address 2
						this.address2_modified.load(change_record.value, data.address == null ? "" : data.address.address2, this.address2);
						break;
					case 14: // townname
						this.townname_modified.load(change_record.value, data.address == null ? "" : data.address.townname, this.townname);
						break;
					case 15: // county
						this.county_modified.load(change_record.value, data.address == null ? "" : data.address.county, this.county);
						break;
					case 16: // post code
						this.postcode_modified.load(change_record.value, data.address == null ? "" : data.address.postcode, this.postcode);
						break;
					case 8: // interests
						domattr.set(this.interests,"innerHTML",change_record.value);
						break;
					case 49: // has address flag
						this.no_address.set("checked", change_record.value );
						this._address_show_do( change_record.value );
						break;

				}
			}
		}
		else
		{
			this.employeeidnode.set("value", -1);
			this.outletid = data.outletid;
			this.researchprojectitemid.set("value", data.researchprojectitemid);
			this.researchprojectitemchangeid.set("value",data.researchprojectitemchangeid);
			this.job_title.set("value", data.job_title);
			this.email.set("value", data.email);
			this.tel.set("value", data.tel);
			this.fax.set("value", data.fax);
			this.twitter.set("value", data.twitter);
			this.facebook.set("value", data.facebook);
			this.linkedin.set("value", data.linkedin);
			this.instagram.set("value", data.instagram);
			this.mobile.set("value", data.mobile);
			this.profile.set("value", "");
			this.jobroles.set("value", null);
			this.selectcontact.set_no_contact();
			this.no_address.set("checked", data.alt_address );
			this._address_show_do(data.alt_address);
			this.address1.set("value", data.address1);
			this.address2.set("value", data.address2);
			this.townname.set("value", data.townname);
			this.county.set("value", data.county);
			this.postcode.set("value", data.postcode);
			domattr.set(this.interests,"innerHTML", data.interests);
			this.interests_org.set("value", null );
			if (data.contact_name_display != undefined)
				domattr.set(this.contact_name_display,"innerHTML", data.contact_name_display);
			else
				domattr.set(this.contact_name_display,"innerHTML", "");
			this.selectcontact.set("checked",false);
			this.selectcontact.set("value",null);
			domattr.set(this.selectcontact.contactid.display, "innerHTML", "Select Contact");
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+ data.outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
			this.outletdeskid.set("value", (data.outletdeskid == null)? -1 : data.outletdeskid);
			domclass.add(this.copy_keywords_btn, "prmaxhidden");
		}
		this.savenode.cancel();
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		
		if (this._count_desks != 0 && (this.outletdeskid.get("value") == '-1' || this.outletdeskid.get("value") == -1))
		{
			alert('Please enter Desk');
			this.savenode.cancel();
			throw "N";
		}
		
		var formdata = this.formnode.get("value");
		formdata["has_address_old"] = this._has_address_old;
		formdata['outletid'] = this.outletid;
		if (this._has_address_new != null)
		{
			formdata["has_address_new"] = this._has_address_new;
		}
		else 
		{
			formdata["has_address_new"] = this._has_address_old;
		}
		url = (this.employeeid == -1 ) ? '/research/admin/projects/new_employee' :  '/research/admin/projects/update_employee' ;
		request.post(url,utilities2.make_params({ data : formdata})).then
			(this._saved_call, this._error_call_back);
	},
	clear:function()
	{
		this.employeeidnode.set("value",-1);
		this.selectcontact.clear();
		this.job_title.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.profile.set("value","");
		this.selectcontact.clear();
		this.reason.set("value","");
		this.no_address.set("checked", false);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.outletdeskid.set("value",-1);
		this.interests_org.set("");
		this._clear_address();
		domattr.set(this.interests,"innerHTML","");
		this.jobroles.clear();
	},
	_address_show:function()
	{
		this._address_show_do ( this.no_address.get("checked") ) ;
		if (this.no_address.get('checked'))
		{
			this._has_address_old = false;
			this._has_address_new = true;
		}
		else
		{
			this._has_address_old = true;
			this._has_address_new = false;	
		}		
	},
	_address_show_do:function ( show_it )
	{
		var _HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				domclass.add(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				domclass.remove(this[_HidFields[key]], "prmaxhidden");
		}
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_clear_address:function()
	{
		this._address_show_do(false);
		this.address1.set("value", "");
		this.address2.set("value", "");
		this.townname.set("value", "");
		this.county.set("value", "");
		this.postcode.set("value","");	
	},	
	_copy_keywords_btn:function()
	{
		//reasoncodeid = 8 --> Prmax Research
		request.post('/research/admin/employees/research_copy_interests_outlet_to_employee',
				utilities2.make_params({data:{employeeid:this.employeeid, outletid:this.outletid, reasoncodeid:8}})).then
				(this._copy_interests_call);
	},	
	_copy_interests:function(response)
	{
		if (response.success == 'OK')
		{
			this.interests_org.set("value", response.data.interests);
		}
	},	
});
});
