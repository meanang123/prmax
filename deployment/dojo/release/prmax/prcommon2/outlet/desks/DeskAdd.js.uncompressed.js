require({cache:{
'url:prcommon2/outlet/desks/templates/DeskAdd.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-attach-point=\"desk_details\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Desk Details\",\"class\":\"scrollpanel\"'>\r\n\t\t\t<form data-dojo-props='onsubmit:\"return false\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<input data-dojo-props='name:\"outletid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"outletid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t\t\t<input data-dojo-props='name:\"outletdeskid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"outletdeskid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"97%\">\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"100px\">Desk name</td><td colspan=\"2\" ><input data-dojo-props='\"class\":\"prmaxinput\",name:\"deskname\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Desk Name\"'  data-dojo-attach-point=\"deskname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"email\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:98%\",maxlength:70'></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",size:25,maxlength:40' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td><td><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td><td><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td><td><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td><td><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Different Address</td><td><input data-dojo-props='name:\"has_address\",type:\"checkbox\"' data-dojo-attach-point=\"has_address\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_address_show\" /></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"addr1\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"addr2\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"addr3\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"addr4\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"addr5\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"desk_research_details\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Research Details Required\",\"class\":\"scrollpanel\"'>\r\n\t\t\t<form data-dojo-props='onsubmit:\"return false\"' data-dojo-attach-point=\"form1\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"97%\">\r\n\t\t\t\t\t<tr ><td width=\"180px\"></td><td></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowdisplaylarge\" colspan=\"2\">Required&nbsp;<input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"research_required\" data-dojo-props='type:\"checkbox\",name:\"research_required\",checked:\"checked\"' data-dojo-attach-event=\"onClick:_change_view\" ></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_1\"><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td><input data-dojo-attach-point=\"research_surname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"research_surname\",type:\"text\",trim:false,required:false,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_2\"><td align=\"right\" class=\"prmaxrowtag\">Firstname</td><td><input data-dojo-attach-point=\"research_firstname\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"research_firstname\",type:\"text\",style:\"width:40%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_3\"><td align=\"right\" class=\"prmaxrowtag\">Title</td><td><input data-dojo-attach-point=\"research_prefix\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"research_prefix\",type:\"text\",style:\"width:20%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_4\"><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"research_job_title\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"research_job_title\",type:\"text\",style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_5\"><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"research_email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"research_email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70'></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_6\"><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"research_tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"research_tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_7\"><td align=\"right\" class=\"prmaxrowtag\">Frequency</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"researchfrequencyid\" data-dojo-props='style:\"width:70%\",\"class\":\"prmaxrequired\",name:\"researchfrequencyid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select research frequency\",labelType:\"html\"' data-dojo-attach-event=\"onChange:_show_months_check\"></select></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"quest_month_2_label_1\"><td align=\"right\" class=\"prmaxrowtag\">Month 1</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"quest_month_1\" data-dojo-props='name:\"quest_month_1\",autoComplete:true,searchAttr:\"name\",required:true,labelType:\"html\"'></select></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"quest_month_2_label_2\"><td align=\"right\" class=\"prmaxrowtag\">Month 2</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"quest_month_2\" data-dojo-props='name:\"quest_month_2\",autoComplete:true,searchAttr:\"name\",required:true,labelType:\"html\"'></select></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"quest_month_2_label_3\"><td align=\"right\" class=\"prmaxrowtag\">Month 3</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"quest_month_3\" data-dojo-props='name:\"quest_month_3\",autoComplete:true,searchAttr:\"name\",required:true,labelType:\"html\"'></select></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"quest_month_2_label_4\"><td align=\"right\" class=\"prmaxrowtag\">Month 4</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"quest_month_4\" data-dojo-props='name:\"quest_month_4\",autoComplete:true,searchAttr:\"name\",required:true,labelType:\"html\"'></select></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_8\"><td align=\"right\" class=\"prmaxrowtag\">Last Questionaire Sent</td><td><input data-dojo-props='\"class\":\"prmaxbutton\",type:\"text\",name:\"last_questionaire_sent\"' data-dojo-attach-point=\"last_questionaire_sent\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_9\"><td align=\"right\" class=\"prmaxrowtag\">Last Researched Completed</td><td><input data-dojo-props='\"class\":\"prmaxbutton\",type:\"text\",name:\"last_research_completed\"' data-dojo-attach-point=\"last_research_completed\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_10\"><td align=\"right\" class=\"prmaxrowtag\">Last Changed</td><td><p data-dojo-attach-point=\"last_research_changed_date\" ></p></td></tr>\r\n\t\t\t\t\t<tr data-dojo-attach-point=\"research_required_11\"><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Notes</td><td><div class=\"stdframe\" style=\"height:300px\"><textarea data-dojo-attach-point=\"notes\"  data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"notes\",style:\"height:300px\"'></textarea></div></td></tr>\r\n\t\t\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:40px\",region:\"bottom\"'>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"99%\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td width=\"33%\" align=\"left\" data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t\t<td width=\"33%\" align=\"left\"  data-dojo-attach-point=\"delete_button\" class=\"prmaxhidden\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"' data-dojo-attach-event=\"onClick:_delete\"></button></td>\r\n\t\t\t\t<td width=\"33%\" align=\"right\"><button data-dojo-attach-event=\"onClick:_add_dates\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    DeskAdd
// Author:  Chris Hoy
// Purpose:
// Created: 04/02/2013
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/outlet/desks/DeskAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../desks/templates/DeskAdd.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/topic",
	"dojo/data/ItemFileReadStore",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, request, utilities2, json, lang, domclass, domattr, topic, ItemFileReadStore){
 return declare("prcommon2.outlet.desks.DeskAdd",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._dialog = null;
		this._required_old = null;
		this._required_new = null;
		this._has_address_old = null;
		this._has_address_new = null;

		this._months = new ItemFileReadStore({url:"/common/lookups?searchtype=months&ignore=1"});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.researchfrequencyid.set("store",PRCOMMON.utils.stores.Research_Frequencies());

		for(var count=1; count <5 ; ++count)
		{
			this["quest_month_" + count].set("store",this._months);
			this["quest_month_" + count].set("value",-1);
		}
	},
	_add_dates:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		var data = lang.mixin(this.form.get("value"), this.form1.get("value"));

		data["last_research_completed"] = utilities2.to_json_date(this.last_research_completed.get("value"));
		data["last_questionaire_sent"] = utilities2.to_json_date(this.last_questionaire_sent.get("value"));

		if (this.mode == "add")
		{
			if ( confirm("Add Desk?"))
			{
				request.post('/research/admin/desks/add',
					utilities2.make_params({ data : data })).
					then(this._add_call_back);
			}
			else
			{
				this.savenode.cancel();
				throw "N";
			}
		}
		else
		{
			if ( confirm("Update Desk?"))
			{
				data["required_old"] = this._required_old;
				data["required_new"] = this._required_new;
				data["has_address_old"] = this._has_address_old;
				if (this._has_address_new != null)
				{
					data["has_address_new"] = this._has_address_new;
				}
				else
				{
					data["has_address_new"] = this._has_address_old;
				}

				request.post('/research/admin/desks/update',
					utilities2.make_params({ data : data })).
					then(this._update_call_back);
			}
			else
			{
				this.savenode.cancel();
				throw "N";
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Desk Added");
			this.clear();
			if (this._dialog)
				this._dialog("hide");
			topic.publish(PRCOMMON.Events.Desk_Added, response.data);
			this._has_address_old = this._has_address_new;
			this._required_old = this._required_new;
		}
		else if ( response.success == "DU")
		{
			alert("Desk Already Exists");
			this.deskname.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	_update_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Desk Updated");
			topic.publish(PRCOMMON.Events.Desk_Updated, response.data);
			this._has_address_old = this._has_address_new;
			this._required_old = this._required_new;
			if (this._has_address_new == false)
			{
				this._clear_address();	
			}
		}
		else if ( response.success == "DU")
		{
			alert("Desk Already Exists");
			this.deskname.focus();
		}
		else
		{
				alert("Failed");
		}
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
	clear:function()
	{
		this.deskname.set("value","");
		this.outletdeskid.set("value",-1);
		this.email.set("value", "");
		this.tel.set("value", "");
		this.fax.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.linkedin.set("value", "");
		this.instagram.set("value", "");
		this.research_surname.set("value","");
		this.research_firstname.set("value","");
		this.research_prefix.set("value","");
		this.research_job_title.set("value","");
		this.research_email.set("value","");
		this.research_tel.set("value","");
		this.research_required.set("checked",true);
		this.researchfrequencyid.set("value",4);
		this.has_address.set("checked", false );
		//this._has_address_new = false;
		//this._address_show_do(false);
		this._clear_address();
//		this.address1.set("value", "");
//		this.address2.set("value", "");
//		this.townname.set("value", "");
//		this.county.set("value", "");
//		this.postcode.set("value","");

		this.notes.set("value", "" );
		this.last_questionaire_sent.set("value",null);
		this.last_research_completed.set("value", null);
		domattr.set(this.last_research_changed_date,"innerHTML", "");

		this._change_view();
		this._show_months();
		this.savenode.cancel();

		domclass.add(this.delete_button,"prmaxhidden");

	},
	focus:function()
	{
		this.deskname.focus();
	},
	_setDialogAttr:function (dialog)
	{
		this._dialog = dialog;
	},
	_setOutletidAttr:function ( outletid )
	{
		this.outletid.set("value", outletid);
	},
	load:function( outletdeskid )
	{
		this.savenode.cancel();
		domclass.add(this.delete_button,"prmaxhidden");

		request.post('/research/admin/desks/get',
				utilities2.make_params({ data : {outletdeskid:outletdeskid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			var tmp_research_required = false;
			
			this.outletdeskid.set("value", response.data.outletdesk.outletdeskid);
			this.deskname.set("value", response.data.outletdesk.deskname);
			if (response.data.outletdeskcomms)
			{
				this.email.set("value", response.data.outletdeskcomms.email);
				this.tel.set("value", response.data.outletdeskcomms.tel);
				this.fax.set("value", response.data.outletdeskcomms.fax);
				this.twitter.set("value", response.data.outletdeskcomms.twitter);
				this.facebook.set("value", response.data.outletdeskcomms.facebook);
				this.linkedin.set("value", response.data.outletdeskcomms.linkedin);
				this.instagram.set("value", response.data.outletdeskcomms.instagram);
			}
			else
			{
				this.email.set("value", "");
				this.tel.set("value", "");
				this.fax.set("value", "");
				this.twitter.set("value", "");
				this.facebook.set("value", "");
				this.linkedin.set("value", "");
				this.instagram.set("value", "");
			}
			if (response.data.deskaddress != null )
			{
				this.has_address.set("checked", true );
				this._has_address_old = true;
				this._address_show_do(true);
				this.address1.set("value", response.data.deskaddress.address1);
				this.address2.set("value", response.data.deskaddress.address2);
				this.townname.set("value", response.data.deskaddress.townname);
				this.county.set("value", response.data.deskaddress.county);
				this.postcode.set("value",response.data.deskaddress.postcode);
			}
			else
			{
				this.has_address.set("checked", false );
				this._has_address_old = false;
				this._address_show_do(false);
				this.address1.set("value", "");
				this.address2.set("value", "");
				this.townname.set("value", "");
				this.county.set("value", "");
				this.postcode.set("value","");


			}
			if (response.data.researchoutletdesk)
			{
				this.research_required.set("checked",true);
				this._required_old = true;
				tmp_research_required = true;
				this.research_surname.set("value", response.data.researchoutletdesk.surname);
				this.research_firstname.set("value", response.data.researchoutletdesk.firstname);
				this.research_prefix.set("value", response.data.researchoutletdesk.prefix);
				this.research_job_title.set("value", response.data.researchoutletdesk.job_title);
				this.research_email.set("value", response.data.researchoutletdesk.email);
				this.research_tel.set("value", response.data.researchoutletdesk.tel);

				this.researchfrequencyid.set("value", response.data.researchoutletdesk.researchfrequencyid==null?4: response.data.researchoutletdesk.researchfrequencyid);
				this.quest_month_1.set("value",response.data.researchoutletdesk.quest_month_1==null?-1:response.data.researchoutletdesk.quest_month_1);
				this.quest_month_2.set("value",response.data.researchoutletdesk.quest_month_2==null?-1:response.data.researchoutletdesk.quest_month_2);
				this.quest_month_3.set("value",response.data.researchoutletdesk.quest_month_3==null?-1:response.data.researchoutletdesk.quest_month_3);
				this.quest_month_4.set("value",response.data.researchoutletdesk.quest_month_4==null?-1:response.data.researchoutletdesk.quest_month_4);
				this.last_questionaire_sent.set("value",utilities2.from_object_date_no_date(response.data.last_questionaire_sent));
				this.last_research_completed.set("value",utilities2.from_object_date_no_date(response.data.last_research_completed));
				domattr.set(this.last_research_changed_date,"innerHTML", response.data.last_research_changed_date);
				this.notes.set("value", response.data.researchoutletdesk.notes);

			}
			else
			{
				this.research_required.set("checked",false);
				this._required_old = false;
				this.research_surname.set("value", "");
				this.research_firstname.set("value", "");
				this.research_prefix.set("value", "");
				this.research_job_title.set("value", "");
				this.research_email.set("value", "");
				this.research_tel.set("value", "");
				this.researchfrequencyid.set("value", 4 );
				this.quest_month_1.set("value",-1);
				this.quest_month_2.set("value",-1);
				this.quest_month_3.set("value",-1);
				this.quest_month_4.set("value",-1);
				this.last_questionaire_sent.set("value",null);
				this.last_research_completed.set("value",null);
				domattr.set(this.last_research_changed_date,"innerHTML", "");
				this.notes.set("value", "");
			}

			domclass.remove(this.delete_button,"prmaxhidden");
			domclass.add(this.close_button,"prmaxhidden");
			this._change_view();
			this._show_months(tmp_research_required);
			this._dialog("show");
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog("hide");
	},
	_delete:function()
	{
		if ( confirm("Delete Desk"))
		{
			request.post('/research/admin/desks/delete',
					utilities2.make_params({ data : {outletdeskid : this.outletdeskid.get("value")}})).
					then(this._delete_call_back);
		}
	},
	_delete_call:function( response)
	{
		if (response.success=="OK")
		{
			alert("Desk Deleted");
			if (this._dialog)
				this._dialog("hide");
			topic.publish(PRCOMMON.Events.Desk_Deleted, this.outletdeskid.get("value"));
		}
		else
		{
				alert("Failed");
		}
	},
	_change_view:function()
	{
		var domcommand = domclass.add;

		if (this.research_required.get("checked"))
			{
				domcommand = domclass.remove;
				this._required_new = true;
			}
		else
			{
				this._required_new = false;
			}

		for (var count = 1; count < 12; ++count)
			domcommand(this["research_required_" + count],"prmaxhidden");

		for (var count=1; count <5 ; ++count)
		{
			domcommand(this["quest_month_2_label_" + count] ,"prmaxhidden");
		}

		this._show_months(this.research_required.get("checked"));

		var outletdeskid = this.outletdeskid.get("value");
		if (outletdeskid == "-1" || outletdeskid == null)
		{
			for (var count = 8; count < 11; ++count)
				domclass.add(this["research_required_" + count],"prmaxhidden");
		}
	},
	_show_months_check:function()
	{
		this._show_months(this.research_required.get("checked"));
	},
	_show_months:function(research_required)
	{
		var tmp = this.researchfrequencyid.get("value");
		var field1 = dojo.addClass;
		var field2 = dojo.addClass;
		var field3 = dojo.addClass;
		var field4 = dojo.addClass;
		var field1value=-1;
		var field2value=-1;
		var field3value=-1;
		var field4value=-1;

		if (research_required==false)
			tmp = "1";

		switch (tmp)
		{
		case "1":
			// 0
			break;
		case "5":
			// 1
			field1=dojo.removeClass;
			field1value=null;
			break;
		case "8":
			// 1,2
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field1value=null;
			field2value=null;
			break;
		case "7":
			// 1,2,3
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field3=dojo.removeClass;
			field1value=null;
			field2value=null;
			field3value=null;
			break;
		default:
			// 1,2,3,4
			field1=dojo.removeClass;
			field2=dojo.removeClass;
			field3=dojo.removeClass;
			field4=dojo.removeClass;
			field1value=null;
			field2value=null;
			field3value=null;
			field4value=null;
			break;
		}

		field1(this.quest_month_2_label_1,"prmaxhidden");
		field2(this.quest_month_2_label_2,"prmaxhidden");
		field3(this.quest_month_2_label_3,"prmaxhidden");
		field4(this.quest_month_2_label_4,"prmaxhidden");
		if (field1value==-1)
			this.quest_month_1.set("value",-1);
		if (field2value==-1)
			this.quest_month_2.set("value",-1);
		if (field3value==-1)
			this.quest_month_3.set("value",-1);
		if (field4value==-1)
			this.quest_month_4.set("value",-1);

	},
	_address_show:function()
	{
		this._address_show_do ( this.has_address.get("checked") ) ;
		if (this.has_address.get('checked'))
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
	}
});
});
