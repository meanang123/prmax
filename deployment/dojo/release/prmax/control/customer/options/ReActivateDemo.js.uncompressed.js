require({cache:{
'url:control/customer/options/templates/ReActivateDemo.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"icustomerid\"' data-dojo-attach-point=\"icustomerid\" data-dojo-type=\"dijit/form/TextBox\" ></input>\r\n\t\t<table class=\"prmaxtable\" width=\"500px\"  border=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Email Address</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",size:\"40\",maxlength:\"80\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:\"40\"' data-dojo-attach-point=\"email\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Contact Name</td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"displayname\",type:\"text\",size:\"80\",maxlength:\"80\",trim:true,required:true' data-dojo-attach-point=\"displayname\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >End Date</td><td><input data-dojo-props='type:\"text\",required:true,name:\"licence_expire\",style:\"width:8em\"' data-dojo-attach-point=\"licence_expire\" data-dojo-type=\"dijit/form/DateTextBox\"><td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Send Email</td><td><input data-dojo-attach-point=\"sendemail\" data-dojo-props='value:\"true\",name:\"sendemail\",type:\"checkBox\"' data-dojo-type=\"dijit.form.CheckBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Assigned To</td><td><select data-dojo-props='\"class\":\"prmaxrequired\",required:true,name:\"assigntoid\",autoComplete:true,style:\"width:15em\",labelType:\"html\"' data-dojo-attach-point=\"assigntoid\"  data-dojo-type=\"dijit/form/FilteringSelect\" ></select></td></td></tr>\r\n\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan =\"2\">&nbsp;</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-point=\"updBtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busyLabel:\"Please Wait Updating...\",label:\"Re-Activate\",\"class\":\"prmaxbutton\"' data-dojo-attach-event=\"onClick:_Update\" ></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n"}});
define("control/customer/options/ReActivateDemo", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../options/templates/ReActivateDemo.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/ProgressBar",
	"dijit/form/FilteringSelect",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/NumberTextBox",
	"dojox/form/BusyButton",
	"dijit/form/CheckBox",
	"dijit/form/SimpleTextarea"],
	function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, utilities2, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

return declare("control.customer.options.ReActivateDemo",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._UpdatedCallBack = lang.hitch(this,this._UpdatedCall);
		this._LoadedCallBack = lang.hitch(this, this._LoadedCall);
		this._userfilter = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales"});
	},
	postCreate:function()
	{
		this.assigntoid.set("store", this._userfilter ) ;
	},
	Load:function( customerid, dialog )
	{
		this.updBtn.set("disabled", true ) ;
		this.icustomerid.set("value", customerid);
		this._dialog = dialog;
		
		request.post ('/customer/get_internal',
			utilities2.make_params({ data : {icustomerid : customerid }})).then
			(this._LoadedCallBack);
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			var td = new Date();
			var t = new Date(td.getTime()  + 4*24*60*60*1000);
			this.licence_expire.set("value", t);
			this.email.set("value", response.data.cust.email ) ;
			this.displayname.set("value", response.data.cust.displayname );
			this.sendemail.set("checked", true ) ;
			this.updBtn.set("disabled", false ) ;
			this._dialog.show();
			this.updBtn.cancel();
		}
		else
		{
			alert("Problem Loading Expire Details");
		}
	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			if (this ._dialog)
				this._dialog.hide();
		}
		else
		{
			if ( response.message)
				alert( response.message ) ;
			else
				alert("Problem Upating");
		}
		this.updBtn.cancel();
	},
	_Update:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Missing Data");
			this.updBtn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["licence_expire"] = utilities2.to_json_date ( this.licence_expire.get("value"));

		request.post ('/customer/get_internal',
			utilities2.make_params({ data : content})).then
			(this._UpdatedCallBack);
	}
});
});
