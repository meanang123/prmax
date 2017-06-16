dojo.provide("prmax.customer.Preferences");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.Countries");

dojo.declare("prmax.customer.Preferences",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		parentid:"",
		templatePath: dojo.moduleUrl( "prmax.customer","templates/Preferences.html"),
	constructor: function()
	{
		this._SavePasswordSaveCall = dojo.hitch(this,this._SavePasswordSave);
		this._SaveGeneralSaveCall = dojo.hitch(this,this._SaveGeneralSave);
		this._LoadCallBack = dojo.hitch(this,this._Load);
		this._SaveItfCall = dojo.hitch(this,this._SaveItf);
		this.store = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=sortorder"});
		this._extended_security = false;

	},
	postCreate:function()
	{

		this.inherited(arguments);
		this.stdview_sortorder.store = this.store;
		this.Load();

	},
	_has_lower_case:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (c == c.toLowerCase())
			{
				return true;			
			}
			i++;
		}
		return false;
	},
	_has_upper_case:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (c == c.toUpperCase())
			{
				return true;			
			}
			i++;
		}
		return false;
	},
	_has_number:function(str)
	{
		var i = 0;
		while (i <= str.length )
		{
			c = str.charAt(i);
			if (parseInt(c))
			{
				return true;			
			}
			i++;
		}
		return false;
	},
	_SavePasswordButton:function()
	{
		if (ttl.utilities.formValidator( this.userpasswordform ) == false )
		{
			alert("Invalid Password");
			this.pssw_update.cancel();
			return false;
		}	
		var password = this.pssw.value;
		if (this._extended_security == true)
		{
			if (password.length < 8 || this._has_lower_case(password) == false || this._has_upper_case(password) == false || this._has_number(password) == false)
			{
				alert("Please enter a valid password: minimum length 8 characters, at least one character upper case, one character lower case and one digit");	
				this.pssw_update.cancel();
				return;
			}
		}
//		var pssw_cnfrm = this.pssw_cnfrm.get("value");
//
//		if (pssw_name.length==0 || ( pssw_cnfrm!=pssw_name))
//		{
//			alert("Password doesn't match");
//			this.pssw_update.cancel();
//			return;
//		}
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SavePasswordSaveCall,
				url:'/user/preferences_password_update',
				content:{
						pssw_name:password,
						pssw_cnfrm:password}
		}));
	},
	_SavePasswordSave:function(response)
	{
		if ( response.success == "OK" )
			alert("Password Changed");
		else
			alert("Problem saving password");
		this.pssw_update.cancel();
	},
	Load:function()
	{
		dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:'/user/preferences_get'})	);
	},
	_Load:function(response)
	{
//		console.log(response);
		
		this._extended_security = response.data.control.extended_security;

		this.username.set("value",response.data.user.user_name);
		this.displayname.set("value",response.data.user.display_name);
		this.email.set("value",response.data.user.email_address);
		this.autoselectfirstrecord.set("value",response.data.user.autoselectfirstrecord);
		this.interface_font_size.set("value", response.data.user.interface_font_size);
		this.usepartialmatch.set("checked", response.data.user.usepartialmatch);
		this.searchappend.set("checked", response.data.user.searchappend);
		this.emailreplyaddress.set("value", response.data.user.emailreplyaddress);
		this.stdview_sortorder.set("value", response.data.user.stdview_sortorder);
		this.user_countries.set("value", response.data.countries ) ;
		this.client_name.set("value",response.data.user.client_name);
		this.issue_description.set("value",response.data.user.issue_description);

		this.general_update.set("disabled",false);
		this.pssw_update.set("disabled",false);
		this.interface_upd.set("disabled",false);
		
		this.preferences_view.selectChild(this.general);
	},
	Clear:function()
	{
		this.general_update.cancel();
		this.pssw_update.cancel();
		this.interface_upd.cancel();
	},
	_SaveGeneral:function()
	{
		if ( ttl.utilities.formValidator(this.generalForm)==false)
		{
			alert("Not all required field filled in");
			this.general_update.cancel();
			return;
		}

		dojo.xhrPost(
		ttl.utilities.makeParams({
			load: this._SaveGeneralSaveCall,
			url:'/user/preferences_general_update',
			content: this.generalForm.get("value")
			}));
	},
	_SaveGeneralSave:function( response)
	{
		if (response.success=="OK")
		{
			PRMAX.utils.settings.autoselectfirstrecord = this.autoselectfirstrecord.get("value");
			PRMAX.utils.settings.usepartialmatch = this.usepartialmatch.get("checked");
			PRMAX.utils.settings.searchappend = this.searchappend.get("checked");
			PRMAX.utils.settings.emailreplyaddress = this.emailreplyaddress.get("value");
			PRMAX.utils.settings.stdview_sortorder = this.stdview_sortorder.get("value");
			PRMAX.utils.settings.client_name = this.client_name.get("value");
			PRMAX.utils.settings.issue_description=this.issue_description.get("value");

			alert("Settings Saved");
		}
		else
			alert("Problem saving settings");

		this.general_update.cancel();
	},
	_SaveInterface:function()
	{
		var value = this.interface_font_size.get('value') ;
		if ( value == null || value == undefined || value== "")
		{
			alert("Invalid Font Size");
			this.interface_font_size.focus();
			this.interface_upd.cancel();
			return ;
		}
		dojo.xhrPost(
		ttl.utilities.makeParams({
			load: this._SaveItfCall,
			url:'/user/preferences_itf_update',
			content: {	interface_font_size:value}
			}));
	},
	_SaveItf:function(response)
	{
		if (response.success=="OK")
		{
			alert("Interface Settings Saved, Interface will now reload");
			this.Clear();
			window.location.reload( true );
		}
		else
		{
			alert("Problem saving interface settings");
		}
	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["preferences"]);
	}
});
