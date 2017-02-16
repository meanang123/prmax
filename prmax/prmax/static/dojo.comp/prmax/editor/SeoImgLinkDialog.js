dojo.provide("prmax.editor.SeoImgLinkDialog");

dojo.require("dijit._editor.plugins.LinkDialog");
dojo.require("dojo.i18n");
dojo.requireLocalization("dijit", "common");
dojo.requireLocalization("prmax", "SeoImgLinkDialog");

dojo.declare("prmax.editor.SeoImgLinkDialog", [dijit._editor.plugins.LinkDialog], {
	// summary:
	//		This plugin extends LinkDialog and adds in a plugin for handling image links.
	//		provides the image link dialog.
	//
	// description:
	//		The command provided by this plugin is:
	//		* insertImage

	// linkDialogTemplate: [protected] String
	//		Over-ride for template since img dialog doesn't need target that anchor tags may.
	linkDialogTemplate: [
		"<table><tr><td>",
		"<label for='${id}_urlInput'>${url}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' regExp='${urlRegExp}' " +
		"required='true' id='${id}_urlInput' name='urlInput' intermediateChanges='true'>",
		"</td></tr><tr><td>",
		"<label for='${id}_textInput'>${text}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='false' id='${id}_textInput' " +
		"name='textInput' intermediateChanges='true'>",
		"</td></tr><tr><td>",
		"<label for='${id}_styleInput'>${style}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='false' id='${id}_styleInput' " +
		"name='styleInput' intermediateChanges='true'>",
		"</td></tr><tr><td>",
		"<label for='${id}_heightInput'>${height}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='false' id='${id}_heightInput' " +
		"name='heightInput' intermediateChanges='true'>",
		"</td></tr><tr><td>",
		"<label for='${id}_widthInput'>${width}</label>",
		"</td><td>",
		"<input dojoType='dijit.form.ValidationTextBox' required='false' id='${id}_widthInput' " +
		"name='widthInput' intermediateChanges='true'>",
		"</td></tr>",
		"</td></tr><tr><td colspan='2'>",
		"<button dojoType='dijit.form.Button' type='button' id='${id}_loadThumbNail'>${loadThumbNail}</button>",
		"<button dojoType='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>",
		"<button dojoType='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>",
		"</td></tr></table>"
	].join(""),

	// htmlTemplate: [protected] String
	//		String used for templating the <img> HTML to insert at the desired point.
	htmlTemplate: "<img src=\"${urlInput}\" _djrealurl=\"${urlInput}\" alt=\"${textInput}\" height=\"${heightInput}\" width=\"${widthInput}\" height=\"${styleInput}\"/>",

	// tag: [protected] String
	//		Tag used for the link type (img).
	tag: "img",

	_getCurrentValues: function(img){
		// summary:
		//		Over-ride for getting the values to set in the dropdown.
		// a:
		//		The anchor/link to process for data for the dropdown.
		// tags:
		//		protected
		var url, text,style,height,width;
		if(img && img.tagName.toLowerCase() === this.tag){
			url = img.getAttribute('_djrealurl');
			// check for missing djrealurl get actual url
			var url2 = img.getAttribute('src');
			url  = url || url2;
			text = img.getAttribute('alt');
			style = img.getAttribute('style');
			height = img.getAttribute('height');
			width = img.getAttribute('width');
			dojo.withGlobal(this.editor.window,
				"selectElement", dijit._editor.selection, [img, true]);
		}else{
			text = dojo.withGlobal(this.editor.window, dijit._editor.selection.getSelectedText);
		}
		return {urlInput: url || 'http://', textInput: text || '', styleInput:style , heightInput:height,widthInput:width}; //Object;
	},

	_isValid: function(){
		// summary:
		//		Over-ride for images.  You can have alt text of blank, it is valid.
		// tags:
		//		protected
		return this._urlInput.isValid();
	},

	_connectTagEvents: function(){
		// summary:
		//		Over-ridable function that connects tag specific events.
		this.inherited(arguments);
		this.editor.onLoadDeferred.addCallback(dojo.hitch(this, function(){
			// Use onmousedown instead of onclick.  Seems that IE eats the first onclick
			// to wrap it in a selector box, then the second one acts as onclick.  See #10420
			this.connect(this.editor.editNode, "onmousedown", this._selectTag);
		}));
	},

	_selectTag: function(e){
		// summary:
		//		A simple event handler that lets me select an image if it is clicked on.
		//		makes it easier to select images in a standard way across browsers.  Otherwise
		//		selecting an image for edit becomes difficult.
		// e: Event
		//		The click event.
		// tags:
		//		private
		if(e && e.target){
			var t = e.target;
			var tg = t.tagName? t.tagName.toLowerCase() : "";
			if(tg === this.tag){
				dojo.withGlobal(this.editor.window,
					"selectElement",
					dijit._editor.selection, [t]);
			}
		}
	},

	_checkValues: function(args){
		// summary:
		//		Function to check the values in args and 'fix' them up as needed
		//		(special characters in the url or alt text)
		// args: Object
		//		Content being set.
		// tags:
		//		protected
		if(args && args.urlInput){
			args.urlInput = args.urlInput.replace(/"/g, "&quot;");
		}
		if(args && args.textInput){
			args.textInput = args.textInput.replace(/"/g, "&quot;");
		}
		if(args && args.styleInput){
			args.styleInput = args.styleInput.replace(/"/g, "&quot;");
		}

		return args;
	},
	updateState: function(){
		// summary:
		//		Change state of the plugin to respond to events in the editor.
		// description:
		//		This is called on meaningful events in the editor, such as change of selection
		//		or caret position (but not simple typing of alphanumeric keys).   It gives the
		//		plugin a chance to update the CSS of its button.
		//
		//		For example, the "bold" plugin will highlight/unhighlight the bold button depending on whether the
		//		characters next to the caret are bold or not.
		//
		//		Only makes sense when `useDefaultCommand` is true, as it calls Editor.queryCommandEnabled(`command`).
		var e = this.editor,
			c = this.command,
			checked, enabled;
		if(!e || !e.isLoaded || !c.length){ return; }
		if(this.button){
			try{
				enabled = e.queryCommandEnabled(c);
				enabled = true ;
				if(this.enabled !== enabled){
					this.enabled = enabled;
					this.button.set('disabled', !enabled);
				}
				if(typeof this.button.checked == 'boolean'){
					checked = e.queryCommandState(c);
					if(this.checked !== checked){
						this.checked = checked;
						this.button.set('checked', e.queryCommandState(c));
					}
				}
			}catch(e){
				console.log(e); // FIXME: we shouldn't have debug statements in our code.  Log as an error?
			}
		}
	},
	_initButton: function(){
		// Override _Plugin._initButton() to initialize DropDownButton and TooltipDialog.
		var _this = this;
		this.tag = 'img' ;
		var messages = dojo.mixin(dojo.i18n.getLocalization("dijit", "common", this.lang),
			dojo.i18n.getLocalization("prmax", "SeoImgLinkDialog", this.lang));
		var dropDown = (this.dropDown = new dijit.TooltipDialog({
			title: messages[this.command + "Title"],
			execute: dojo.hitch(this, "setValue"),
			onOpen: function(){
				_this._onOpenDialog();
				dijit.TooltipDialog.prototype.onOpen.apply(this, arguments);
			},
			onCancel: function(){
				setTimeout(dojo.hitch(_this, "_onCloseDialog"),0);
			}
		}));
		messages.urlRegExp = this.urlRegExp;
		messages.id = dijit.getUniqueId(this.editor.id);
		this._uniqueId = messages.id;
		this._setContent(dropDown.title +
			"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>" +
			dojo.string.substitute(this.linkDialogTemplate, messages));
		dropDown.startup();
		this._urlInput = dijit.byId(this._uniqueId + "_urlInput");
		this._textInput = dijit.byId(this._uniqueId + "_textInput");
		this._setButton = dijit.byId(this._uniqueId + "_setButton");


		this.connect( dijit.byId(this._uniqueId + "_loadThumbNail"), "onClick",
			function()
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: dojo.hitch( this, function()
							{ dojo.publish("/seo/thumbnail", []);
							}),
						url:"/emails/seorelease/link_to_thumbnail" ,
						content: {url:this._urlInput.get("value")}
				}))
			});

		this.connect(dijit.byId(this._uniqueId + "_cancelButton"), "onClick", function(){
			this.dropDown.onCancel();
		});
		if(this._urlInput){
			this.connect(this._urlInput, "onChange", "_checkAndFixInput");
		}
		if(this._textInput){
			this.connect(this._textInput, "onChange", "_checkAndFixInput");
		}
		this._connectTagEvents();
		if(this.command.length){
			var className = this.iconClassPrefix+" "+this.iconClassPrefix + this.command.charAt(0).toUpperCase() + this.command.substr(1);
			if(!this.button){
				var props = dojo.mixin({
					label: messages.label,
					showLabel: false,
					iconClass: className,
					dropDown: this.dropDown,
					tabIndex: "-1"
				}, this.params || {});
				this.button = new this.buttonClass(props);
			}
		}
	},
	_onDblClick: function(e){
		// summary:
		// 		Function to define a behavior on double clicks on the element
		//		type this dialog edits to select it and pop up the editor
		//		dialog.
		// e: Object
		//		The double-click event.
		// tags:
		//		protected.
		if(e && e.target){
			var t = e.target;
			var tg = t.tagName? t.tagName.toLowerCase() : "";
			if(tg === this.tag && dojo.attr(t,"src")){
				dojo.withGlobal(this.editor.window,
					 "selectElement",
					 dijit._editor.selection, [t]);
				this.editor.onDisplayChanged();
				setTimeout(dojo.hitch(this, function(){
					// Focus shift outside the event handler.
					// IE doesn't like focus changes in event handles.
					this.button.set("disabled", false);
					this.button.openDropDown();
				}), 10);
			}
		}
	}
});

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	switch(o.args.name){
		case "seoinsertimage":
			o.plugin = new prmax.editor.SeoImgLinkDialog({command: o.args.name});
			break;
	}
});