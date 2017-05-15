//-----------------------------------------------------------------------------
// Name:    prmax.collateral.add.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.collateral.add");

dojo.require("ttl.BaseWidget");


dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.Button");

dojo.require("prmax.projects.projectselect");

dojo.declare("prmax.collateral.add",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.collateral","templates/add.html"),
		constructor: function()
		{
			this._AddedCallback = dojo.hitch(this,this._Added);

			this._client_data = new dojox.data.QueryReadStore (
			{	url:'/clients/combo?include_no_select',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
			});

			this.inherited(arguments);
		},
		postCreate:function()
		{
			this.dlg = null;
			this.clientid.store = this._client_data;
			this.clientid.set("value",-1);


			if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
			{
				dojo.removeClass(this.collateral_projects.domNode,"prmaxhidden");
			}

			this.inherited(arguments);
		},
		_Clear:function()
		{
			this.collateral_file.value = "";
			this.collateral_name.set("value","");
			this.collateral_code.set("value","");
			this.progressNode.style.display="none";
			this.saveNode.set("disabled",false);
		},
		_Added:function( response )
		{
			this.progressNode.style.display = "none";
			if (response.success=="DU")
			{
				alert("Collateral Code Already Exists");
			}
			else if (response.success=="OK")
			{
				dojo.publish(PRCOMMON.Events.Collateral_Add, [ response.data ] );
				alert("Collateral Added");
				this._Close();
			}
			else if (response.success=="FA")
			{
				alert(response.message);
			}
			else
			{
				alert("Problem Adding Collateral");
			}
		},
		_Add:function()
		{
			// need to make sure both fields are filled in
			if (this.collateral_name.get("value").length == 0 )
			{
				alert("The Name field must be filled in");
				this.collateral_name.focus();
				return ;
			}
			if (this.collateral_code.get("value").length == 0 )
			{
				alert("The Code field must be filled in");
				this.collateral_code.focus();
				return ;
			}
			var collateral_file_value = dojo.attr(this.collateral_file, "value") ;

			if ( collateral_file_value == "" || collateral_file_value == null )
			{
				alert("No Collateral File Specified");
				this.collateral_file.focus();
				return ;
			}

			this.collateral_cache.value = new Date().valueOf();
			this.progressNode.style.display = "block";

			dojo.io.iframe.send(
			{
				url: "/icollateral/collateral_add",
				handleAs:"json",
		        load: this._AddedCallback,
		        form: this.collateral_form
			});
		},
		Clear:function()
		{
			this._Clear();
		},
		_Close:function()
		{
			this.Clear();
			this.dlg.hide();
		},
		showClose:function ( dlg )
		{
			this.dlg = dlg;
			dojo.removeClass( this.clearNode, "prmaxhidden");

		}

	}
);





