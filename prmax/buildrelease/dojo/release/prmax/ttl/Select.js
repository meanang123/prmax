/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.Select"]){dojo._hasResource["ttl.Select"]=true;dojo.provide("ttl.Select");dojo.require("dijit.form._FormWidget");dojo.declare("ttl.Select",dijit.form._FormWidget,{size:1,templateString:"<select dojoAttachPoint='containerNode,focusNode' dojoAttachEvent='onchange: _onChange'></select>",attributeMap:dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),{size:"focusNode"}),addSelected:function(_1){_1.getSelected().forEach(function(n){this.containerNode.appendChild(n);},this);},getSelected:function(){return dojo.query("option",this.containerNode).filter(function(n){return n.selected;});},_getValueDeprecated:false,getValue:function(){return this.getSelected().map(function(n){return n.value;});},_multiValue:false,setValue:function(_2){dojo.query("option",this.containerNode).forEach(function(n){n.selected=(dojo.indexOf(_2,n.value)!=-1);});},invertSelection:function(_3){dojo.query("option",this.containerNode).forEach(function(n){n.selected=!n.selected;});this._handleOnChange(this.getValue(),_3==true);},_onChange:function(e){this._handleOnChange(this.getValue(),true);},resize:function(_4){if(_4){dojo.marginBox(this.domNode,_4);}},postCreate:function(){this._onChange();}});}