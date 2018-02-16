//-----------------------------------------------------------------------------
// Name:    OutetTypes.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.email.wordtohtml");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.email.wordtohtml",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.email","templates/wordtohtml.html"),
		sourcename: "sendrelease",
		constructor: function()
		{
			this._AddedCallback = dojo.hitch(this,this._Added);
			this.maximum = 100;
			this._current = 1;
			this._OnGetStatusCallBack = dojo.hitch(this,this._GetReportBuildStatus);
			this._OnStatusCallBack = dojo.hitch(this,this._OnStatusCall);
			this._ErrorCallBack = dojo.hitch(this,this._Error);

			this._mswordqueueid = null;

			dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
		},
		Load:function (subject, documentname, emailtemplateid )
		{
			dojo.attr( this.emailtemplateid,"value",emailtemplateid);
			this.subject.set("value", subject);
			try{
				dojo.attr( this.wordtohtml_file,"value",documentname==null?"":documentname);
			}catch(e){}
		},
		_Clear:function()
		{
			this.progressNode.style.display="none";
			this._mswordqueueid = -1;
			this._current = 1;
			this.saveNode.set("disabled",false);
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

			if (this.wordtohtml_file.value.indexOf(",") != -1)
			{
				alert("Please rename the file remove commas");
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
				url: "/emails/wordtohtml_add",
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
					catch ( e )  { alert(e) }
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
		},
		postCreate:function()
		{
			this.inherited(arguments);

			if (PRMAX.utils.settings.has_e_e_s == true)
			{
				this.subject.set("maxLength",255);
			}

			dojo.attr(this.subject_label, 'innerHTML', PRMAX.utils.settings.distribution_description + ' Title/Subject');
			dojo.attr(this.uploadrelease_mgs, 'innerHTML',  'Please enter the Title of your ' + PRMAX.utils.settings.distribution_description + ' (which will become the Subject for the email as seen by Journalists).');
			dojo.attr(this.doc_label, 'innerHTML', PRMAX.utils.settings.distribution_description + ' Document');

		},
		_UpdateDistributionLabelEvent:function()
		{
			dojo.attr(this.subject_label, 'innerHTML', PRMAX.utils.settings.distribution_description + ' Title/Subject');
			dojo.attr(this.uploadrelease_mgs, 'innerHTML',  'Please enter the Title of your ' + PRMAX.utils.settings.distribution_description + ' (which will become the Subject for the email as seen by Journalists).');
			dojo.attr(this.doc_label, 'innerHTML', PRMAX.utils.settings.distribution_description + ' Document');
		}
	}
);





