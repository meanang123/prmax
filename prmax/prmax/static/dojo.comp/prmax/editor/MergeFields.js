dojo.provide("prmax.editor.MergeFields");

dojo.declare("prmax.editor._MergeFieldsButton",
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
			"<select dojoType='dijit.form.FilteringSelect' tabIndex='-1' id='${selectId}' dojoAttachPoint='select' value='' style='width:100px'>" +
			"<option value=''></option><option value='!FIRSTNAME!'>First Name</option><option value='!FORMAL!'>Formal</option><option value='!JOBTITLE!'>Job title</option></select>" +
			"</span>",

	// restrict list
	postMixInProperties: function(){
		// summary:
		//		Over-ride to misin specific properties.
		this.inherited(arguments);

		// Set some substitution variables used in the template
		this.label = "Merge Fields";
		this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		this.selectId = this.id + "_select";

		this.inherited(arguments);
	},

	postCreate: function(){
		// summary:
		//		Over-ride for the default postCreate action
		//		This establishes the filtering selects and the like.

		// Initialize the list of items in the drop down by creating data store with items like:
		// {value: 1, name: "xx-small", label: "<font size=1>xx-small</font-size>" }

		this.select.set("value", "", false);
		this.disabled = this.select.get("disabled");
	},

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
	}
});

// TODO: for 2.0, split into FontChoice plugin into three separate classes,
// one for each command (and change registry below)
dojo.declare("prmax.editor.MergeFields", dijit._editor._Plugin,{
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

		this.button = new prmax.editor._MergeFieldsButton(params);

		// Reflect changes to the drop down in the editor
		this.connect(this.button.select, "onChange", function(choice){
			// User invoked change, since all internal updates set priorityChange to false and will
			// not trigger an onChange event.
			if  ( choice == "" )  return ;
			this.editor.focus();

			this.editor.execCommand('inserthtml', choice);
			this.button.select.set("value","");

		});
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
	}
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	switch(o.args.name){
	case "mergefields":
		o.plugin = new prmax.editor.MergeFields({command: o.args.name});
		break;
	}
});
