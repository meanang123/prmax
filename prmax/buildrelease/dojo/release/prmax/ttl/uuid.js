/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.uuid"]){dojo._hasResource["ttl.uuid"]=true;dojo.provide("ttl.uuid");function UUID(){this.id=this.createUUID();};UUID.prototype.valueOf=function(){return this.id;};UUID.prototype.toString=function(){return this.id;};UUID.prototype.createUUID=function(){var dg=new Date(1582,10,15,0,0,0,0);var dc=new Date();var t=dc.getTime()-dg.getTime();var h="-";var tl=this.getIntegerBits(t,0,31);var tm=this.getIntegerBits(t,32,47);var _1=this.getIntegerBits(t,48,59)+"1";var _2=this.getIntegerBits(this.rand(4095),0,7);var _3=this.getIntegerBits(this.rand(4095),0,7);var n=this.getIntegerBits(this.rand(8191),0,7)+this.getIntegerBits(this.rand(8191),8,15)+this.getIntegerBits(this.rand(8191),0,7)+this.getIntegerBits(this.rand(8191),8,15)+this.getIntegerBits(this.rand(8191),0,15);return tl+h+tm+h+_1+h+_2+_3+h+n;};UUID.prototype.getIntegerBits=function(_4,_5,_6){var _7=this.returnBase(_4,16);var _8=new Array();var _9="";var i=0;for(i=0;i<_7.length;i++){_8.push(_7.substring(i,i+1));}for(i=Math.floor(_5/4);i<=Math.floor(_6/4);i++){if(!_8[i]||_8[i]==""){_9+="0";}else{_9+=_8[i];}}return _9;};UUID.prototype.returnBase=function(_a,_b){return (_a).toString(_b).toUpperCase();};UUID.prototype.rand=function(_c){return Math.floor(Math.random()*(_c+1));};TTL.UUID=UUID;}