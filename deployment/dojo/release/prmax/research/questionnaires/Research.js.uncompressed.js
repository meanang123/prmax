require({cache:{
'url:research/questionnaires/templates/Research.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td width=\"20%\" align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input data-dojo-attach-point=\"surname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"surname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter conatct surname\",style:\"width:70%\"'></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"surname_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Firstname</td><td><input data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"firstname\",type:\"text\",style:\"width:40%\"'></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"firstname_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Title</td><td><input data-dojo-attach-point=\"prefix\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"prefix\",type:\"text\",style:\"width:20%\"'></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"prefix_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"job_title\",type:\"text\",style:\"width:70%\"'></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"job_title_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"email_modified\"></div></td></tr>\r\n<!--\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"tel_modified\"></div></td></tr>\r\n-->\t\t\t\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t\t<label class=\"prmaxrowtag\">Reason Code</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"'></select>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_update_coding\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right\",type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\"'></button>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Coding.js
// Author:   Chris Hoy
// Purpose:
// Created: 04/01/2013
// To do:
//-----------------------------------------------------------------------------
//
define("research/questionnaires/Research", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/Research.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic, lang, utilities2, request , JsonRest, ItemFileReadStore ){
 return declare("research.questionnaires.Research",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
	},
		postCreate:function()
	{
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.inherited(arguments);
	},
	_reset_fields:function()
	{
		this.surname_modified.clear();
		this.firstname_modified.clear();
		this.prefix_modified.clear();
		this.email_modified.clear();
//		this.tel_modified.clear();
		this.job_title_modified.clear();

	},
	load:function( projectitem, research , user_changes )
	{

		this._reset_fields();

		this.surname.set("value", research.surname );
		this.firstname.set("value", research.firstname );
		this.prefix.set("value", research.prefix );
		this.email.set("value", research.email );
//		this.tel.set("value", research.tel );
		this.job_title.set("value", research.job_title )

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 55:
					this.surname_modified.load(change_record.value, research.surname, this.surname);
					break;
				case 56:
					this.firstname_modified.load(change_record.value, research.firstname, this.firstname);
					break;
				case 57:
					this.prefix_modified.load(change_record.value, research.prefix, this.prefix);
					break;
				case 58:
					this.email_modified.load(change_record.value, research.email, this.email);
					break;
//				case 59:
//					this.tel_modified.load(change_record.value, research.tel, this.tel);
//					break;
				case 60:
					this.job_title_modified.load(change_record.value, research.job_title, this.job_title);
					break;
			}
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);
		this.savenode.cancel();

	},
	clear:function()
	{
		this.outletid.set("value", -1);

		this.savenode.cancel();
	},
	_update_coding:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		// add the reason code
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/projects/user_feed_research',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Research Details Updated");
		}
		else
		{
			alert("Problem");
		}
		this.savenode.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}
});
});





