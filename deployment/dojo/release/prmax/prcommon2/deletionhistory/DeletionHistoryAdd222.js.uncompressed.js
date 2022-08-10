require({cache:{
'url:prcommon2/deletionhistory/templates/DeletionHistoryAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"deletionhistoryid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"deletionhistoryid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Date</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxbutton\",type:\"text\",name:\"deletiondate\"' data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-attach-point=\"deletiondate\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Description</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"deletionhistorydescription\",type:\"text\",trim:true,required:true,style:\"width:90%\"'  data-dojo-attach-point=\"deletionhistorydescription\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Outletname</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"outletname\",type:\"text\",trim:true,style:\"width:90%\"' data-dojo-attach-point=\"outletname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Firstname</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"firstname\",type:\"text\",trim:true,style:\"width:90%\"' data-dojo-attach-point=\"firstname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Surname</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"familyname\",type:\"text\",trim:true,style:\"width:90%\"' data-dojo-attach-point=\"familyname\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Domain</td><td colspan=\"2\"><input data-dojo-props='\"class\":\"prmaxinput\",name:\"domain\",type:\"text\",trim:true,style:\"width:90%\"' data-dojo-attach-point=\"domain\" data-dojo-type=\"dijit/form/TextBox\" ></input></td></tr>\r\n\r\n\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Project</td><td colspan=\"2\"><select data-dojo-attach-point=\"researchprojectid\" data-dojo-props='name:\"researchprojectid\",autoComplete:true,style:\"width:90%\",searchAttr:\"researchprojectname\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\"></select></td></tr>\r\n\r\n\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:90%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Type</td><td ><select data-dojo-attach-point=\"deletionhistorytypeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"deletionhistorytypeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:90%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">User</td><td colspan=\"2\"><select data-dojo-attach-point=\"iuserid\" data-dojo-props='name:\"iuserid\",autoComplete:\"true\",style:\"width:90%\",labelType:\"html\",required:true' data-dojo-type=\"dijit/form/FilteringSelect\"></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-attach-event=\"onClick:_add_deletionhistory\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    WebSourcesAdd
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/deletionhistory/DeletionHistoryAdd222", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../deletionhistory/templates/DeletionHistoryAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic ){
 return declare("prcommon2.deletionhistory.DeletionHistoryAdd",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._dialog = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_add_publisher:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Web Sources?"))
			{
				request.post('/research/admin/websources/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Web Sources?"))
			{
				request.post('/research/admin/websources/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Web Source Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Web_Sources_Added, response.data);
		}
		else if ( response.success == "DU")
		{
			alert("Web Sources Already Exists");
			this.websourcedescription.focus();
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
			alert("Web Source Updated");
			topic.publish(PRCOMMON.Events.Web_Sources_Update, response.data);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Web Sources Already Exists");
			this.websourcedescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.websourcedescription.set("value","");
		this.websourceid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.websourcedescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( websourceid)
	{
		this.clear();

		request.post('/research/admin/websources/get',
				utilities2.make_params({ data : {websourceid:websourceid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.websourcedescription.set("value", response.data.websourcedescription);
			this.websourceid.set("value", response.data.websourceid);
			this._dialog.show();
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog.hide();
	}
});
});
