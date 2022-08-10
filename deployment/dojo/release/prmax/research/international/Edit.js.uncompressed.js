require({cache:{
'url:research/international/templates/Edit.html':"<div>\r\n\t<div data-dojo-props='region:\"top\",style:\"width:100%;height:30px\",\"class\":\"prmaxrowdisplaytitle\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t<p style=\"color:white;padding:0px;margin:0px;text-align:middle\" data-dojo-attach-point=\"outlet_details_view\"></p>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"tabs\">\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point='details_tab' data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\",title:\"Details\"' >\r\n\t\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t\t<br/>\r\n\t\t\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t\t\t<table width=\"90%\" cellspacing=\"0\" cellpadding=\"0\" data-dojo-attach-point=\"tb\">\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\"  data-dojo-props='style:\"width:20px\"'>Media Channel</td><td class=\"prmaxrowdisplay\"><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"prmax_outlettypeid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select outlet type\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\"  data-dojo-attach-point=\"prmax_outlettypeid\"></select></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t\t<br/><br/>\r\n\t\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\" data-dojo-attach-point=\"tb2\">\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Keywords</td><td><div data-dojo-type=\"prcommon2/interests/Interests\" data-dojo-attach-point=\"interests\" data-dojo-props='name:\"interests\",selectonly:true,size:6,displaytitle:\"\",startopen:true,restrict:0,keytypeid:6,title:\"Select\"'></div></td></tr>\r\n\t\t\t\t\t<tr><td><br/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td>\r\n\t\t\t\t\t\t<td><span><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",disabled:true, name:\"www\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t\t<span><div data-dojo-attach-point=\"www_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">House/Street</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,required:false,style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"outlet_audit\" data-dojo-type=\"research/audit/AuditViewer\" data-dojo-props='title:\"Audit\",objectisbase:true,objecttypeid:1,style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table width=\"99%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_delete\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete Outlet\"'></button></td>\r\n\t\t\t\t<td align=\"right\"><label class=\"prmaxrowtag\">Reason</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\",style:\"width:120px\"'></select></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"updatebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving Outlet...\",label:\"Save\"'></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"outlet_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"outlet_delete_ctrl\" data-dojo-type=\"research/outlets/OutletDelete\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Edit.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/07/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/international/Edit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../international/templates/Edit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-construct",
	"research/audit/AuditViewer",
	"prcommon2/interests/Interests",
	"prcommon2/web/WebButton",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"research/outlets/OutletDelete",
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, ItemFileReadStore,lang,topic, domattr, domclass, domstyle, domConstruct){
 return declare("research.international.Edit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._load_call_back = lang.hitch(this, this._load_call);
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.www_show.set("source", this.www);
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this._outletname = '';
		this._outletid = '';

		this.inherited(arguments);
	},
	load:function( outletid )
	{
		this._outletid = outletid;
		this.outletid.set("value", outletid);
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);

		this.updatebtn.cancel();
		request.post('/research/admin/outlets/research_outlet_edit_get',
			utilities2.make_params({ data : {outletid: outletid}})).
			then ( this._load_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success == "OK")
		{
			with ( response )
			{
				this._outletname = outlet.outlet.outletname;
				this.tabs.selectChild(this.details_tab);
				this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
				var tmp = outlet.outlet.outletid+" - " + outlet.outlet.outletname;
				domattr.set(this.outlet_details_view,"innerHTML",  tmp );
				if (outlet.outlet.sourcetypeid == 7)
				{
					this.www.set("value",outlet.outlet.www);
					this.interests.set("value",outlet.interests ) ;
					this.address1.set("value",outlet.address.address1);
					this.address2.set("value",outlet.address.address2);
					this.townname.set("value",outlet.address.townname);
					this.county.set("value",outlet.address.county);
					this.postcode.set("value",outlet.address.postcode);
					this.email.set("value",outlet.communications.email);
					this.tel.set("value",outlet.communications.tel);
					this.fax.set("value",outlet.communications.fax);

					this.outlet_audit.set('disabled', false);
					this.outlet_audit.load(outlet.outlet.outletid);
					domclass.remove(this.tb2, "prmaxhidden");
				}
				else
				{
					this.outlet_audit.set('disabled', true);
					domclass.add( this.tb2,"prmaxhidden");
				}
			}
		}
		else
		{
			alert("Problem Loading");
		}

	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updatebtn.cancel();
			throw "N";
		}
		var tmp_data = this.form.get("value");
		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");

		request.post('/research/admin/outlets/update_international',
			utilities2.make_params({ data : tmp_data})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
		this.updatebtn.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load(this._outletid, this._outletname , this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	},


});
});


