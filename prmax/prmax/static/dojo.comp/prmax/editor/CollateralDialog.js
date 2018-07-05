dojo.provide("prmax.editor.CollateralDialog");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._editor._Plugin");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojo.string");
dojo.provide("prmax.collateral.adddialog");

dojo.declare("prmax.editor._CollateralButton",
	[dijit._Widget, dijit._Templated],{
	// summary:
	//		Base class for widgets that contains a label (like "Font:")
	//		and a FilteringSelect drop down to pick a value.
	//		Used as Toolbar entry.

	// label: [public] String
	//		The label to apply to this particular FontDropDown.
	label: "",

	// widgetsInTemplate: [public] boolean
	//		Over-ride denoting the template has widgets to parse.
	widgetsInTemplate: true,

	// plainText: [public] boolean
	//		Flag to indicate that the returned label should be plain text
	//		instead of an example.
	plainText: false,

	// templateString: [public] String
	//		The template used to construct the labeled dropdown.
	templateString:
		"<span style='white-space: nowrap' class='dijit dijitReset dijitInline'>" +
			"<label class='dijitLeft dijitInline' for='${selectId}'>${label}</label>" +
			"<input dojoType='dijit.form.FilteringSelect' required=false labelType=html labelAttr=collateralcode searchAttr=collateralcode " +
					"tabIndex='-1' id='${selectId}' dojoAttachPoint='select' value='' style='width:150px'/>" +
		'<input class="dijitLeft dijitInline" id="${add_dialog_btn}" dojoType="dijit.form.ToggleButton" iconClass="fa fa-plus" showLabel="false" label="Add Collateral" dojoAttachPoint="add_btn">'+
		"</span>",

	// restrict list
	postMixInProperties: function(){
		// summary:
		//		Over-ride to misin specific properties.
		this.inherited(arguments);

		// Set some substitution variables used in the template
		this.label = "Collateral";
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.selectId = this.id + "_select";
		this.add_dialog_btn = this.id + "+add_btn";

		this.inherited(arguments);
	},

	postCreate: function(){
		// summary:
		//		Over-ride for the default postCreate action
		//		This establishes the filtering selects and the like.

		// Initialize the list of items in the drop down by creating data store with items like:
		// {value: 1, name: "xx-small", label: "<font size=1>xx-small</font-size>" }

		this._emailtemplatedid=-1;
		this.select.store = new dojox.data.QueryReadStore({  url:"/icollateral/collateral_list?emailtemplateid="+this._emailtemplatedid, onError:ttl.utilities.globalerrorchecker});

		this.select.set("value", "", false);
		this.disabled = this.select.get("disabled");
	},
	_add_collateral_event:function(collateral)
	{
		this.add_dialog.hide();
		this.select.set("value", collateral.collateralid, false);
	},

/*	_setValueAttr: function(value, priorityChange){
		// summary:
		//		Over-ride for the default action of setting the
		//		widget value, maps the input to known values
		// value: Object|String
		//		The value to set in the select.
		// priorityChange:
		//		Optional parameter used to tell the select whether or not to fire
		//		onChange event.

		//if the value is not a permitted value, just set empty string to prevent showing the warning icon
		priorityChange = priorityChange !== false?true:false;
		this.select.attr('value', value, priorityChange);
		if(!priorityChange){
			// Clear the last state in case of updateState calls.  Ref: #10466
			this.select._lastValueReported=null;
		}
	}, */

	_getValueAttr: function(){
		// summary:
		//		Allow retreving the value from the composite select on
		//		call to button.attr("value");
		return this.select.get('value');
	},

	focus: function(){
		// summary:
		//		Over-ride for focus control of this widget.  Delegates focus down to the
		//		filtering select.
		this.select.focus();
	},

	_setDisabledAttr: function(value){
		// summary:
		//		Over-ride for the button's 'disabled' attribute so that it can be
		//		disabled programmatically.

		// Save off ths disabled state so the get retrieves it correctly
		//without needing to have a function proxy it.
		this.disabled = value;
		this.select.set("disabled", value);
	},
	_setEmailTemplateIdAttr:function(value)
	{
		this._emailtemplatedid=value;
		this.select.store = new dojox.data.QueryReadStore({  url:"/icollateral/collateral_list?emailtemplateid="+this._emailtemplatedid, onError:ttl.utilities.globalerrorchecker});
	}
});

// TODO: for 2.0, split into FontChoice plugin into three separate classes,
// one for each command (and change registry below)
dojo.declare("prmax.editor.CollateralDialog", dijit._editor._Plugin,{
	// summary:
	//		This plugin provides three drop downs for setting style in the editor
	//		(font, font size, and format block), as controlled by command.
	//
	// description:
	//		The commands provided by this plugin are:
	//
	//		* fontName
	//	|		Provides a drop down to select from a list of font names
	//		* fontSize
	//	|		Provides a drop down to select from a list of font sizes
	//		* formatBlock
	//	|		Provides a drop down to select from a list of block styles
	//	|
	//
	//		which can easily be added to an editor by including one or more of the above commands
	//		in the `plugins` attribute as follows:
	//
	//	|	plugins="['fontName','fontSize',...]"
	//
	//		It is possible to override the default dropdown list by providing an Array for the `custom` property when
	//		instantiating this plugin, e.g.
	//
	//	|	plugins="[{name:'dijit._editor.plugins.FontChoice', command:'fontName', custom:['Verdana','Myriad','Garamond']},...]"
	//
	//		Alternatively, for `fontName` only, `generic:true` may be specified to provide a dropdown with
	//		[CSS generic font families](http://www.w3.org/TR/REC-CSS2/fonts.html#generic-font-families)
	//
	//		Note that the editor is often unable to properly handle font styling information defined outside
	//		the context of the current editor instance, such as pre-populated HTML.

	// useDefaultCommand: [protected] booleam
	//		Override _Plugin.useDefaultCommand...
	//		processing is handled by this plugin, not by dijit.Editor.
	useDefaultCommand: false,

	_initButton: function(){
		// summary:
		//		Overrides _Plugin._initButton(), to initialize the FilteringSelect+label in toolbar,
		//		rather than a simple button.
		// tags:
		//		protected

		// Create the widget to go into the toolbar (the so-called "button")
		params = this.params;

		// For back-compat reasons support setting custom values via "custom" parameter
		// rather than "values" parameter
		if(this.params.custom){
			params.values = this.params.custom;
		}

		this.button = new prmax.editor._CollateralButton(params);

		this.connect(this.button.add_btn,"onChange",function()
		{
			this.button.add_dialog.show();
		});

		// Reflect changes to the drop down in the editor
		this.connect(this.button.select, "onChange", function(choice){
			// User invoked change, since all internal updates set priorityChange to false and will
			// not trigger an onChange event.
			if  ( choice == "" )  return ;
			this.editor.focus();

			// Invoke, the editor already normalizes commands called through its
			// execCommand.
			this.editor.execCommand(this.command, choice);
			var item  = {identity:choice,
									onItem: dojo.hitch (this , function () { this.tmp_row = arguments[0].i } )};
			this.button.select.store.fetchItemByIdentity(item);
			var args ={urlInput: PRMAX.utils.settings.collateralurl,
								collateralid:this.tmp_row.collateralid,
								collateralname: this.tmp_row.collateralname,
								ext  : this.tmp_row.ext };
			var template = "";
			var ext = this.tmp_row.ext.toLowerCase()
			if ( ext == '.jpg' || ext == '.gif'|| ext == '.bmp' || ext == ".tif" || ext == ".tiff" || ext == '.jpeg')
			{
			var embedded = true ;
				if ( confirm ( "To add as a link press OK\nTo add as an image press Cancel?"))
					embedded = false;

				if ( embedded )
					template = "<img src='${urlInput}/${collateralid}${ext}'></img>";
				else
					template = "<a href='${urlInput}/${collateralid}${ext}'>${collateralname}</a>";
			}
			else
				template = "<a href='${urlInput}/${collateralid}${ext}'>${collateralname}</a>";
			this.editor.execCommand('inserthtml', dojo.string.substitute(template, args));
			this.button.select.set("value","");

		});
		this.button.add_dialog = new prmax.collateral.adddialog(params);

		dojo.subscribe(PRCOMMON.Events.Collateral_Add , dojo.hitch(this.button, this.button._add_collateral_event));

	},

	updateState: function(){
		// summary:
		//		Overrides _Plugin.updateState().  This controls updating the menu
		//		options to the right values on state changes in the document (that trigger a
		//		test of the actions.)
		//		It set value of drop down in toolbar to reflect font/font size/format block
		//		of text at current caret position.
		// tags:
		//		protected
		var _e = this.editor;
		var _c = this.command;
		if(!_e || !_e.isLoaded || !_c.length){ return; }
		if(this.button){
			var value;
			try{
				value = _e.queryCommandValue(_c) || "";
			}catch(e){
				//Firefox may throw error above if the editor is just loaded, ignore it
				value = "";
			}

			// strip off single quotes, if any
			var quoted = dojo.isString(value) && value.match(/'([^']*)'/);
			if(quoted){ value = quoted[1]; }

			if(!value && _c === "formatBlock"){
				// Some browsers (WebKit) doesn't actually get the tag info right.
				// So ... lets double-check it.
				var elem;
				// Try to find the current element where the caret is.
				var sel = dijit.range.getSelection(this.editor.window);
				if(sel && sel.rangeCount > 0){
					var range = sel.getRangeAt(0);
					if(range){
						elem = range.endContainer;
					}
				}

				// Okay, now see if we can find one of the formatting types we're in.
				while(elem && elem !== _e.editNode && elem !== _e.document){
					var tg = elem.tagName?elem.tagName.toLowerCase():"";
					if(tg && dojo.indexOf(this.button.values, tg) > -1){
						value = tg;
						break;
					}
					elem = elem.parentNode;
				}
			}

			if(value !== this.button.get("value")){
				// Set the value, but denote it is not a priority change, so no
				// onchange fires.
				this.button.set('value', value, false);
			}
		}
	},
	_setEmailTemplateIdAttr:function(value)
	{
		this.button.set("EmailTemplateId",value);
	}
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	switch(o.args.name){
	case "insertCollateral":
		o.plugin = new prmax.editor.CollateralDialog({command: o.args.name});
		PRMAX.utils.fieldControl["collateral"] = o.plugin;
	}
});
