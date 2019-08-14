//-----------------------------------------------------------------------------
// Name:    advance.js
// Author:  Chris Hoy
// Purpose: Add/Edit an advance features
// Created: 05/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.advance");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.date.DateExtended");

dojo.declare("prcommon.advance.advance",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/advance.html"),
	constructor: function()
	{
		this.inherited(arguments);
		this._SaveCallBack = dojo.hitch(this,this._SaveCall ) ;
		this._LoadCallBack = dojo.hitch(this,this._LoadCall ) ;
	},
	postCreate:function()
	{
//		this.reasoncodeid.store = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
//		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);

		this.modelemployees = new dojox.data.QueryReadStore (
				{url:'/employees/listcombo?extended=1&nocontact=1',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});
		this.employeeid.store = this.modelemployees;

		this.inherited(arguments);
	},
	_SaveCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			if ( this.advancefeatureid.get("value") == -1 )
			{
				dojo.publish(PRCOMMON.Events.Feature_Added, [ response.data ] );
				alert("Feature Added");
				this.Clear();
			}
			else
			{
				dojo.publish(PRCOMMON.Events.Feature_Update, [ response.data ] );
				alert("Feature Updated");
			}
		}
		else
		{
			alert("Problem with Feature");
		}

		this.saveNode.cancel();
	},
	_Save:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._SaveCallBack,
				url:"/advance/save" ,
				content: this.form.get("value")
			}));
	},
	Load:function( advancefeatureid, outletid )
	{
		this.modelemployees.url= '/employees/listcombo?extended=1&nocontact=1&outletid=' + outletid ;

		if ( advancefeatureid != -1 )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadCallBack,
					url:"/advance/get_ext" ,
					content: {advancefeatureid:advancefeatureid}
			}));
		}
		else
		{
			this.Clear();
			this.advancefeatureid.set("value",-1);
			this.outletid.set("value", outletid);
		}
	},
	_LoadCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.outletid.set("value", response.data.advance.outletid );
			this.advancefeatureid.set("value", response.data.advance.advancefeatureid ) ;
			this.editorial_date.set("value", response.data.advance.editorial_date_full );
			this.cover_date.set("value", response.data.advance.cover_date_full );
			this.publication_date.set("value", response.data.advance.publication_date_full );
			this.feature.set("value", response.data.advance.feature ) ;
			this.featuredescription.set("value", response.data.advance.featuredescription);
//			this.interests.set("value", response.data.interests);
			if ( response.data.advance.employeeid != null )

				this.employeeid.set("value", response.data.advance.employeeid ) ;
			else
				this.employeeid.set("value", -1 ) ;

			dojo.removeClass(this.domNode, "prmaxhidden");
		}
		else
		{
			this.advancefeatureid.set("value",-1);
			alert("Problem Loading Feature");
		}
	},
	Clear:function()
	{
		this.advancefeatureid.set("value",-1);
		this.editorial_date.set("value",null);
		this.cover_date.set("value",null);
		this.publication_date.set("value",null);
		this.feature.set("value","");
		this.featuredescription.set("value","");
//		this.interests.set("value","");
//		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.reason.set("value","");
		this.employeeid.set("value", -1 ) ;
	},
	newmode:function()
	{
		dojo.removeClass(this.domNode , "prmaxhidden");
	},
	resize:function()
	{
		this.frame.resize( arguments[0] ) ;
		this.inherited(arguments);
	}

});