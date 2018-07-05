//-----------------------------------------------------------------------------
// Name:    sendrelease.js
// Author:  Chris Hoy
// Purpose:	build and send a press release
// Created: 090/04/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.sendrelease");


dojo.require("dijit.form.TimeTextBox");
dojo.require("dijit._editor.plugins.AlwaysShowToolbar");
dojo.require("dijit._editor.plugins.ViewSource");
dojo.require("dojox.editor.plugins.Preview");

dojo.require("prmax.email.TtlImgLinkDialog");
dojo.require("prmax.pressrelease.attachments");

dojo.require("prmax.pressrelease.seo.edit");

dojo.require("prmax.pressrelease.distributiontemplate.template_add");
dojo.require("prmax.pressrelease.removelistmembers");
dojo.require("prmax.pressrelease.emailvalidation");

dojo.declare("prmax.pressrelease.sendrelease",
	[ ttl.BaseWidget ],
	{
		mainViewString:"/display/outletmain?outletid=${outletid}",
		widgetsInTemplate: true,
		emailtemplateid: -1,
		templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/sendrelease.html"),
		constructor: function()
		{
			this._SavedCallBack = dojo.hitch(this,this._Saved);
			this._LoadedCallBack = dojo.hitch(this,this._Loaded);
			this._Updated2CallBack = dojo.hitch(this,this._Updated);
			this._Updated2CallBack = dojo.hitch(this,this._Updated2);
			this._PreviewedCallBack = dojo.hitch(this,this._Previewed);
			this._SentCallBack = dojo.hitch(this,this._Sent);
			this._MoveRowCallBack = dojo.hitch (this, this._MoveRowCall);
			this._ListBuildCallBack = dojo.hitch( this, this._ListBuildCall);
			this._UpdatedListCallBack = dojo.hitch( this, this._UpdatedListCall);
			this._ListStatisticsCallBack = dojo.hitch( this, this._ListStatisticsCall);
			this._Set_Selected_CallBack = dojo.hitch( this, this._Set_Selected_Call);
			this._Delete_Selected_CallBack = dojo.hitch(this, this._Delete_Selected_Call);
			this._ListMembersFirstCallBack = dojo.hitch(this, this._ListMembersFirstCall);
			this._Delete_Member_CallBack = dojo.hitch(this, this._Delete_Member_Call);
			this._Step_3_Std_Next_CallBack = dojo.hitch(this, this._Step_3_Std_Next_Call);
			this._SeoLoadCallBack = dojo.hitch ( this, this._SeoLoadCall);
			this._SeoLoadCall2Back = dojo.hitch( this, this._SeoLoadCall2 );
			this._ValidateReplyAddressCallBack = dojo.hitch( this, this._ValidateReplyAddressCall );
			this._get_choice_call_back = dojo.hitch(this, this._get_choice_call);
			

			this.select_menu = null;
			this.selected_menu = null;
			this.selected_listmembers = [];

			this._modified = false;
			this._releasesent = false ;
			this.choice = null;

			this.select_model = new prcommon.data.QueryWriteStore (
				{url:'/lists/release_select',
					onError:ttl.utilities.globalerrorchecker,
					nocallback:true
			});
			this.selected_model = new prcommon.data.QueryWriteStore (
				{url:'/lists/release_selected',
					onError:ttl.utilities.globalerrorchecker,
					nocallback:true
			});

			this.list_model = new prcommon.data.QueryWriteStore (
				{url:'/lists/list_members',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true});

			this._pre_build_templates_header = new dojox.data.QueryReadStore(
			{url:'/emails/distributiontemplates/templates_list_dropdown?distributiontemplatetypeid=1',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});
			this._pre_build_templates_footer = new dojox.data.QueryReadStore(
			{url:'/emails/distributiontemplates/templates_list_dropdown?distributiontemplatetypeid=2',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

			this._emailsendtypes =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=emailsendtypes"});

			dojo.subscribe(PRCOMMON.Events.Word_Html_Data, dojo.hitch(this,this._Word_Html_Data_Event));
			dojo.subscribe("/distribution/listmembers_remove", dojo.hitch(this,this._Remove_Selected_ListMembers_Event));
			dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
			dojo.subscribe('/send_release/check_replyaddress', dojo.hitch(this, this._get_choice_event));

			this._Load_Page_Loaded_2 = false;
		},
		postCreate:function()
		{
			this.view_select["cells"][0][1].name = PRMAX.utils.settings.client_name;

			this.selectgrid.set("structure",this.view_select);
			this.selectedgrid.set("structure",this.view_selected);
			this.listitemsgrid.set("structure",this.view_members);
			this.selectgrid._setStore ( this.select_model );
			this.selectedgrid._setStore ( this.selected_model );
			this.listitemsgrid._setStore ( this.list_model ) ;

			this.selectgrid.onCellDblClick = dojo.hitch(this,this._OnRowDblClick);
			this.baseonCellClick = this.selectgrid.onCellClick;
			this.selectgrid.onCellClick = dojo.hitch(this,this._OnCellClick);

			this.selectedbaseonCellClick = this.selectedgrid.onCellClick;
			this.selectedgrid.onCellClick = dojo.hitch(this,this._OnCellClickSelected);


			this.listitemsgrid.onCellClick = dojo.hitch(this,this._OnCellClickListItems);
			this.listitemsgrid.onStyleRow = dojo.hitch(this,this._OnStyleRow);
			this.emailsendtypeid.store = this._emailsendtypes;

			dojo.attr(this.embargo_text,"for", this.embargoed.id );

			this.templateheaderid.store = this._pre_build_templates_header;
			this.templatefooterid.store = this._pre_build_templates_footer;

			// send release extended subject line
			if (PRMAX.utils.settings.has_e_e_s == true)
			{
				this.subject2.set("maxLength",255);
			}

			if (PRMAX.utils.settings.distributionistemplated == true)
			{
					dojo.style(this.template_selection_view.domNode, 'height','40px');
			}

			this.inherited(arguments);

			this._Load( this.emailtemplateid ) ;
			this._show_add_footer_call_back = dojo.hitch(this, this._show_add_call, this.templatefooterid);
			this._show_add_header_call_back = dojo.hitch(this, this._show_add_call, this.templateheaderid);

			if (PRMAX.utils.settings.seo)
			{
				dojo.attr(this.step5_name, 'innerHTML', 'Step 5');
			}
			else
			{
				dojo.attr(this.step5_name, 'innerHTML', 'Step 4');
			}
			
			dojo.attr(this.usetemplates, 'label', 'Use ' + PRMAX.utils.settings.distribution_description + ' Templates');
			dojo.attr(this.step1_label, 'innerHTML', 'Upload Your ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.step3_label, 'innerHTML', 'Modify ' + PRMAX.utils.settings.distribution_description + ' Lists');
			dojo.attr(this.step4_label, 'innerHTML', 'Send ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.sendemail_label, 'innerHTML', 'Send Email ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.sendpreview_distrtext, 'innerHTML', 'In the top box enter the email address you wish this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase()
				+ ' to come from.<br/>In the bottom box enter an email address if you wish to send yourself or someone else a preview proof copy of this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase() + '.</td></tr> ');
			dojo.attr(this.sendpreview_distrtext2, 'innerHTML', 'Enter an email address here if you wish to send yourself or someone else a preview proof copy of this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase() + '.</td></tr> ');

			dojo.attr(this.step5_mgs, 'innerHTML', 'You have successfully distributed your ' + PRMAX.utils.settings.distribution_description.toLowerCase());
			dojo.attr(this.hasseopressrelease, 'label', '<p class="stepdetails">Publish SEO ' + PRMAX.utils.settings.distribution_description + '</p>');
			dojo.attr(this.seo_not_avaliable.domNode, 'innerHTML', '<p><b>Why add an SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase() + '?</b></p>'
				+'<p>You have an interesting story, you have written a great ' + PRMAX.utils.settings.distribution_description + ' and you have targeted all the right media!</p>'
				+'<p>But how do you reach a wider audience? How do you get your story to appear on the major News Websites and key search engines such as Google, Yahoo and Bing?</p>'
				+'<p>How do you attain the absolute maximum number of opportunities for Journalists, News Organisations and News Consumers to see your story?</p>'
				+'<p><b>SEO is the answer!</b></p>'
				+'<p>SEO ' + PRMAX.utils.settings.distribution_description_plural.toLowerCase() + ' are just like a standard ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' but optimised for the web with the addition of Keyword Tags and published in a specific way to achieve the greatest possible visibility in the Search Engines.</p>'
				+'<p>If you are sending out a ' + PRMAX.utils.settings.distribution_description.toLowerCase() + ', it makes sense to get the most out of it. Add the SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' and instantly enhance your story’s potential audience, your search engine rankings and brand visibility in a single stroke.</p>'
				+'<p>In typical <b>PRmax</b> style you can add videos and images to your ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' at no extra cost, your ' + PRMAX.utils.settings.distribution_description
				+' will immediately be published on PRnewslink, the Journalist and Newsroom specific online wire service and will start hitting all the major Search Engines in minutes.</p>'
				+'<p>But most importantly and again, in typical PRmax style, SEO ' + PRMAX.utils.settings.distribution_description_plural + ' are Free.</p>'
				+'<p>To starting using the PRmax SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase() + " service tick the box next to 'Publish SEO " + PRMAX.utils.settings.distribution_description + "' above.</p>"
			);
		},
		_UpdateDistributionLabelEvent:function()
		{
			if (PRMAX.utils.settings.seo)
			{
				dojo.attr(this.step5_name, 'innerHTML', 'Step 5');
			}
			else
			{
				dojo.attr(this.step5_name, 'innerHTML', 'Step 4');
			}

			dojo.attr(this.usetemplates, 'label', 'Use ' + PRMAX.utils.settings.distribution_description + ' Templates');
			dojo.attr(this.step1_label, 'innerHTML', 'Upload Your ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.step3_label, 'innerHTML', 'Modify ' + PRMAX.utils.settings.distribution_description + ' Lists');
			dojo.attr(this.step4_label, 'innerHTML', 'Send ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.sendemail_label, 'innerHTML', 'Send Email ' + PRMAX.utils.settings.distribution_description);
			dojo.attr(this.sendpreview_distrtext, 'innerHTML', 'In the top box enter the email address you wish this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase()
				+ ' to come from.<br/>In the bottom box enter an email address if you wish to send yourself or someone else a preview proof copy of this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase() + '.</td></tr> ');
			dojo.attr(this.sendpreview_distrtext2, 'innerHTML', 'Enter an email address here if you wish to send yourself or someone else a preview proof copy of this '
				+ PRMAX.utils.settings.distribution_description.toLowerCase() + '.</td></tr> ');

			dojo.attr(this.step5_mgs, 'innerHTML', 'You have successfully distributed your ' + PRMAX.utils.settings.distribution_description.toLowerCase());
			dojo.attr(this.hasseopressrelease, 'label', '<p class="stepdetails">Publish SEO ' + PRMAX.utils.settings.distribution_description + '</p>');
			dojo.attr(this.seo_not_avaliable.domNode, 'innerHTML', '<p><b>Why add an SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase() + '?</b></p>'
				+'<p>You have an interesting story, you have written a great ' + PRMAX.utils.settings.distribution_description + ' and you have targeted all the right media!</p>'
				+'<p>But how do you reach a wider audience? How do you get your story to appear on the major News Websites and key search engines such as Google, Yahoo and Bing?</p>'
				+'<p>How do you attain the absolute maximum number of opportunities for Journalists, News Organisations and News Consumers to see your story?</p>'
				+'<p><b>SEO is the answer!</b></p>'
				+'<p>SEO ' + PRMAX.utils.settings.distribution_description_plural.toLowerCase() + ' are just like a standard ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' but optimised for the web with the addition of Keyword Tags and published in a specific way to achieve the greatest possible visibility in the Search Engines.</p>'
				+'<p>If you are sending out a ' + PRMAX.utils.settings.distribution_description.toLowerCase() + ', it makes sense to get the most out of it. Add the SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' and instantly enhance your story’s potential audience, your search engine rankings and brand visibility in a single stroke.</p>'
				+'<p>In typical <b>PRmax</b> style you can add videos and images to your ' + PRMAX.utils.settings.distribution_description.toLowerCase()
				+' at no extra cost, your ' + PRMAX.utils.settings.distribution_description
				+' will immediately be published on PRnewslink, the Journalist and Newsroom specific online wire service and will start hitting all the major Search Engines in minutes.</p>'
				+'<p>But most importantly and again, in typical PRmax style, SEO ' + PRMAX.utils.settings.distribution_description_plural + ' are Free.</p>'
				+'<p>To starting using the PRmax SEO ' + PRMAX.utils.settings.distribution_description.toLowerCase() + " service tick the box next to 'Publish SEO " + PRMAX.utils.settings.distribution_description + "' above.</p>"
			);
		},
		_OnStyleRow:function (inRow )
		{
			if (inRow.over)
			{
				inRow.customClasses += " dojoxGridRowOver";
				return ;
			}

			var rowData = this.listitemsgrid.getItem(inRow.index);
			if (rowData && rowData.i.exemployeeid != null)
			{
				inRow.customClasses += " prExcludeEmployee";
				return ;
			}
			else if (rowData && rowData.i.exoutletid != null)
			{
				inRow.customClasses += " prExcludeOutlet";
				return;
			}

			if (inRow.odd)
			{
				inRow.customClasses += " dojoxGridRowOdd";
			}
		},
		_OnCellClickListItems:function( e )
		{
			if (e.cellIndex == 0)
			{
				this._deleteRow = this.listitemsgrid.getItem(e.rowIndex);
				var selected = !this._deleteRow.i.selected;
				this.list_model.setValue(this._deleteRow, "selected", !this._deleteRow.i.selected, true);

				if (this._deleteRow.i.selected == true)
				{
					this.selected_listmembers.push(this._deleteRow);
				}
				else
				{
					var index = this.selected_listmembers.indexOf(this._deleteRow);
					if (index > -1)
					{
						this.selected_listmembers.splice(index, 1);
					}
				}
				if (this.selected_listmembers.length > 0)
				{
					dojo.removeClass(this.removeselectedbtn.domNode, "prmaxhidden");
				}
				else
				{
					dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
				}
			}
			else if ( e.cellIndex == 1 )
			{
				this._deleteRow = this.listitemsgrid.getItem(e.rowIndex);

				if ( confirm ("Remove from " + PRMAX.utils.settings.distribution_description + "?"))
				{
					dojo.xhrPost(
						ttl.utilities.makeParams(
						{
							load: this._Delete_Member_CallBack,
							url:'/lists/list_member_delete',
							content: {listmemberid:this._deleteRow.i.listmemberid}
						}));

					this._Show_Outlet_Details(null);
				}
			}
			else
			{
				var row = this.listitemsgrid.getItem(e.rowIndex);
				this._Show_Outlet_Details ( row.i.outletid );
			}
		},
		_Delete_Member_Call:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.list_model.deleteItem ( this._deleteRow ) ;
				this._Show_Outlet_Details ( );
			}
		},
		_Show_Outlet_Details:function ( outletid )
		{
			if (outletid )
				this.outlet_details.set("href",dojo.string.substitute(this.mainViewString,{outletid:outletid}));
			else
				this.outlet_details.set("content","");
		},
		_OnRowDblClick:function(e)
		{
			console.log("_OnRowDblClick",e);
			this._Row=this.selectgrid.getItem(e.rowIndex);
			this._MoveRow ( this._Row ) ;
		},
		_AddListToSelection:function(e)
		{
			this._MoveRow ( this._Row ) ;
		},
		// list selection changed chnage interface
		_Set_Selected_Call:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.selected_model.setValue(  this._SelectedRow, "selection" , response.data.selectionname, true );
				this._SelectedRow = null;
				this._modified = true;
			}
			else
			{
				alert("Problem Changing Selection");
			}
		},
		// Set the list selection
		_Set_Selection:function ( selectionid )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._Set_Selected_CallBack,
					url:'/emails/templatelist_update_selection',
					content: {emailtemplatelistid:this._SelectedRow.i.emailtemplatelistid,
					selectionid: selectionid}
				} ));
		},
		_Delete_Selected_Call:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.selected_model.deleteItem( this._SelectedRow );
				var nitem = { listname: this._SelectedRow.i.listname,
				qty: this._SelectedRow.i.qty,
				listid: this._SelectedRow.i.listid};

				this.SelectedRow = null;
				this.select_model.newItem ( nitem ) ;

				this._modified = true;
				alert("List Removed");
			}
			else
			{
				alert("Problem Deleting Selection");
			}
		},
		_Selection_Delete_List:function ()
		{
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._Delete_Selected_CallBack,
					url:'/emails/templatelist_delete',
					content: {emailtemplatelistid:this._SelectedRow.i.emailtemplatelistid }
				} ));
		},
		// Selected List menu
		_OnCellClickSelected:function ( e)
		{
			if ( e.cellIndex == 2 || e.cellIndex == 3)
			{
				this._SelectedRow=this.selectedgrid.getItem(e.rowIndex);
				if (this.selected_menu == null)
				{
				    this.selected_menu = new dijit.Menu();
				    this.selected_menu.addChild(new dijit.MenuItem({label:"All List Members", onClick:dojo.hitch(this,this._Set_Selection,-1)}));
				    this.selected_menu.addChild(new dijit.MenuItem({label:"Marked", onClick:dojo.hitch(this,this._Set_Selection,1)}));
				    this.selected_menu.addChild(new dijit.MenuItem({label:"Un-Marked", onClick:dojo.hitch(this,this._Set_Selection,0)}));
				    this.selected_menu.addChild(new dijit.MenuItem({label:"Delete List from Selection", onClick:dojo.hitch(this,this._Selection_Delete_List)}));
		            this.selected_menu.startup();
				}
				this.selected_menu._openMyself(e);
			}
			else
				this.selectedbaseonCellClick(e);

		},
		// Select Grid cell clicked only need to act on column 3
		_OnCellClick : function(e)
		{
			if ( e.cellIndex == 2 )
			{
				this._Row=this.selectgrid.getItem(e.rowIndex);
				this._AddListToSelection();
			}
			else
				this.baseonCellClick(e);
		},
		_MoveRow:function( row )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._MoveRowCallBack,
					url:'/emails/template_lists_add',
					content: { emailtemplateid: this.emailtemplateid,
					listid: row.i.listid}
				} ));
		},
		_MoveRowCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.select_model.deleteItem( this._Row );
				var item = this.selected_model.newItem(response.data);
				gHelper.AddRowToQueryWriteGrid(this.selectedgrid,item);
				this._Row = null;
				this._modified = true;
			}
			else
			{
				alert("Problem Adding list to selection");
			}

		},
		view_select:{
		cells: [[
			{name: 'Name',width: "auto",field:"listname"},
			{name: 'Short Name',width: "100px",field:"clientname"},
			{name: 'Qty',width: "50px",field:"qty"},
			{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.formatRowCtrlLarge}
			]]
		},
		view_selected:{
		cells: [[
			{name: 'Name',width: "auto",field:"listname"},
			{name: 'Qty',width: "50px",field:"qty"},
			{name: 'Selection',width: "auto",field:"selection",  type : dojox.grid.cells.Select, editable:true, options: ["All", "Selected", "Un-Selected"]},
			{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.formatRowCtrl}
			]]
		},
		view_members:{noscroll: false,
			cells: [[
				{name: ' ',width: "13px",styles: 'text-align: center;',field:'selected', formatter:ttl.utilities.formatButtonCell},
				{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl},
				{name: ' ',width: "6px",styles: 'text-align: center;', width: "6px",field:'prmax_outletgroupid',formatter:ttl.utilities.outletType},//type: dojox.grid.cells.Bool},
				{name: 'Outlet',width: "250px",field:'outletname'},
				{name: 'Contact',width: "150px",field:'contactname'},
				{name: 'Title',width: "170px",field:'job_title'},
				{name: 'Email',width: "170px",field:'email'}
			]]
		},
		// Loaded a template
		_Loaded:function ( response )
		{
			if ( response.success == "OK" )
			{
			try
			{
					this.emailtemplateid = response.data.emailtemplateid;
					PRMAX.utils.fieldControl["collateral"]._setEmailTemplateIdAttr(response.data.emailtemplateid);
					this.listid = response.data.listid;
					this._modified = false;
					this._releasesent = false;
					this.include_view_as_link.set("value",response.data.include_view_as_link);
					this.wordtohtml.Load ( response.data.subject, response.data.documentname, response.data.emailtemplateid);
					this.seopressrelease.LoadDefault ( this.emailtemplateid ) ;
					this.hasseopressrelease.set("checked", response.data.seopressrelease );
					this.emailsendtypeid.set("value", response.data.emailsendtypeid);

					if ( response.data.returnaddress == null || response.data.returnaddress.length == 0 )
					{
						this.email.set("value", PRMAX.utils.settings.emailreplyaddress );
						this.fromemail.set("value", PRMAX.utils.settings.emailreplyaddress );
					}
					else
					{
						this.email.set("value", response.data.returnaddress );
						this.fromemail.set("value", PRMAX.utils.settings.emailreplyaddress );
					}
					this.returnname.set("value", response.data.returnname);
					this.preview_email.set("value", response.data.preview);
					this.selectgrid.setQuery( ttl.utilities.getPreventCache({emailtemplateid:this.emailtemplateid}));
					this.selectedgrid.setQuery( ttl.utilities.getPreventCache({emailtemplateid:this.emailtemplateid}));
					this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({}));
					this.selected_listmembers = [];
					dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");

					this.attachments.Load(this.emailtemplateid);
					// Load
					if ( response.data.embargo )
					{
						dojo.removeClass(this.embargo_view,"prmaxhidden");
						this.embargo_date.set("value", ttl.utilities.fromObjectDate(response.data.embargo_date));
						this.embargo_time.set("value", response.data.embargo_time);
						this.embargoed.set("checked", true ) ;
					}
					else
					{
						var ndate = new Date()
						this.embargo_date.set("value", ndate );
						this.embargo_time.set("value", "T" + ndate.getHours()+":" + ndate.getMinutes() + ":00");
						dojo.addClass(this.embargo_view,"prmaxhidden");
						this.embargoed.set("checked", false ) ;
					}

					this.templateheaderid.set("value", response.data.templateheaderid==null?"-1":response.data.templateheaderid);
					this.templatefooterid.set("value", response.data.templatefooterid==null?"-1":response.data.templatefooterid);

					if (PRMAX.utils.settings.distributionistemplated == true)
					{
						if (response.data.templateheaderid!=null || response.data.templatefooterid != null)
							this.usetemplates.set("checked",true);
						else if (response.data.templateheaderid==null || response.data.templatefooterid==null)
							this.usetemplates.set("checked",false);
					}
					else
					{
						this.usetemplates.set("checked",false);
					}
					this.emailtemplatecontent.set("value", response.data.emailtemplatecontent);
				}
				catch (e) { alert(e);}

				this._Show_Editor_View();
				this.expo_pane.selectChild(this.upload_view);
				//this.expo_pane.selectChild(this.complete_view);

			}

			this.preview.cancel();
			this.preview_1.cancel();

		},
		_Embargo_Changed:function()
		{
			if ( this.embargoed.get("checked"))
			{
					dojo.removeClass(this.embargo_view,"prmaxhidden");
			}
			else
			{
					dojo.addClass(this.embargo_view,"prmaxhidden");
			}
		},
		_Word_Html_Data_Event:function(html)
		{
			if (html.sourcename == "sendrelease")
			{
				this.emailtemplatecontent.set("value", html.html) ;
			}
		},
		Load:function( emailtemplateid )
		{
			this.Clear();
			this._Load( emailtemplateid );
		},
		// call to load a specific templatre
		_Load:function( emailtemplateid )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._LoadedCallBack,
					url:'/emails/templates_get',
					content: {emailtemplateid:emailtemplateid}
				} ));
		},
		// saved a email as a template
		_Saved:function( response )
		{
			if (response.success=="OK")
			{
				alert("Email Saved");
				this.emailtemplatename.set("value","");
			}
			else if (response.success=="DU")
			{
				alert("Saved Email Name Already Exists");
				this.emailtemplatename.focus();
			}
			else
			{
				alert("Problem adding Email Template");
			}
		},
		// Save the email as a template
		_Save:function()
		{
			var data = this.emailtemplatename.set("value");

			if (data.length==0 )
			{
				alert("No Saved Email Name Specified");
				this.emailtemplatename.focus();
				return;
			}

			var content = { emailtemplatename:data,
							emailtemplatecontent: this.emailtemplatecontent.get("value"),
							templateheaderid:this.templateheaderid.get("value"),
							templatefooterid:this.templatefooterid.get("value")
							};
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._SavedCallBack,
					url:'/emails/templates_add',
					content: content
				} ));
		},
		// email sent
		_check_and_send:function()
		{
			this._ValidateReplyAddress();
		},
		_Sent:function( response )
		{
			if ( response.success=="OK")
			{
				this._Hide_Editor_View();
				this.expo_pane.selectChild(this.complete_view);
			}
			else
			{
				this._releasesent = false;
				var message = "Problem sending email";
				if (response.message != undefined)
					message = response.message;
				alert(message);
			}

			this.send.cancel();
			this.send2.cancel();
			dojo.removeClass(this.send_prev.domNode,"prmaxhidden");
			this.savechangesbtn.set('disabled',false);
			this.preview.set('disabled',false);
		},
		// send a complete list as an email
		_Send:function()
		{
			/// this.Lock_Code_Wait();
			try
			{
				if ( this._releasesent == true )
				{
					alert(PRMAX.utils.settings.distribution_description + " Already Sent");
					return;
				}

				var emailtemplatecontent  =  this.emailtemplatecontent.get("value");

				if ( this.email.isValid() == false )
				{
					alert("No valid Email Address Specified");
					this.email.focus();
					this.send.cancel();
					this.send2.cancel();
					return;
				}
				if ( this.returnname.isValid() == false )
				{
					alert("No Return Name Specified");
					this.returnname.focus();
					this.send.cancel();
					this.send2.cancel();
					return;
				}

				if ( this.subject2.get("value").length==0)
				{
					alert("Please enter a Subject Line for the email");
					this.subject2.focus();
					this.send.cancel();
					this.send2.cancel();
					return;
				}

				if ( this.embargoed.get("checked"))
				{
					// need to check that date + time is valid and in the future
					var td = ttl.utilities.jscDate(new Date());
					var dt = ttl.utilities.jscDate(this.embargo_date.get("value"));
					var failed = false;

					if ( td > dt )
					{
						failed = true;
					}
					else if ( dt.getTime() === td.getTime() )
					{
						var ct = new Date();
						var t = this.embargo_time.get("value");
						if ( ct.getHours() > t.getHours() ||
								 ( ct.getHours() == t.getHours() && ct.getMinutes() >= t.getMinutes()))
						{
						failed = true;
						}
					}
					if ( failed == true )
					{
 						alert("Schedule Delivery cannot be in the past");
						this.send.cancel();
						this.send2.cancel();
						return;
					}
				}


				this._releasesent = true ;
				dojo.addClass(this.send_prev.domNode,"prmaxhidden");
				this.send.makeBusy();
				this.send2.makeBusy();
				this.savechangesbtn.set('disabled',true);
				this.preview.set('disabled',true);

				dojo.xhrPost(
					ttl.utilities.makeParams(
					{
						load: this._SentCallBack,
						url:'/emails/email_send',
						content: {
							subject: this.subject2.get("value"),
							emailtemplateid: this.emailtemplateid,
							emailtemplatecontent : this.emailtemplatecontent.get("value"),
							selected :  -1,
							returnaddress: this.email.get("value"),
							returnname:this.returnname.get("value"),
							embargoed:this.embargoed.get("value"),
							embargo_date:ttl.utilities.toJsonDate(this.embargo_date.get("value")),
							embargo_time:ttl.utilities.toJsonTime(this.embargo_time.get("value")),
							emailsendtypeid : this.emailsendtypeid.get("value"),
							templateheaderid:this.templateheaderid.get("value"),
							templatefooterid:this.templatefooterid.get("value"),
							choice:this._choice
							}
					} ));
				}
			finally
			{
				this.UnLock_Code();
			}
		},
		_ValidateReplyAddress:function()
		{
			content = {};
			content['returnaddress'] = this.email.get("value");
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._ValidateReplyAddressCallBack,
					url:'/emails/validate_reply_address',
					content: content
				} ));
		},
		_ValidateReplyAddressCall:function(response)
		{
			if (response.success == 'OK')
			{
				if (response.data == '1')
				{
					//this.validate_email_ctrl.set("dialog",this.validate_email_dlg, 'The domain name of the reply address "'+this.email.get("value")+'" you entered is not correct.');
					this.validate_email_ctrl._load(this.validate_email_dlg,'The domain name <b>'+this.email.get("value")+'</b> is not correct.');
					this.validate_email_dlg.show();
					
				}
				else if (response.data == '2')
				{
					//this.validate_email_ctrl.set("dialog",this.validate_email_dlg, 'PRMax is not authirised to send emails on behalf of '+ this.email.get("value"));
					this.validate_email_ctrl._load(this.validate_email_dlg,'PRMax is not authirised to send emails on behalf of <b>'+ this.email.get("value") +'<b>');
					this.validate_email_dlg.show();
				}

			}
			else
			{
				alert("Problem validating reply address");	
			}
			this.validatereplyaddress.cancel();
		},
		_get_choice_event:function(choice)
		{
			if (choice == 'retry')
			{
				this._choice = 'retry'
				this.send.cancel();
				this.send2.cancel();
				dojo.removeClass(this.send_prev.domNode,"prmaxhidden");
				this.savechangesbtn.set('disabled',false);
				this.preview.set('disabled',false);	
				this.email.focus();
			}
			if (choice == 'continue')
			{
				this._choice = 'continue'
				this._Send();
			}

		},
		_get_choice_call:function(response)
		{
			alert('test');
		},
		_Previewed:function( response )
		{
			if ( response.success == "OK" )
				alert ("Preview sent");
			else
				alert ("Problem Sending Preview");
			this.preview.cancel();
			this.preview_1.cancel();
		},
		// send preview ermail
		_Preview:function()
		{
			if ( this.preview_email.isValid()==false)
			{
				alert("Please enter a valid preview email address");
				this.preview_email.focus();
				this.preview.cancel();
				return;
			}

			if ( this.subject2.get("value").length==0)
			{
				alert("Please enter a Subject Line for the email");
				this.preview_email.focus();
				this.preview.cancel();
				return;
			}

			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._PreviewedCallBack,
					url:'/emails/email_preview',

					content: {
							subject : this.subject2.get("value"),
							emailaddress : this.preview_email.get("value"),
							emailtemplateid: this.emailtemplateid,
							emailtemplatecontent: this.emailtemplatecontent.get("value"),
							include_view_as_link: this.include_view_as_link.get("value"),
							embargoed:this.embargoed.get("value"),
							embargo_date:ttl.utilities.toJsonDate(this.embargo_date.get("value")),
							embargo_time:ttl.utilities.toJsonTime(this.embargo_time.get("value")),
							returnaddress: this.email.get("value"),
							returnname:this.returnname.get("value"),
							emailsendtypeid : this.emailsendtypeid.get("value"),
							templateheaderid:this.templateheaderid.get("value"),
							templatefooterid:this.templatefooterid.get("value")

					}
				} ));
		},
		_Preview1:function()
		{
			if ( this.preview_email_1.isValid()==false)
			{
				alert("Please enter a valid preview email address");
				this.preview_email_1.focus();
				this.preview_1.cancel();
				return;
			}

			if ( this.fromemail.isValid()==false)
			{
				alert("Please enter a valid from email address");
				this.fromemail.focus();
				this.preview_1.cancel();
				return;
			}
			if ( this.attachments.isValid() == false )
			{
				this.preview_1.cancel();
				return;
			}

			if ( this.wordtohtml.get("subject").length==0)
			{
				alert("Please enter a Subject Line for the email");
				this.preview_email_1.focus();
				this.preview_1.cancel();
				return;
			}

			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._PreviewedCallBack,
					url:'/emails/email_preview',

					content: {
							subject : this.wordtohtml.get("subject"),
							emailaddress : this.preview_email_1.get("value"),
							emailtemplateid: this.emailtemplateid,
							emailtemplatecontent: this.emailtemplatecontent.get("value"),
							include_view_as_link: this.include_view_as_link.get("value"),
							embargoed:this.embargoed.get("value"),
							embargo_date:ttl.utilities.toJsonDate(this.embargo_date.get("value")),
							embargo_time:ttl.utilities.toJsonTime(this.embargo_time.get("value")),
							returnaddress: this.fromemail.get("value"),
							returnname:this.returnname.get("value"),
							emailsendtypeid : this.emailsendtypeid.get("value"),
							templateheaderid:this.templateheaderid.get("value"),
							templatefooterid:this.templatefooterid.get("value")
						}
				} ));
		},
		resize:function()
		{
			this.sendemail.resize ( arguments[0] ) ;
			var b = dojo.contentBox (this.emailtemplatecontent.domNode);
			var b2 = dojo.contentBox (this.sendemail.domNode);
			b.h = b2.h ;
			this.emailtemplatecontent.resize ( b ) ;

			this.inherited(arguments);
		},
		_Clear:function()
		{
			this._Load_Page_Loaded_2 = false;
			this.emailtemplatecontent.set("value","");
			this.expo_pane.selectChild(this.upload_view);
			this._Show_Outlet_Details();
			this.hasseopressrelease.set("checked", false );
			this._SEORelease();
			this.emailsendtypeid.set("value",1);
			this.templateheaderid.set("value","-1");
			this.templatefooterid.set("value","-1");
		},
		Clear:function()
		{
			this._Clear();
			this.send2.cancel();
			this.send.cancel();
			this.preview.cancel();
			this.preview_1.cancel();
			this.wordtohtml.Clear();
			this.seopressrelease.Clear();
		},
		_BackButton:function()
		{
			dijit.byId("std_banner_control").ShowResultList();
		},
		_Step_2_Next:function()
		{
			try
			{
				// at this point we need to verify the subject field
				// make sure that this some text to send
				var subject = this.wordtohtml.get("subject");
				var emailtemplatecontent = this.emailtemplatecontent.get("value");

				if ( subject.length == 0 ) {
					alert ("No " + PRMAX.utils.settings.distribution_description + " Title/Subject Specified");
					return false;
				}

				if ( this.attachments.isValid() == false )
					return;

				if (emailtemplatecontent.length == 0 )
				{
					alert("No " + PRMAX.utils.settings.distribution_description + " Details Specfied");
					this.emailtemplatecontent.focus();
					return false;
				}

				dojo.attr(this.step_2_title,"innerHTML",subject);
				dojo.attr(this.step_3_title,"innerHTML",subject);
				this.subject2.set("value", subject);

				// do update of record
				dojo.xhrPost(
					ttl.utilities.makeParams(
					{
						load: this._UpdatedCallBack,
						url:'/emails/templates_update',
						content: {emailtemplateid:this.emailtemplateid,
									emailtemplatecontent: this.emailtemplatecontent.get("value"),
									subject: this.wordtohtml.get("subject"),
									documentname: this.wordtohtml.get("document"),
									include_view_as_link: this.include_view_as_link.get("value"),
									embargoed:this.embargoed.get("value"),
									embargo_date:ttl.utilities.toJsonDate(this.embargo_date.get("value")),
									embargo_time:ttl.utilities.toJsonTime(this.embargo_time.get("value")),
									returnaddress: this.email.get("value"),
									returnname:this.returnname.get("value"),
									emailsendtypeid : this.emailsendtypeid.get("value"),
									templateheaderid:this.templateheaderid.get("value"),
									templatefooterid:this.templatefooterid.get("value")
							}
				} ));

				// LOad page 2
				this._Load_Page_2();

				// move to next record
				this._Hide_Editor_View();
				this.expo_pane.selectChild(this.select_lists_view);

				var tmp = this.fromemail.get("value");
				if (tmp)
					this.email.set("value", tmp );
			}
			catch(e)
			{
				alert(e);
			}
		},
		// Load the selection list page
		_Load_Page_2:function()
		{
			if ( this._Load_Page_Loaded_2 == false )
			{
				this.selectgrid.setQuery( ttl.utilities.getPreventCache({emailtemplateid:this.emailtemplateid}));
				this.selectedgrid.setQuery( ttl.utilities.getPreventCache({emailtemplateid:this.emailtemplateid}));
				this._Load_Page_Loaded_2 = true;
			}
		},
		_Step_3_Next:function()
		{
			if ( this.selected_model.hasRows() == false )
			{
				alert("No Lists's selected");
				this.step_3_next_btn.cancel();
				return;
			}
			if ( this.listid == null )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._ListBuildCallBack,
						url:'/emails/templates_update_build_list',
						content: {emailtemplateid:this.emailtemplateid}}))
			}
			else
			{
				if ( this._modified )
				{
					dojo.xhrPost(
						ttl.utilities.makeParams({
						load: this._ListBuildCallBack,
						url:'/emails/templates_update_rebuild_list',
						content: {emailtemplateid:this.emailtemplateid}}))
				}
				else
				{
					this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({listid:this.listid}));
					this.selected_listmembers = [];
					dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
					this.expo_pane.selectChild(this.modify_lists_view);
					this.step_3_next_btn.cancel();
				}
			}
		},
		_Step_3_Std_Next_Call:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({listid:this.listid}));
				this.selected_listmembers = [];
				dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
				this.expo_pane.selectChild(this.modify_lists_view);
				this.step_3_next_btn.cancel();
				this._SelectFirstEntry();
			}
			else
			{
				alert("Problem Moving to next Page");
			}
		},
		_SelectFirstEntry:function()
		{
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._ListMembersFirstCallBack,
					url:'/lists/list_member_first',
					content: {	listid:this.listid }
				} ));
		},
		_ListMembersFirstCall:function ( response )
		{
			if ( response.success == "OK"  && response.data.length > 0 )
			{
				this._Show_Outlet_Details ( response.data[0].outletid );
				try
				{
					this.listitemsgrid.selection.select(0);
				}
				catch (e ) { }
			}
		},
		_Step_3_Prev:function()
		{
			this._Show_Editor_View();
			this.expo_pane.selectChild(this.upload_view);
			dojo.removeClass(this.send_prev.domNode,"prmaxhidden");
		},
		_ListBuildCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.listid = response.listid;
				this._modified = false;
				this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({listid:this.listid}));
				this.selected_listmembers = [];
				dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
				this.expo_pane.selectChild(this.modify_lists_view);
				this._SelectFirstEntry();
			}
			else
			{
				alert("Problem building list");
			}
			this.step_3_next_btn.cancel();
		},
		_UpdatedListCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				this._modified = false;
				this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({listid:this.listid}));
				this.selected_listmembers = [];
				dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
				this.expo_pane.selectChild(this.modify_lists_view);
			}
			else
			{
				alert("Problem building list");
			}
			this.step_3_next_btn.cancel();
		},
		_Step_4_Next:function()
		{
			if ( PRMAX.utils.settings.seo == true )
			{
				if ( this.hasseopressrelease.get("checked") == true )
				{
					dojo.xhrPost(
							ttl.utilities.makeParams({
							load: this._SeoLoadCallBack,
							url: "/emails/seorelease/get_by_pressrelease" ,
							content: {emailtemplateid:this.emailtemplateid}
					}));
				}
				else
				{
					this._Hide_Editor_View();
					this.expo_pane.selectChild(this.seopressrelease_container);
				}
			}
			else
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._ListStatisticsCallBack,
					url:'/emails/email_count',
					content: {emailtemplateid:this.emailtemplateid,
										selected :  -1}
				}));
			}
		},
		_SeoLoadCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.seopressrelease.Load ( this.emailtemplateid, response.data ) ;
				this._Hide_Editor_View();
				this.expo_pane.selectChild(this.seopressrelease_container);
			}
			else
			{
				alert("Problem Loadin SEO");
			}
		},
		_SeoLoadCall2:function ( response )
		{
			if ( response.success == "OK" )
			{
				this.seopressrelease.Load ( this.emailtemplateid, response.data ) ;
				this.seopanel.selectChild ( this.seopressrelease );
				dojo.removeClass(this.seosave.domNode,"prmaxhidden");
			}
			else
			{
				alert("Problem Loadin SEO");
			}
		},
		_ListStatisticsCall:function( response )
		{
			if ( response.success == "OK" )
			{
				if ( response.data.seoreleaseid != null )
				{
					this.seopressrelease.set("seoreleaseid", response.data.seoreleaseid ) ;
				}
				if ( response.data.nbr == 0 )
				{
					alert("No List enties selected but send criteria is selected");
					return;
				}
				if ( response.data.nbr > 1500 )
				{
					alert("To avoid being seen as spam each " + PRMAX.utils.settings.distribution_description + " is limited to less than 1500 contacts");
					return;
				}
				dojo.attr(this.nbrtobesent,"innerHTML", response.data.nbr);
				this._Show_Editor_View();
				this.expo_pane.selectChild(this.send_view);
			}
			else
			{
				alert("Problem Accessing list details");
			}
		},
		_Step_4_Prev:function()
		{
			this._Hide_Editor_View();
			this.expo_pane.selectChild(this.select_lists_view);
		},
		_Step_5_Prev:function()
		{

			if ( PRMAX.utils.settings.seo == true )
			{
				this._Hide_Editor_View();
				this.expo_pane.selectChild(this.seopressrelease_container);
			}
			else
			{
				this._Hide_Editor_View();
				this.expo_pane.selectChild(this.modify_lists_view);
			}
		},
		_Hide_Editor_View:function()
		{
			dojo.style(this.left_zone.domNode,"display","none");
			dojo.style(this.left_zone,"width","0%");
			this.sendemail.layout();
		},
		_Show_Editor_View:function()
		{
			dojo.style(this.left_zone,"width","60%");
			dojo.style(this.left_zone.domNode,"display","");
			this.sendemail.layout();
		},
		_Completed:function()
		{
			dijit.byId("std_banner_control").ShowHomePage();
		},
		_ClearRelease:function()
		{
			if ( confirm("Clear " + PRMAX.utils.settings.distribution_description +" Details?"))
			{
				this.emailtemplatecontent.set("value", "");
			}
		},
		_Updated2:function(response)
		{
			if ( response.success=="OK")
				alert(PRMAX.utils.settings.distribution_description +" Updated");
			else
				alert("Problem Updating " + PRMAX.utils.settings.distribution_description);
		},
		_SaveChanges:function()
		{
			// do update of record
			dojo.xhrPost(
				ttl.utilities.makeParams(
				{
					load: this._Updated2CallBack,
					url:'/emails/templates_update',
					content: {emailtemplateid:this.emailtemplateid,
								emailtemplatecontent: this.emailtemplatecontent.get("value"),
								subject: this.wordtohtml.get("subject"),
								documentname: this.wordtohtml.get("document"),
								include_view_as_link: this.include_view_as_link.get("value"),
								embargoed:this.embargoed.get("value"),
								embargo_date:ttl.utilities.toJsonDate(this.embargo_date.get("value")),
								embargo_time:ttl.utilities.toJsonTime(this.embargo_time.get("value")),
								returnaddress: this.email.get("value"),
								returnname:this.returnname.get("value"),
								emailsendtypeid : this.emailsendtypeid.get("value"),
								templateheaderid:this.templateheaderid.get("value"),
								templatefooterid:this.templatefooterid.get("value")

						}
				} ));
		},
	_SEORelease:function()
	{
		if ( this.hasseopressrelease.get("checked") )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._SeoLoadCall2Back,
				url: "/emails/seorelease/get_by_pressrelease" ,
				content: {emailtemplateid:this.emailtemplateid}
			}));
		}
		else
		{
			this.seopanel.selectChild ( this.seo_not_avaliable ) ;
			dojo.addClass(this.seosave.domNode,"prmaxhidden");
		}

	},
	_Step_6_Next:function()
	{
		// Need to run save press release here followed by this as one of the responses !!!
		//
		var content = { emailtemplateid:this.emailtemplateid,
										seopressrelease:this.hasseopressrelease.get("checked"),
										selected : -1};

		if (this.hasseopressrelease.get("checked") == true )
		{
			if ( this.seopressrelease.isValid() == false )
				return false ;

			content = this.seopressrelease.seoform ( content ) ;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._ListStatisticsCallBack,
				url:'/emails/seo_page_next',
				content: content
		}));
	},
	_Step_6_Prev:function()
	{
		this._Hide_Editor_View();
		this.expo_pane.selectChild(this.modify_lists_view);
	},
	_SaveSeoChanges:function()
	{
		this.seopressrelease.Save();
	},
	_add_header_template:function()
	{
		this.add_template_ctrl.load(this._show_add_header_call_back,1);
		this.add_template_dlg.set("title","Add Header");
		this._show_add_call(null, "show");

	},
	_add_footer_template:function()
	{

		this.add_template_ctrl.load(this._show_add_footer_call_back,2);
		this.add_template_dlg.set("title","Add Footer");
		this._show_add_call(null, "show");
	},
	_show_add_call:function(template,command, data)
	{
		switch(command)
		{
		case "show":
			this.add_template_ctrl.clear();
			this.add_template_dlg.show();
			break;
		case "hide":
			this.add_template_dlg.hide();
			this.add_template_ctrl.clear();
			if (data)
			{
				template.set("value", data.distributiontemplateid);
			}
		}
	},
	_usetemplates_view:function()
	{
		if ( this.usetemplates.get("checked") )
		{
			dojo.removeClass(this.usetemplates_view,"prmaxhidden");
			dojo.removeClass(this.usetemplates_view_2,"prmaxhidden");
			dojo.style(this.template_selection_view.domNode, 'height','100px');
		}
		else
		{
			dojo.addClass(this.usetemplates_view,"prmaxhidden");
			dojo.addClass(this.usetemplates_view_2,"prmaxhidden");
			this.templateheaderid.set("value", "-1");
			this.templatefooterid.set("value", "-1");
			dojo.style(this.template_selection_view.domNode, 'height','40px');
		}
		this.left_zone.resize();
	},
	_remove_selected_listmembers:function()
	{
		this.remove_listmembers_ctrl.clear();
		this.remove_listmembers_ctrl.load(this.remove_listmembers_dlg, this.selected_listmembers, this.listid);

		this.remove_listmembers_dlg.show();
	},
	_Remove_Selected_ListMembers_Event:function(option)
	{
		if (option == 0 || option == '0')
		{
			for (var i=0; i<this.selected_listmembers.length; i++)
			{
				this.list_model.deleteItem( this.selected_listmembers[i] );
			}
		}
		else
		{
			this.listitemsgrid.setQuery( ttl.utilities.getPreventCache({listid:this.listid}));
		}
		this.selected_listmembers = [];
		dojo.addClass(this.removeselectedbtn.domNode, "prmaxhidden");
		this._Show_Outlet_Details();
	}
});





