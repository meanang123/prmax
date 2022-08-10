require({cache:{
'url:research/projects/templates/itemhistoryemail.html':"<div>\r\n\t<div data-dojo-attach-point=\"tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"view_tab\" data-dojo-props='title:\"View\", \"class\":\"scrollpanel\"'>\r\n\t\t\t<form  data-dojo-data='\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" style=\"margin:20px\">\r\n\t\t\t\t<input data-dojo-attach-point=\"researchprojectitememailid\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='type:\"hidden\",name:\"researchprojectitememailid\",value:\"-1\"'/>\r\n\t\t\t\t<span data-dojo-attach-point='emaildetails_view'></span>\t\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"send_tab\" data-dojo-props='title:\"Send\"'>\r\n\t\t\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\", style:\"margin:10px\"'>\r\n\t\t\t\t<table width=\"100%\" class=\"prmaxtable\" >\r\n\r\n<!--\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">From</td><td><input data-dojo-attach-point=\"researchprojectitememailfrom\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",disabled:true, name:\"researchprojectitememailfrom\",type:\"text\",style:\"width:450px\",maxlength:70, value:\"update@prmax.co.uk\"'></td></tr>\r\n-->\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">To</td><td><input data-dojo-attach-point=\"researchprojectitememailto\"  data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"researchprojectitememailto\",type:\"text\",pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:450px\",maxlength:70'></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Subject</td><td><input data-dojo-props='style:\"width:450px\",\"class\":\"prmaxrequired\",name:\"researchprojectitememailsubject\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"researchprojectitememailsubject\" data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" valign=\"top\" align=\"right\">Body</td><td><div style=\"height:350px\" class=\"dialogprofileframelarge\"><textarea data-dojo-attach-point=\"researchprojectitememailbody\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"researchprojectitememailbody\",style:\"width:99%;height:99%\"'></textarea></div></td></tr>\r\n\t\t\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t\t\t<tr><td colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"sendbtn\" data-dojo-attach-event=\"onClick:_send\" data-dojo-props='iconClass:\"fa fa-envelope-o fa-2x\",type:\"button\",busyLabel:\"Please Wait Sending...\",label:\"Send\",\"class\":\"btnright\"'>Send</button></td></tr>\r\n\t\t\t\t\t<tr><td>&nbsp;</td></tr>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    itemhistoryemail.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Oct 2019
//
// To do: 
//
//-----------------------------------------------------------------------------

define("research/projects/itemhistoryemail", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/itemhistoryemail.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",	
	"dojo/data/ItemFileWriteStore",	
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"research/projects/researchers"
	],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable){
//	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable){

return declare("research.projects.itemhistoryemail",
//	[BaseWidgetAMD, BorderContainer],{
	[BaseWidgetAMD, ContentPane],{
	templateString:template,
	constructor: function()
	{
		this._send_call_back = lang.hitch(this, this._send_call);
		this._researchprojectitemid = null;
		this._researchprojectitemhistoryid = null;

//		this._users = new ItemFileReadStore({url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});
	},
	postCreate:function()
	{
//		this.iuserid.set("store",this._users);
//		this.iuserid.set("value",-1);
	
		this.inherited(arguments);
	},
	load:function(dialog, data)
	{
		this._dialog = dialog;
		if (data.exist == true)
		{
			this.send_tab.controlButton.set('disabled', true);
//			this.send_tab.set('disabled', true);
//			this.view_tab.set('disabled', false);
			this.tabcont.selectChild(this.view_tab);
			var from = '<b>From: </b>' + data.researchprojectitememailfrom;
			var to = '<b>To: </b>' + data.researchprojectitememailto;
			var date = '<b>Date: </b>' + data.researchprojectitememaildate;
			var subject = '<b>Subject: </b>' + data.researchprojectitememailsubject;
			var body = '<br>' + data.researchprojectitememailbody;
			var text = '<br>' + from + '<br>' + to  + '<br>' + date + '<br>' + subject + '<br>' + body
			//this.emaildetails_view.set("value", text);
			domattr.set(this.emaildetails_view, 'innerHTML', text);
			
			this._researchprojectitemid = data.researchprojectitemid;
			this._researchprojectitemhistoryid = data.researchprojectitemhistoryid;
			this.researchprojectitememailto.set("value", data.researchprojectitememailto);
		}
		else
		{	
			this.view_tab.controlButton.set('disabled', true);
			this.tabcont.selectChild(this.send_tab);
			this._researchprojectitemid = data.researchprojectitemid;
			this._researchprojectitemhistoryid = data.researchprojectitemhistoryid;
//			this.researchprojectitememailto.set("value", 'stamatia.vatsi@prmax.co.uk');
			this.researchprojectitememailto.set("value", data.researchprojectitememailto);
		}
	},
	_Close:function ( )
	{
		this._dialog.Clear();
		this._dialog.hide();
	},	
	_send:function()
	{

		var data = this.form.get("value");
		data['researchprojectitemid'] = this._researchprojectitemid;
		data['researchprojectitemhistoryid'] = this._researchprojectitemhistoryid;
		data['researchprojectitememailsubject'] = this.researchprojectitememailsubject.get("value") + ' [Ref:'+ this._researchprojectitemid+']'
		

		request.post('/research/admin/projects/projectitememail/projectitememail_send',
			utilities2.make_params({ data: data })).then
			(this._send_call_back);	
	
	},
	_send_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Email has been sent successfully.")
			this.sendbtn.cancel();
			this._dialog.hide();
		}
		else
		{
			alert("Problem sending reply");
		}
		this.sendbtn.cancel();
	},
	_close_dlg:function()
	{
		this._dialog.Clear();
		this._dialog.hide();	
	}
});
});

