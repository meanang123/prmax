/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.email.emaileditorclear"]){dojo._hasResource["prmax.email.emaileditorclear"]=true;dojo.provide("prmax.email.emaileditorclear");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit._editor._Plugin");dojo.require("dijit.TooltipDialog");dojo.require("dijit.form.Button");dojo.require("dijit.form.ValidationTextBox");dojo.require("dojo.string");dojo.declare("prmax.email.emaileditorclear",dijit._editor._Plugin,{buttonClass:dijit.form.Button,useDefaultCommand:false,command:"clearEditor",_initButton:function(){if(!this.button){var _1=this.iconClassPrefix+" "+this.iconClassPrefix+this.command.charAt(0).toUpperCase()+this.command.substr(1);var _2=dojo.mixin({label:"Clear",tabIndex:"-1"},arguments||{});this.button=new dijit.form.Button(_2);this.connect(this.button,"onClick",this._tabIndent);}},_tabIndent:function(){this.editor.set("value","");}});dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){if(o.plugin){return;}switch(o.args.name){case "clearEditor":o.plugin=new prmax.email.emaileditorclear({command:o.args.name});}});}