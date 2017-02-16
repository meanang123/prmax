//-----------------------------------------------------------------------------
// Name:    prmax.employee.EmployeeEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.employees.EmployeeEdit");

dojo.require("prmax.employee.EmployeeSelect");
dojo.require("prmax.employee.EmployeeNew");

dojo.declare("prmax.dataadmin.employees.EmployeeEdit",
	[ ttl.BaseWidget ],
	{
	employeeid:-1,
	outletid:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.employees","templates/EmployeeEdit.html"),
	constructor: function() {
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._LoadCall= dojo.hitch(this,this._Load);
		this._InterestOnlyCallBack = dojo.hitch(this, this._InterestOnlyCall);
		this._MediaOnlyCallBack = dojo.hitch(this, this._MediaOnlyCall );

		this.reasoncode_data_add = PRCOMMON.utils.stores.Research_Reason_Add_Codes();
		this.reasoncode_data_upd = PRCOMMON.utils.stores.Research_Reason_Update_Codes();
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this.employeeidNode.get("value")==-1)
			{
				this.employeeidNode.set("value",response.employee.employeeid);
				dojo.publish(PRCOMMON.Events.Employee_Add, [response.employee]);
				alert("Contact added");
				this._Close();
			}
			else
			{
				dojo.publish(PRCOMMON.Events.Employee_Updated, [response.employee]);
				alert("Contact updated");
			}
		}
		else
		{
			alert("Problem with Employee ");
		}

		this.saveNode.cancel();
	},
	postCreate:function()
	{
		dojo.connect(this.formNode,"onSubmit",dojo.hitch(this,this._Save));
		this.inherited(arguments);

	},
	Load:function( employeeid, outletid )
	{
		this.outletid = outletid;
		this.employeeid = employeeid;
		this.outletidNode.set("value",this.outletid);
		this.employeeidNode.set("value",this.employeeid);
		this.reason.set("value","");

		if (this.employeeid!=-1)
		{
			this.reasoncodeid.store = this.reasoncode_data_upd;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadCall,
				url:'/employees/research_get_edit',
				content: {employeeid:this.employeeid}}));
		}
		else
		{
			this.reasoncodeid.store = this.reasoncode_data_add;
			this.Clear();
			this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
			this.saveNode.set('disabled',false);
		}
	},
	_Load:function(response)
	{
		this.employeeidNode.set("value",response.data.employee.employeeid);
		this.job_title.set("value",response.data.employee.job_title);
		this.email.set("value",response.data.comm.email);
		this.tel.set("value",response.data.comm.tel);
		this.fax.set("value",response.data.comm.fax);
		this.twitter.set("value",response.data.comm.twitter);
		this.facebook.set("value",response.data.comm.facebook);
		this.linkedin.set("value",response.data.comm.linkedin);
		this.mobile.set("value",response.data.comm.mobile);
		this.interests.set("value",response.data.interests);
		this.profile.set("value",response.data.employee.profile);
		if (response.data.employee.contactid==null)
		{
			this.selectcontact.setNoContact();
		}
		else
		{
			this.selectcontact.set("checked",false);
			this.selectcontact.set("value",response.data.employee.contactid);
		}
		if (response.data.employee.communicationid == null )
		{
			this.no_address.set("checked", false );
			this._AddressShow_Do(false);
		}
		else
		{
			if (response.data.address != null )
			{
				this.no_address.set("checked", true );
				this._AddressShow_Do(true);
				this.address1.set("value", response.data.address.address1);
				this.address2.set("value", response.data.address.address2);
				this.townname.set("value", response.data.address.townname);
				this.county.set("value", response.data.address.county);
				this.postcode.set("value",response.data.address.postcode);
			}
			else
			{
				this.no_address.set("checked", false );
				this._AddressShow_Do(false);
				this.address1.set("value", "");
				this.address2.set("value", "");
				this.townname.set("value", "");
				this.county.set("value", "");
				this.postcode.set("value","");
			}
		}

		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.saveNode.set('disabled',false);
		this.socialmediabtn.set("disabled", false ) ;
		this.interestupdbtn.set("disabled", false ) ;

		this.job_title.focus();
	},
	_Submit:function()
	{
		this.formNode.submit();
	},
	_Save:function(response)
	{
		if ( ttl.utilities.formValidator(this.formNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		url = (this.employeeid == -1 ) ? '/employees/research_new' :  '/employees/research_update' ;
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url: url,
			content: this.formNode.get("value")}));

	},
	Clear:function()
	{
		this.employeeidNode.set("value",-1);
		this.selectcontact.Clear();
		this.job_title.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.selectcontact.Clear();
		this.reason.set("value","");
		this.no_address.set("checked", false);
		this._AddressShow_Do ( false );
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.socialmediabtn.set("disabled", true ) ;
		this.interestupdbtn.set("disabled", true ) ;
	},
	_Close:function()
	{
		this.Clear();
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["emp_cha"]);
	},
	_AddressShow:function()
	{
		this._AddressShow_Do ( this.no_address.get("checked") ) ;
	},
	_AddressShow_Do:function ( show_it )
	{
		var 	_HidFields = ["addr1","addr2","addr3","addr4","addr5"];

		if ( show_it == false )
		{
			for ( var key in _HidFields )
				dojo.addClass(this[_HidFields[key]], "prmaxhidden");
		}
		else
		{
			for ( var key in _HidFields )
				dojo.removeClass(this[_HidFields[key]], "prmaxhidden");
		}
	},
	resize:function()
	{
		this.frame.resize( arguments[0] ) ;
		this.inherited(arguments);
	},
	_InterestOnlyCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Interest Only Updated");
		}
		else
		{
			alert("Problem Updating Keywords Only");
		}
	},
	_UpdateInterestsOnly:function()
	{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._InterestOnlyCallBack,
				url: "/interests/research_interest_only",
				content: this.formNode.get("value")}));
	},
	_MediaOnlyCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Social Media Only Updated");
		}
		else
		{
			alert("Problem Updating Social Media Only");
		}
	},
	_UpdateMediaOnly:function()
	{
		if ( this.twitter.isValid() == false ||
				this.facebook.isValid() == false ||
				this.linkedin.isValid() == false )
		{
			alert("Invalid Data");
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._MediaOnlyCallBack,
			url: "/employees/research_update_media",
			content: this.formNode.get("value")}));
	}
});
