//-----------------------------------------------------------------------------
// Name:    prcommon.documents.add
// Author:  Chris Hoy
// Purpose:
// Created: 18/09/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.documents.add");

dojo.require("ttl.BaseWidget");


dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.Button");
dojo.require("dojo.io.iframe");

dojo.declare("prcommon.documents.add",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.documents","templates/add.html"),
		constructor: function()
		{
			this._added_call_back = dojo.hitch(this,this._added);
		},
		postCreate:function()
		{
			this.dlg = null;
			this.inherited(arguments);
		},
		_clear:function()
		{
			this.document_file.value = "";
			this.progressnode.style.display="none";
			this.savenode.set("disabled",false);
			this.document_name.set("value","");
		},
		_added:function( response )
		{
			this.progressnode.style.display = "none";
			if (response.success=="OK")
			{
				dojo.publish(PRCOMMON.Events.Document_Add, [ response.data ] );
				alert("Document Added");
				this._close();
			}
			else if (response.success=="FA")
			{
				alert(response.message);
			}
			else
			{
				alert("Problem Adding Document");
			}
		},
		_add:function()
		{
			// need to make sure both fields are filled in
			if (this.document_name.get("value").length == 0 )
			{
				alert("The Name field must be filled in");
				this.collateral_name.focus();
				return ;
			}
			var collateral_file_value = dojo.attr(this.document_file, "value") ;

			if ( collateral_file_value == "" || collateral_file_value == null )
			{
				alert("No Document File Specified");
				this.document_file.focus();
				return ;
			}

			this.document_cache.value = new Date().valueOf();
			this.progressnode.style.display = "block";

			dojo.io.iframe.send(
			{
				url: "/crm/documents/add",
				handleAs:"json",
		        load: this._added_call_back,
		        form: this.document_form
			});
		},
		clear:function()
		{
			this._clear();
		},
		_close:function()
		{
			this.clear();
			this.dlg.hide();
		},
		show_close:function ( dlg )
		{
			this._clear();
			this.dlg = dlg;
			dojo.removeClass( this.closenode, "prmaxhidden");

		}
	}
);
