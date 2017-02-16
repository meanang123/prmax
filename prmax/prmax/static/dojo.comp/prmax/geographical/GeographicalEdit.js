//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.geographical.GeographicalEdit");

dojo.declare("prmax.geographical.GeographicalEdit",
	[ dijit._Widget, dijit._Templated, dijit._Container],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.geographical","templates/GeographicalEdit.html"),
		constructor: function()
		{
			this.geographical_types = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=geographicallookuptypes&typesonly=0"});
			this._CollectDetailsCallBack = dojo.hitch(this,this._CollectDetailsCall);
			this._AddCallBack = dojo.hitch(this,this._AddCall);
			this._UpdateCallBack = dojo.hitch(this,this._UpdateCall);
			this._LoadSelectionCallBack = dojo.hitch(this,this._LoadSelectionCall);
			this._LoadChildSelectionCallBack = dojo.hitch(this,this._LoadChildSelectionCall);
			this._TransferSelectionCallBack= dojo.hitch(this,this._TransferSelectionCall);
			this._DeleteCallBack = dojo.hitch(this,this._DeleteCall);
			this._TransferCallBack = dojo.hitch(this,this._TransferCall);
			this._geographicalid = -1;
		},
		postCreate:function()
		{
			this.geographicallookuptypeid.store = this.geographical_types;
			dojo.connect(this.geographical_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this._GeographicalSelect));
			dojo.connect(this.child_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this._ChildGeogSelect));

			dojo.connect(this.geographical_list,"onchange" ,  dojo.hitch(this,this._GeographicalUpdateSelection));
			dojo.connect(this.geographical_list,"ondblclick" ,  dojo.hitch(this,this._GeographicalSelectDbl));
			dojo.connect(this.geographical_select,"ondblclick" ,  dojo.hitch(this,this._GeographicalSelectDeleteDbl));
			dojo.connect(this.geographical_select,"onchange" ,  dojo.hitch(this,this._GeographicalUpdateSelection));

			dojo.connect(this.child_list,"onchange" ,  dojo.hitch(this,this._ChildUpdateSelection));
			dojo.connect(this.child_list,"ondblclick" ,  dojo.hitch(this,this._ChildSelectDbl));
			dojo.connect(this.child_select,"ondblclick" ,  dojo.hitch(this,this._ChildSelectDeleteDbl));
			dojo.connect(this.child_select,"onchange" ,  dojo.hitch(this,this._ChildUpdateSelection));



			dojo.connect(this.transfer_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this._TransferSelect));
			dojo.connect(this.transfer_list,"onchange" ,  dojo.hitch(this,this._TransferSelectionOptions));

		},
		_GeographicalUpdateSelection:function()
		{
			this._SelectionOptions();
		},
		_ChildUpdateSelection:function()
		{
			this._ChildSelectionOptions();
		},
		_GeographicalSelectDbl:function()
		{
			this._GeographicalSelectSingle();
			this._SelectionOptions();
		},
		_GeographicalSelectAll:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.geographical_select.options.length ;c1++){
					if (this.geographical_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
				}
			}
			this.geographical_list.options.length = 0 ;
			this._GeographicalUpdateSelection();
		},
		_GeographicalSelectSingle:function()
		{
			for (var c=0; c<this.geographical_list.options.length ;c++){
				var option = this.geographical_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.geographical_select.options.length ;c1++){
						if (this.geographical_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.geographical_select.options[this.geographical_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
			this._GeographicalUpdateSelection();
		},
		_GeographicalRemoveAll:function()
		{
			this.geographical_select.options.length = 0 ;
			this._GeographicalUpdateSelection();
		},
		_GeographicalSelectDeleteDbl:function( target )
		{
			console.log("write", target);
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.geographical_select.options[target.originalTarget.index] = null;
				this._GeographicalUpdateSelection();
			}
			else
			{
				this._GeographicalRemoveSingle();
			}
		},
		_GeographicalRemoveSingle:function()
		{
			for (var c=0; c<this.geographical_select.options.length ;c++){
				if (this.geographical_select.options[c].selected)
					this.geographical_select.options[c] = null;
			}
			this._GeographicalUpdateSelection();
		},
		_LoadSelectionCall:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._ClearSelectionBox();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.geographical_list.options[this.geographical_list.options.length] = new Option(record[0],record[1]);
				}
				this._SelectionOptions();
			}
		},
		// Child list response selection
		_LoadChildSelectionCall:function( response )
		{
			if ( this._transactionid_child == response.transactionid )
			{
				this._ClearChildSelectionBox();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.child_list.options[this.child_list.options.length] = new Option(record[0],record[1]);
				}
				this._ChildSelectionOptions();
			}
		},
		_GeographicalSelect:function()
		{
			var data = this.geographical_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();
				var fid = parseInt(this.geographicallookuptypeid.get("value"));
				if ( fid == 3 )  fid = 6

				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadSelectionCallBack,
						url:'/geographical/listbytype',
						content:{
							word:data,
							parentonly:1,
							filter:fid,
							transactionid: this._transactionid,
							cascade_region:1,
							extended_mode:true
				}}));
			}
			else
			{
				this._ClearSelectionBox();
				this._SelectionOptions();
			}
		},
		/* Child List Find */
		_ChildGeogSelect:function()
		{
			var data = this.child_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid_child = PRCOMMON.utils.uuid.createUUID();

				// fix up child for gap
				var fid = parseInt(this.geographicallookuptypeid.get("value"))-1;
				if ( fid == 5 )  fid = 3;

				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadChildSelectionCallBack,
						url:'/geographical/listbytype',
						content:{
							word:data,
							filter:fid,
							transactionid: this._transactionid_child,
							cascade_region:2,
							extended_mode:true

				}}));
			}
			else
			{
				this._ClearChildSelectionBox();
				this._ChildSelectionOptions();
			}

		},
		_CollectDetailsCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				this._MakeEdit();
				this._geographicalid = response.data.geographical.geographicalid;
				this.geographicalname.set("value", response.data.geographical.geographicalname);
				this.geographicallookuptypeid.set("value", response.data.geographical.geographicallookuptypeid);
				for ( var i=0 ; i <response.data.parents.length; ++i )
				{
					var area = response.data.parents[i];
					this.geographical_select.options[this.geographical_select.options.length] = new Option(area.geographicalname,area.parentgeographicalareaid);
				}
				for ( var i=0 ; i <response.data.children.length; ++i )
				{
					var area = response.data.children[i];
					this.child_select.options[this.child_select.options.length] = new Option(area.geographicalname,area.childgeographicalareaid);
				}

				this._TypeChanged();
			}
			else
			{
				alert( "Problem getting Details");
			}
		},
		Load:function( geographicalid )
		{
			this._Clear();
			this._geographicalid = geographicalid;
			if ( this._geographicalid>0 )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._CollectDetailsCallBack,
					url:'/geographical/getdetails',
					content: {geographicalid:this._geographicalid}}));
			}
			else
			{
				this._MakeNew();
			}
		},
		_Transfere:function()
		{
			dojo.toggleClass(this.show_transfer,"prmaxhidden");
		},
		_DeleteCall:function( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Geographical_Area_Delete, [response.data]);
			}
			else
			{
				alert("Problem Deleting area");
			}
		},
		_Delete:function()
		{
			if ( confirm ("Delete Area") )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._DeleteCallBack,
					url:'/geographical/delete_geographical',
					content: {geographicalid:this._geographicalid}}));
			}
		},
		_AddCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Geographical_Area_Add, [response.data]);
				alert("Area Added");
				dojo.publish(PRCOMMON.Events.Dialog_Close, ["gadd"]);
			}
			else
			{
				alert("Problem Adding Geographical Area");
			}
		},
		_UpdateCall:function ( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Geographical_Area_Update, [response.data]);
				alert("Updating Geographical Area");
			}
			else if ( response.success == "DU" )
			{
				alert("Area Already Exists");
			}
			else
			{
				alert("Problem Updating Geographical Area");
			}
		},
		_Save:function()
		{
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required field filled in");
				return;
			}

			var content = this.form.get("value");
			content["geographicalid"] = this._geographicalid;

			var parents = Array();
			var children = Array();
			for ( var x = 0 ; x < this.geographical_select.options.length; x++ )
				parents[x] = parseInt(this.geographical_select.options[x].value);
			content["parents"] = dojo.toJson(parents)

			for ( var x = 0 ; x < this.child_select.options.length; x++ )
				children[x] = parseInt(this.child_select.options[x].value);
			content["children"] = dojo.toJson(children)


			if ( this._geographicalid == -1 )
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._AddCallBack,
					url:'/geographical/add',
					content: content}));
			else
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._UpdateCallBack,
					url:'/geographical/update',
					content: content}));
			}
		},
		_Clear:function()
		{
			this.geographicalname.get("value", "");
			this.geographical_select.options.length = 0;
			this.geographical_list.options.length = 0;
			this.child_select.options.length = 0;
			this.child_list.options.length = 0;
			this.geographicallookuptypeid.set("value",1);
			this._ClearSelectionBox();
			this._SelectionOptions();
			this._ClearChildSelectionBox();
			this._ChildSelectionOptions();
			this._ClearTransferSelectionBox();
			this._TransferSelectionOptions();

			dojo.addClass(this.show_transfer,"prmaxhidden");

			this.geographicalname.focus();

		},
		_MakeNew:function()
		{
			dojo.style( this.transfer.domNode,"display","none");
			dojo.style( this.deletebtn.domNode,"display","none");
			this.save.set("label","Add");
		},
		_MakeEdit:function()
		{
			dojo.style( this.transfer.domNode,"display","");
			dojo.style( this.deletebtn.domNode,"display","");
			this.save.set("label","Save");

		},
		_ClearSelectionBox:function()
		{
			this.geographical_list.options.length=0;
		},
		_ClearChildSelectionBox:function()
		{
			this.child_list.options.length=0;
		},
		_SelectionOptions:function()
		{
			this.button_all.set('disabled',this.geographical_list.length?false:true);
			this.button_single.set('disabled',this.geographical_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.geographical_select.length?false:true);
			this.button_del_single.set('disabled',this.geographical_select.selectedIndex!=-1?false:true);
		},
		_ChildSelectionOptions:function()
		{
			this.child_btn_all.set('disabled',this.child_list.length?false:true);
			this.child_btn_single.set('disabled',this.child_list.selectedIndex!=-1?false:true);

			this.child_btn_del_all.set('disabled',this.child_select.length?false:true);
			this.child_btn_del_single.set('disabled',this.child_select.selectedIndex!=-1?false:true);
		},
		_TransferSelectionCall:function( response )
		{
			if ( this._transactionid == response.transactionid )
			{
				this._ClearTransferSelectionBox();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.transfer_list.options[this.transfer_list.options.length] = new Option(
							record[0] + "(" + record[1] + ")",
							record[1]);
				}
				this._TransferSelectionOptions();
			}
		},
		_TransferSelect:function()
		{
			var data = this.transfer_list_select.get("value");
			if (data.length>0)
			{
				this._transactionid = PRCOMMON.utils.uuid.createUUID();

				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._TransferSelectionCallBack,
						url:'/geographical/listbytype',
						content:{
							word:data,
							filter:-1,
							transactionid: this._transactionid,
							extended_mode:true
				}}));
			}
			else
			{
				this._ClearTransferSelectionBox();
				this._TransferSelectionOptions();
			}
		},
		_ClearTransferSelectionBox:function()
		{
			this.transfer_list.options.length=0;
		},
		_TransferSelectionOptions:function()
		{
			this.transfer_do.set('disabled', this.transfer_list.selectedIndex!=-1?false:true);
		},
		_TransferCall:function( response )
		{
			if ( response.success == "OK" )
			{
				dojo.publish(PRCOMMON.Events.Coverage_Moved, []);
				alert("Coverage Moved");
			}
			else
			{
				alert("Problem Moving Coverage");
			}
		},
		_Transfere_Do:function()
		{
			if ( confirm ( "Move Coverage to " + this.transfer_list.options[this.transfer_list.selectedIndex].text +"?") )
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._TransferCallBack,
							url:'/geographical/move_coverage',
							content:{
							fromgeographicalid:this._geographicalid,
							togeographicalid: this.transfer_list.options[this.transfer_list.selectedIndex].value
					}}));
			}
		},
		_TypeChanged:function()
		{
			var v = this.geographicallookuptypeid.get("value");

				if ( v == 1 )
					dojo.addClass( this.child_view ,"prmaxhidden");
				else
					dojo.removeClass( this.child_view ,"prmaxhidden");
		},
		// Child Buttons
		_ChildSelectAll:function()
		{
			for (var c=0; c<this.child_list.options.length ;c++){
				var option = this.child_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.child_select.options.length ;c1++){
					if (this.child_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.child_select.options[this.child_select.options.length] = new Option(option.text,option.value);
				}
			}
			this.child_list.options.length = 0 ;
			this._ChildUpdateSelection();
		},
		_ChildSelectSingle:function()
		{
			for (var c=0; c<this.child_list.options.length ;c++){
				var option = this.child_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.child_select.options.length ;c1++){
						if (this.child_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.child_select.options[this.child_select.options.length] = new Option(option.text,option.value);
					}
				}
			}
			this._ChildUpdateSelection();
		},
		_ChildRemoveAll:function()
		{
			this.child_select.options.length = 0 ;
			this._ChildUpdateSelection();
		},
		_ChildSelectDbl:function()
		{
			this._ChildSelectSingle();
			this._ChildSelectionOptions();
		},
		_ChildSelectDeleteDbl:function( target )
		{
			if  ( target != null && target.originalTarget != null && target.originalTarget.index != null )
			{
				this.child_select.options[target.originalTarget.index] = null;
				this._ChildUpdateSelection();
			}
			else
			{
				this._ChildRemoveSingle();
			}
		},
		_ChildRemoveSingle:function()
		{
			for (var c=0; c<this.child_select.options.length ;c++){
				if (this.child_select.options[c].selected)
					this.child_select.options[c] = null;
			}
			this._ChildUpdateSelection();
		}
});





