require({cache:{
'url:research/employees/templates/EmployeeEdit.html':"<div>\r\n\t<div data-dojo-attach-point=\"data_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form data-dojo-attach-point=\"formnode\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onSubmit:\"return false\",\"class\":\"prmaxdefault\"' >\r\n\t\t\t<input data-dojo-attach-point=\"employeeidnode\" data-dojo-props='name:\"employeeid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\"></input>\r\n\t\t\t<table style=\"width:97%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"job_title\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"job_title\",type:\"text\",maxlength:80,trim:true,required:true,style:\"width:98%\"'/></td></tr>\r\n\r\n\t\t\t\t<tr><td width=\"15%\" class=\"prmaxrowtag\" valign=\"top\"align=\"right\">Person</td><td><div data-dojo-props='\"class\":\"prmaxrequired\"' data-dojo-type=\"research/employees/EmployeeSelect\" data-dojo-attach-point=\"selectcontact\"></div></td></tr>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Job Roles</td><td><div data-dojo-attach-point=\"jobroles\" data-dojo-type=\"prcommon2/roles/Roles\" data-dojo-props='orderbtns:false,name:\"jobroles\",value:\"\",startopen:true, size:6, searchmode:true, selectonly:true' ></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Desk</td><td><select data-dojo-attach-point=\"outletdeskid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"outletdeskid\",searchAttr:\"deskname\",labelType:\"html\",\"class\":\"prmaxrequired\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td ><input data-dojo-attach-point=\"email\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:98%\",maxlength:70'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",size:25,maxlength:40' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",size:25,maxlength:40' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Mobile</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"mobile\",type:\"text\",size:25,maxlength:40' data-dojo-attach-point=\"mobile\" data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Different Address</td><td><input data-dojo-props='name:\"no_address\",type:\"checkbox\"' data-dojo-attach-point=\"no_address\"  data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_address_show\" /></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"addr1\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address1</td><td><input data-dojo-attach-point=\"address1\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address1\",type:\"text\",trim:true,invalidMessage:\"Please enter address\",style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"addr2\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Address2</td><td><input data-dojo-attach-point=\"address2\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='style:\"margin-left:10px\",\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:90%\"'></input></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"addr3\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"addr4\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:90%\"' ></input></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"addr5\" class=\"prmaxhidden\" ><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t<tr><td></td><td data-dojo-attach-point=\"copy_keywords_btn\" align=\"left\" class=\"prmaxrowtag\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Copy Keywords from Outlet\"' data-dojo-attach-event=\"onClick:_copy_keywords_btn\"></button></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\" >Keywords:</td><td><div data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests\" data-dojo-props='displaytitle:\"\",restrict:0,size:6,name:\"interests\",startopen:true,selectonly:true,nofilter:true,keytypeid:1,interesttypeid:1' ></div></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\", style:\"width:100%;height:40px;padding:5px\"' >\r\n\t\t<table width=\"100%\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td data-dojo-attach-point=\"close_button\" class=\"prmaxhidden\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t\t<td data-dojo-attach-point=\"delete_button\" class=\"prmaxhidden\"><button data-dojo-attach-event=\"onClick:_delete_contact\" data-dojo-attach-point=\"deletenode\" data-dojo-type=\"dijit/form/Button\" type=\"button\" label=\"Delete Contact\"></button></td>\r\n\t\t\t\t<td width=\"70%\"><label class=\"prmaxrowtag\">Reason Code</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\"' /></td>\r\n\t\t\t\t<td align=\"right\"><button disabled=\"disabled\" data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving///\" label=\"Save\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/employees/EmployeeEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dijit/layout/ContentPane",
	"dojo/text!../employees/templates/EmployeeEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/window",
	"dijit/form/RadioButton",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dojox/validate",
	"research/employees/EmployeeSelect",
	"prcommon2/roles/Roles",
	"prcommon2/web/WebButton"
	], function(declare, BaseWidgetAMD, ContentPane, template, BorderContainer, request, utilities2, json, lang, topic, JsonRestStore, Observable, domattr ,domclass, win){
 return declare("research.employees.EmployeeEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString:template,
	employeeid:-1,
	outletid:-1,
	gutters:false,
	constructor: function()
	{
		this._saved_call = lang.hitch(this,this._saved);
		this._load_call = lang.hitch(this,this._load);
		this._copy_interests_call = lang.hitch(this, this._copy_interests);
		this._desklist = null;
		this._count_desks = 0;
		this._has_address_old = null;
		this._has_address_new = null;
		this._series_parent = false;

		this.reasoncode_data_add = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncode_data_upd = PRCOMMON.utils.stores.Research_Reason_Update_Codes();

		topic.subscribe(PRCOMMON.Events.Employee_Add, lang.hitch(this,this._employee_add_update_event));
		topic.subscribe(PRCOMMON.Events.Employee_Updated, lang.hitch(this,this._employee_add_update_event));

	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this.employeeidnode.get("value")==-1)
			{
				this.employeeidnode.set("value",response.employee.employeeid);
				topic.publish(PRCOMMON.Events.Employee_Add, response.employee);
				alert("Contact added. Please verify the 'Research tab' to make sure these changes haven't effected it");
				this._close();
			}
			else
			{
				topic.publish(PRCOMMON.Events.Employee_Updated, response.employee);
				alert("Contact updated. Please verify the 'Research tab' to make sure these changes haven't effected it");
			}

			if (response.employee.series == true)
			{
				alert("Series members were affected. Please run employee synchronisation process");
			}

			this._has_address_old = this._has_address_new;
			if (this._has_address_new == false)
			{
				this._clear_address();
			}
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.savenode.cancel();
	},
	_employee_add_update_event:function(employee)
	{
		if (employee.tel != this.tel.get("value"))
		{
			this.tel.set("value", employee.tel)
		}
		if (employee.fax != this.fax.get("value"))
		{
			this.fax.set("value", employee.fax)
		}
	},
	postCreate:function()
	{
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.instagram_show.set("source",this.instagram);
		this.inherited(arguments);
	},
	load:function( employeeid, outletid, sourceid, outletdesks )
	{
		this._sourceid = sourceid;
		this.outletid = outletid;
		this.employeeid = employeeid;
		this.employeeidnode.set("value",this.employeeid);
		this._count_desks = outletdesks.length;
		if (outletid != null )
		{
			this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+ outletid + "/", idProperty:"outletdeskid"});
			this.outletdeskid.set("store",this._desklist);
		}
		if (this.employeeid!=-1)
		{
			domclass.remove(this.copy_keywords_btn, "prmaxhidden");
			this.reasoncodeid.store = this.reasoncode_data_upd;
			request.post('/research/admin/employees/research_get_edit',
				utilities2.make_params({data:{employeeid:this.employeeid}})).then
				(this._load_call);
		}
		else
		{
			domclass.add(this.copy_keywords_btn, "prmaxhidden");
			this.reasoncodeid.store = this.reasoncode_data_add;
			this.clear();
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			this.savenode.set('disabled',false);
			domclass.add(this.delete_button,"prmaxhidden");
		}

		this.selectcontact.set_outletid(outletid);
	},
	_load:function(response)
	{
		this.employeeidnode.set("value", response.data.employee.employeeid);
		this.outletid = response.data.employee.outletid;

		this.job_title.set("value", response.data.employee.job_title);
		this.email.set("value", response.data.comm.email);
		this.tel.set("value", response.data.comm.tel);
		this.fax.set("value", response.data.comm.fax);
		this.twitter.set("value", response.data.comm.twitter);
		this.facebook.set("value", response.data.comm.facebook);
		this.linkedin.set("value", response.data.comm.linkedin);
		this.instagram.set("value", response.data.comm.instagram);
		this.mobile.set("value", response.data.comm.mobile);
		this.interests.set("value", response.data.interests);
		this.jobroles.set("value", response.data.jobroles);

		this._desklist = new JsonRestStore ( {target:'/research/admin/desks/list_outlet_desks/'+response.data.employee.outletid + "/", idProperty:"outletdeskid"});
		this.outletdeskid.set("store",this._desklist);
		this.outletdeskid.set("value", (response.data.employee.outletdeskid == null)? -1 : response.data.employee.outletdeskid);
		//this._count_desks = response.data.outlet.outletdesks;
		this.selectcontact.set_outletid(response.data.employee.outletid);
		if (response.data.employee.contactid==null)
		{
			this.selectcontact.set_no_contact();
		}
		else
		{
			this.selectcontact.set("checked",false);
			this.selectcontact.contactid.set("value",response.data.employee.contactid);
			domattr.set(this.selectcontact.contactid.display, "innerHTML", response.data.contactname);
//			this.contactid.set("value", response.data.employee.contactid);
		}
		if (response.data.employee.communicationid == null )
		{
			this.no_address.set("checked", false );
			this._has_address_old = false;
			this._address_show_do(false);
		}
		else
		{
			if (response.data.address != null )
			{
				this.no_address.set("checked", true );
				this._has_address_old = true;
				this._address_show_do(true);
				this.address1.set("value", response.data.address.address1);
				this.address2.set("value", response.data.address.address2);
				this.townname.set("value", response.data.address.townname);
				this.county.set("value", response.data.address.county);
				this.postcode.set("value",response.data.address.postcode);
			}
			else
			{
				this.no_address.set("checked", false );
				this._has_address_old = false;
				this._clear_address();
			}
		}

		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.savenode.set('disabled',false);

		//cannot delete primary
		if (response.data.isprimary == false)
			domclass.remove(this.delete_button,"prmaxhidden");
		else
			domclass.add(this.delete_button,"prmaxhidden");

		this.job_title.focus();
		win.scrollIntoView(this.selectcontact.domNode);

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

		formdata["reasoncodeid"] = this.reasoncodeid.get("value");
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

		url = (this.employeeid == -1 ) ? '/research/admin/employees/research_new' :  '/research/admin/employees/research_update' ;
		request.post(url,utilities2.make_params({ data : formdata})).then
			(this._saved_call);
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
		this.interests.set("value","");
		this.selectcontact.clear();
		this.no_address.set("checked", false);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.jobroles.clear();
		this.outletdeskid.set("value",-1);
		//this._desklist = null;
		//this._count_desks = 0;
		this._clear_address();
	},
	_close:function()
	{
		this.clear();
		this._dialog.hide();
	},
	_setDialogAttr:function( dialog )
	{
		this._dialog = dialog;
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
	_delete_contact:function()
	{
		topic.publish("/employee/delete_request", this.employeeidnode.get("value"), this._sourceid);
	},
	_copy_keywords_btn:function()
	{
		request.post('/research/admin/employees/research_copy_interests_outlet_to_employee',
				utilities2.make_params({data:{employeeid:this.employeeid, outletid:this.outletid, reasoncodeid:this.reasoncodeid.get('value')}})).then
				(this._copy_interests_call);
	},
	_copy_interests:function(response)
	{
		if (response.success == 'OK')
		{
			this.interests.set("value", response.data.interests);
		}
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
});
});
