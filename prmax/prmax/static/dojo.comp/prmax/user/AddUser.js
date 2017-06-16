//-----------------------------------------------------------------------------
// Name:    prmax.freelance.FreelanceEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.user.AddUser");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.user.AddUser",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.user","templates/AddUser.html"),
	constructor: function() {
	},
	postCreate:function()
	{
		// Load the data
		dojo.connect(this.addform,"onSubmit",dojo.hitch(this,this._Add));

		this._SavedCall = dojo.hitch(this , this._Saved ) ;
	},
	_AddUser:function()
	{
		if ( ttl.utilities.formValidator(this.addform)==false)
		{
			alert("Not all required field filled in");
			this.saveAddNode.cancel();
			return;
		}
		var userpassword = this.password.value;
		if (this.extended_security.value == true)
		{
			if (userpassword.length < 8 || this._has_lower_case(userpassword) == false || this._has_upper_case(userpassword) == false || this._has_number(userpassword) == false)
			{
				alert("Please enter a valid password: minimum length 8 characters, at least one character upper case, one character lower case and one digit");	
				this.saveAddNode.cancel();
				return;
			}
		}		
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url:'/user/add',
			content: this.addform.get("value")}));
	},
	_Saved:function( response )
	{
		if ( response.success == "OK" )
		{
			this.saveAddNode.cancel();
			// send out message
			dojo.publish(PRCOMMON.Events.User_Added, [response.data] ) ;
		}
		else
		{
			alert ( response.message ) ;
			this.saveAddNode.cancel();
		}
	},
	_Add:function()
	{
		this.addform.submit();
	},
	Clear:function()
	{
		this.email.set("value","");
		this.displayname.set("value","");
		this.password.set("value","");
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
});
