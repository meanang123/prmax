require({cache:{
'url:prcommon2/circulation/templates/CirculationSourcesAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"circulationsourceid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"circulationsourceid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Circulation Source</td><td ><input data-dojo-props='\"class\":\"prmaxinput\",name:\"circulationsourcedescription\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Circulation Source Name\"'  data-dojo-attach-point=\"circulationsourcedescription\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t<tr><td data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td><td colspan=\"3\" align=\"right\"><button data-dojo-attach-event=\"onClick:_add_publisher\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    CirculationSourcesAdd
// Author:  Chris Hoy
// Purpose:
// Created: 08/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/circulation/CirculationSourcesAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../circulation/templates/CirculationSourcesAdd.html",
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
 return declare("prcommon2.circulation.CirculationSourcesAdd",
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
			if ( confirm("Add Circulation Sources?"))
			{
				request.post('/research/admin/circulationsources/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Circulation Sources?"))
			{
				request.post('/research/admin/circulationsources/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Circulation Source Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Circulation_Sources_Added, response.data);
		}
		else if ( response.success == "DU")
		{
			alert("Circulation Sources Already Exists");
			this.circulationsourcedescription.focus();
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
			alert("Circulation Source Updated");
			topic.publish(PRCOMMON.Events.Circulation_Sources_Update, response.data);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Circulation Sources Already Exists");
			this.circulationsourcedescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.circulationsourcedescription.set("value","");
		this.circulationsourceid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.circulationsourcedescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( circulationsourceid)
	{
		this.clear();

		request.post('/research/admin/circulationsources/get',
				utilities2.make_params({ data : {circulationsourceid:circulationsourceid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.circulationsourcedescription.set("value", response.data.circulationsourcedescription);
			this.circulationsourceid.set("value", response.data.circulationsourceid);
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
