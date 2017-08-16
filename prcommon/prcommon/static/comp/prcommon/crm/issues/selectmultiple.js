//-----------------------------------------------------------------------------
// Name:    prcommon.crm.issues.selectmultiple
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.issues.selectmultiple");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.search.std_search");

dojo.require("prcommon.crm.issues.add");


// Main control
dojo.declare("prcommon.crm.issues.selectmultiple",
	[ ttl.BaseWidget],
	{
		name:"",		// name used for a form integration
		value:"",
		displaytitle :'Issues',
		displayselect:'Select',
		show_header:false,
		search : '',
		size:'6',
		selectonly:true,
		startopen:true,
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prcommon.crm.issues","templates/selectmultiple.html"),
		constructor: function()
		{
			this.disabled = false;
			this._extended = false;
			this._load_selection_call = dojo.hitch(this,this._load_selection);
			this.issue_timer = null;

			dojo.subscribe("/issue/add_multi", dojo.hitch(this, this._other_issue_event));

		},
		statup2:function()
		{
			this.inherited(arguments);
		},
		postCreate:function()
		{
			this.open = true;
			// key
			dojo.connect(this.issue_list_select.domNode,"onkeyup" ,  dojo.hitch(this,this._issue_select));
			dojo.connect(this.issue_list,"onchange" ,  dojo.hitch(this,this.issue_update_selection));
			dojo.connect(this.issue_list,"ondblclick" ,  dojo.hitch(this,this.issue_select_dbl));
			if (this.startopen == false)
			{
				this.open = false;
				dojo.style(this.selectarea,"display","none");
			}
			this.inherited(arguments);
		},
		// styandard clear function
		clear:function()
		{
			this._clear_selection_box();
			this._clear_selected_box();
			this.issue_list_select.set("value","");
			this._Get(this._getValueAttr());
			this._selection_options();
			this.load_default();

			this.inherited(arguments);
		},
		_send_request:function( data )
		{
			this._transactionid = PRCOMMON.utils.uuid.createUUID();

			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._load_selection_call,
					url:'/crm/issues/listuserselection',
					content:{ word:data,
										transactionid: this._transactionid}})	);
		},
		_issue_select:function( p1, defaultvalue )
		{
			var data = this.issue_list_select.get("value");

			if ( defaultvalue != null )
				data = defaultvalue;

			if (data.length>0)
			{
				if (this.issue_timer)
				{
					clearTimeout ( this.issue_timer);
					this.issue_timer = null;
				}
				this.issue_timer = setTimeout(dojo.hitch(this, this._send_request,data),this.search_time);
			}
			else
			{
				this.issue_timer = null;
				this._clear_selection_box();
				this._selection_options();
			}

		},
		_load_selection:function(response)
		{
			if ( this._transactionid == response.transactionid )
			{
				this._clear_selection_box();
				for ( var i=0 ; i <response.data.length; ++i )
				{
					var record = response.data[i];
					this.issue_list.options[this.issue_list.options.length] = new Option(record.name,record.issueid);
				}
				this._selection_options();
			}
		},
		_clear_selection_box:function()
		{
			this.issue_list.options.length=0;
		},
		_clear_selected_box:function()
		{
			this.issue_select.length=0;
		},
		issue_update_selection:function()
		{
			this._selection_options();
		},
		issue_select_dbl:function()
		{
			this.issue_select_single();
			this._selection_options();
		},
		issue_select_all:function()
		{
			for (var c=0; c<this.issue_list.options.length ;c++){
				var option = this.issue_list.options[c];
				var addRecord = true;
				for (var c1=0; c1<this.issue_select.options.length ;c1++){
					if (this.issue_select.options[c1].value==option.value){
						addRecord = false;
						break;
					}
				}
				if ( addRecord ) {
					this.issue_select.options[this.issue_select.options.length] = new Option(option.text,option.value);
				}
			}
			this._Get(this._getValueAttr());
			this.issue_list.options.length = 0 ;
			this.issue_update_selection();
		},
		issue_select_single:function()
		{
			for (var c=0; c<this.issue_list.options.length ;c++){
				var option = this.issue_list.options[c];
				if (option.selected) {
					option.selected=false;
					var addRecord = true;
					for (var c1=0; c1<this.issue_select.options.length ;c1++){
						if (this.issue_select.options[c1].value==option.value){
							addRecord = false;
							break;
						}
					}
					if ( addRecord ) {
						this.issue_select.options[this.issue_select.options.length] = new Option(option.text,option.value);
						this._Get(this._getValueAttr());
					}
				}
			}
		},
		issue_remove_all:function()
		{
			this.issue_select.options.length = 0 ;
			this.issue_update_selection();
			this._Get(this._getValueAttr());
		},
		issue_remove_single:function()
		{
			for (var c=0; c<this.issue_select.options.length ;c++){
				if (this.issue_select.options[c].selected)
					this.issue_select.options[c] = null;
			}
			this.issue_update_selection();
			this._Get(this._getValueAttr());

		},
		_add_select:function(data)
		{
			this.issue_select.options[this.issue_select.options.length] = new Option(data.name,data.issueid);
		},
		_setValueAttr:function(values)
		{
			this.clear();
			var data = values.data;
			var open = false;
			if ( data == null || data == undefined )
				data = values;
			for (var key in data)
			{
				var record = data[key];
				this.issue_select.options[this.issue_select.options.length] = new Option(record.name,record.issueid);
				opne = true;
			}
			if ( open )
				this.MakeOpen();
			this._Get(this._getValueAttr());

		},
		_getValueAttr:function()
		{
			var data = Array();
			for (var c=0; c<this.issue_select.options.length ;c++)
			{
				if (this._extended)
				{
					data[c] = {
						issueid:parseInt(this.issue_select.options[c].value),
						name:this.issue_select.options[c].text
						};
				}
				else
				{
					data[c] = parseInt(this.issue_select.options[c].value);
				}
			}
			var obj = {data:data};
			if (this._extended)
			{
				return obj;
			}
			else
			{
				var data = data.length>0?dojo.toJson(obj):"";
				this.value = data;
				return data;
			}
		},
		_getCountAttr:function()
		{
			return this.issue_select.options.length;
		},
		_setExtendedAttr:function(value)
		{
			this._extended = value
		},

		_selection_options:function()
		{
			this.button_all.set('disabled',this.issue_list.length?false:true);
			this.button_single.set('disabled',this.issue_list.selectedIndex!=-1?false:true);

			this.button_del_all.set('disabled',this.issue_select.length?false:true);
			this.button_del_single.set('disabled',this.issue_select.selectedIndex!=-1?false:true);
		},
		_CaptureExtendedContent:function(data)
		{
			return data ;
		},
		_setDisabledAttr:function(values)
		{
			this.disabled = values;
		},
		_getDisabledAttr:function()
		{
			return this.disabled;
		},
		_Get:function()
		{
			if (this.selectonly==false)
				this.inherited(arguments);
		},
		_focus:function()
		{
			this.issue_list_select.focus();
		},
		_toggle:function()
		{
			this.open = !this.open;
			dojo.style(this.selectarea,"display","none");
			dojo.style(this.selectarea,"display",this.open?"block":"none");
			this.toggleCtrl.src =  this.open?"/static/images/toclosed.gif":"/static/images/toopen.gif";
		},
		_other_issue_event:function( issue )
		{
			this._clear_selection_box();
			this.issue_list.options[this.issue_list.options.length] = new Option(issue.name,issue.issueid);
			this._selection_options();
		},
		_new_issue:function()
		{
			this.new_issue_ctrl.clear();
			this.new_issue_ctrl.set("publish_event","/issue/add_multi");
			this.new_issue_ctrl.set("dialog",this.new_issue_dlg);
			this.new_issue_dlg.show();
		},
		load_default:function()
		{
		this._send_request("*");
		},
		_setDisplayselectAttr:function( displayselect )
		{
			dojo.attr(this.issue_label_1,"innerHTML" , displayselect);
		},
		_setDisplaytitleAttr:function( displaytitle )
		{
			//dojo.attr(this.issue_label_2,"innerHTML" , displaytitle );
		}
	}
);
