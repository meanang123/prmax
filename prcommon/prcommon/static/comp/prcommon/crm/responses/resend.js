//-----------------------------------------------------------------------------
// Name:    resend.js
// Author:  
// Purpose:
// Created: Oct 2017
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.responses.resend");

dojo.require("prcommon.clippings.add_server");

dojo.declare("prcommon.crm.responses.resend",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.responses","templates/resend.html"),
	constructor: function()
	{
	
		this._ResendCallback = dojo.hitch ( this, this._ResendCall ) ;
		this._StatementCallBack = dojo.hitch(this, this._StatementCall);
		this._EmailTemplateCallBack = dojo.hitch(this, this._EmailTemplateCall);
	
		this._customerid = PRMAX.utils.settings.cid;
		this.userccaddresses = PRMAX.utils.settings.ccaddresses;
		this._customeremailserver =  new prcommon.data.QueryWriteStore({ url:"/common/lookups?searchtype=customeremailserver"});
		dojo.subscribe('/statement/add',  dojo.hitch(this, this._AddStatementEvent));
		dojo.subscribe('/usersettings/ccaddresses', dojo.hitch(this,this._get_ccaddresses_event));
		dojo.subscribe('customeremailserver/add', dojo.hitch(this, this._add_customeremailserver_event));

		this._statements = new dojox.data.JsonRestStore( {target:"/statement/statement_combo_rest", idAttribute:"id"});
		this._emailtemplates = new dojox.data.JsonRestStore( {target:"/emails/templates_list_rest", idAttribute:"id"});
		
	},
	postCreate:function()
	{
		this.customeremailserverid.set("store", this._customeremailserver);
		this.statementid.set("store", this._statements);		
		this.emailtemplateid.set("store", this._emailtemplates);
		this.statementid.set("value", -1);

		this.inherited(arguments);		
	},
	_resend:function()
	{
		if (this.toemailaddress.get("value") == undefined || this.toemailaddress.get("value") == "")
		{
			alert("Please Enter Details");
			this.toemailaddress.focus();
			return false;
		}	
		
		var content = {};
		content['customeremailserverid'] = this.customeremailserverid.get("value");
		content['toemailaddress'] = this.toemailaddress.get("value");
		content['ccemailaddresses'] = this.ccemailaddresses.get("value");
		
		if ( this.option0.get("checked"))
		{
			content['statementid'] = this.statementid.value;
		}
		if ( this.option1.get("checked"))
		{
			content['emailtemplateid'] = this.emailtemplateid.value;
		}
		
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._ResendCallback,
			url:"/crm/resend",
			content:content}));		
	},
	_ResendCall:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Email has been sent");
		}
		else
		{
			alert("Problem Sending Email");
		}	
	},
	_Clear:function()
	{
	
	},
	Load:function(contactemail)
	{
		this.toemailaddress.set("value", contactemail);	
		this.statementid.set("value", -1);
		this.emailtemplateid.set("value", -1);
		this.ccemailaddresses.set("value", this.userccaddresses);
	},
	_add_server:function()
	{
		this.add_server_dialog.show();
		this.add_server_ctrl.load(this.add_server_dialog, this._customerid);
	},
	_add_customeremailserver_event:function(data)
	{
		var servertype = {};
		servertype.id = data.customeremailserverid;
		servertype.name = data.fromemailaddress;
		this._customeremailserver.newItem(servertype);
		this.customeremailserverid.set("value", data.customeremailserverid);
	},		
	_AddStatement:function()
	{
		this.addstatementctrl.Load(this.add_statement_dlg);
		this.add_statement_dlg.show();
	},	
	_AddStatementEvent:function(statement)
	{
		statement.id = statement.statementid;
		statement.name = statement.statementdescription;
		this._statements.newItem(statement);
		this.statementid.set("value", statement.statementid);		
	},	
	_get_ccaddresses_event:function(data)
	{
		this.userccaddresses = data.control.ccaddresses;
		this.ccemailaddresses.set("value", this.userccaddresses);
	},
	_add_customeremailserver_event:function(data)
	{
		var servertype = {};
		servertype.id = data.customeremailserverid;
		servertype.name = data.fromemailaddress;
		this._customeremailserver.newItem(servertype);
		this.customeremailserverid.set("value", data.customeremailserverid);
	},
	_option_changed:function()	{
		if (this.option0.get("checked"))
		{
			dojo.removeClass(this.statement_label, "prmaxhidden");
			dojo.removeClass(this.statement_node, "prmaxhidden");
			dojo.addClass(this.emailtemplate_label, "prmaxhidden");
			dojo.addClass(this.emailtemplate_node, "prmaxhidden");
			this.emailtemplateid.set("value", -1);
			this.statementid.set("value", -1);
		}
		else if (this.option1.get("checked"))
		{
			dojo.addClass(this.statement_label, "prmaxhidden");
			dojo.addClass(this.statement_node, "prmaxhidden");
			dojo.removeClass(this.emailtemplate_label, "prmaxhidden");
			dojo.removeClass(this.emailtemplate_node, "prmaxhidden");
			this.statementid.set("value", -1);
			this.emailtemplateid.set("value", -1);
		}
	},
	_preview:function()
	{
		if ( this.option0.get("checked"))
		{
			this._show_statement();
		}
		if ( this.option1.get("checked"))
		{
			this._show_emailtemplate();
		}
	},
	_show_statement:function(id)
	{
		var content = {};
		content['statementid'] = this.statementid.get("value");
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._StatementCallBack,
			url:"/statement/statement_get",
			content:content}));	
	},
	_StatementCall:function(response)
	{
		if (response.success == "OK")
		{
			content = "<html>\n\t<head></head>\n\t<body>\n" + response.data.output + "\n\t</body>\n</html>";
			var win = window.open("javascript: ''", "", "status=1,menubar=0,location=0,toolbar=0");
			win.document.open();
			win.document.write(content);
			win.document.close();
		}
	},
	_show_emailtemplate:function(id)
	{
		var content = {};
		content['emailtemplateid'] = this.emailtemplateid.get("value");
	
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._EmailTemplateCallBack,
			url:"/emails/templates_get",
			content:content}));	
	},
	_EmailTemplateCall:function(response)
	{
		if (response.success == "OK")
		{	
			content = "<html>\n\t<head></head>\n\t<body>\n" + response.data.emailtemplatecontent + "\n\t</body>\n</html>";
			var win = window.open("javascript: ''", "", "status=1,menubar=0,location=0,toolbar=0");
			win.document.open();
			win.document.write(content);
			win.document.close();
		}
	},	

});





