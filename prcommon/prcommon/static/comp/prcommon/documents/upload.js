////-----------------------------------------------------------------------------
// Name:    prcommon.documents.upload
// Author:
// Purpose:
// Created: Sept 2017
//
// To do:
//
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.documents.upload");

dojo.require("ttl.BaseWidget");


dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.Button");
dojo.require("dojo.io.iframe");

dojo.declare("prcommon.documents.upload",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	sourcename:"response",
	templatePath: dojo.moduleUrl( "prcommon.documents","templates/upload.html"),
	constructor: function()
	{
		this._AddedCallback = dojo.hitch(this,this._Added);
		this.maximum = 100;
		this._current = 1;
		this._OnGetStatusCallBack = dojo.hitch(this,this._GetReportBuildStatus);
		this._OnStatusCallBack = dojo.hitch(this,this._OnStatusCall);
		this._ErrorCallBack = dojo.hitch(this,this._Error);

		this._mswordqueueid = null;
	},
	Load:function ( dialog )
	{
		this._dialog = dialog;
	},
	_Clear:function()
	{
		this.progressNode.style.display="none";
		this._mswordqueueid = -1;
		this._current = 1;
		this.saveNode.set("disabled",false);
		this._dialog.hide();
	},
	_Added:function( response )
	{
		 if (response.success=="OK")
		{
			if ( response.data.statusid == 2 )
			{
				this._mswordqueueid = response.mswordqueueid;
				this._Wait();
			}
			else
			{
				this._mswordqueueid = response.mswordqueueid;
				this._current=2;
				this.downloadProgress.update({ maximum: this.maximum, progress:this._current });
				this._Wait();
			}
		}
		else if (response.success=="FA")
		{
			alert(response.message);
			this._Clear();
		}
		else
		{
			alert("Problem Converting Document");
			this._Clear();
		}
	},
	_Add:function()
	{
		if (this.wordtohtml_file.value.length == 0 )
		{
			this.wordtohtml_file.focus();
			return ;
		}

		var fileName = this.wordtohtml_file.value;
		var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
		if( ext != "doc" && ext != "docx" && ext != "DOC" && ext != "DOCX" &&
		 ext != "txt" && ext != "TXT" && ext != "html" && ext != "htm" && ext != "HTML"
		 && ext != "HTM")
		{
			alert("Upload doc, docx html, html and txt files only");
			this.wordtohtml_file.focus();
			return ;
		}

		this.saveNode.set("disabled",true);
		this.wordtohtml_cache.value = new Date().valueOf();
		this.progressNode.style.display = "block";
		this.downloadProgress.update({ maximum: this.maximum, progress:this._current });

		dojo.io.iframe.send(
		{
			url: "/emails/wordtohtml_add_exclude_images",
			handleAs:"json",
			load: this._AddedCallback,
			form: this.wordtohtml_form,
			error:this._ErrorCallBack
		});

	},
	_Error:function(response, ioArgs)
	{
		alert("Problem Converting Document");
		this._Clear();
	},
	_Wait:function()
	{
		// do interface
		if (this._mswordqueueid == -1)
		{
			this.Stop();
			// do stop
		}
		else
		{
			++this._current;
			if (this._current>this.maximum)
				this._current = 1;
			this.downloadProgress.update({ maximum: this.maximum, progress:this._current });
			setTimeout(this._OnGetStatusCallBack,2000);
		}
	},
	_OnStatusCall:function(response)
	{
		console.log("_OnStatusCall");
		if (response.success=="OK")
		{
			if ( response.data.statusid==0 || response.data.statusid==1)
			{
				this._Wait();
			}
			else
			{
				try
				{
					dojo.publish(PRCOMMON.Events.Word_Html_Data, [{html:response.data.html, sourcename: this.sourcename}]);
				}
				catch ( e )  { }
				alert("Upload Completed");
				this._Clear();
			}
		}
		else
		{
			this.Stop();
		}
	},
	Stop:function()
	{
		this._Clear();
	},
	Clear:function()
	{
		this._Clear();
	},
	_GetReportBuildStatus:function()
	{
		console.log("_GetReportBuildStatus");
		if (this._mswordqueueid != -1 )
		{
			if ( this._current%2==0)
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._OnStatusCallBack,
						url:"/emails/mswordtohtml_status",
						content: {mswordqueueid:this._mswordqueueid}}));
			}
			else
			{
				this._Wait();
			}
		}
	},
	_getSubjectAttr:function( )
	{
		return this.subject.get("value");
	},
	_getDocumentAttr:function( )
	{
		return this.wordtohtml_file.value;
	}
});





