/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare"],function(_1){return _1("ttl.Amduuid",null,{createUUID:function(){var dg=new Date(1582,10,15,0,0,0,0);var dc=new Date();var t=dc.getTime()-dg.getTime();var h="-";var tl=this.getIntegerBits(t,0,31);var tm=this.getIntegerBits(t,32,47);var _2=this.getIntegerBits(t,48,59)+"1";var _3=this.getIntegerBits(this.rand(4095),0,7);var _4=this.getIntegerBits(this.rand(4095),0,7);var n=this.getIntegerBits(this.rand(8191),0,7)+this.getIntegerBits(this.rand(8191),8,15)+this.getIntegerBits(this.rand(8191),0,7)+this.getIntegerBits(this.rand(8191),8,15)+this.getIntegerBits(this.rand(8191),0,15);return tl+h+tm+h+_2+h+_3+_4+h+n;},getIntegerBits:function(_5,_6,_7){var _8=this.returnBase(_5,16);var _9=new Array();var _a="";var i=0;for(i=0;i<_8.length;i++){_9.push(_8.substring(i,i+1));}for(i=Math.floor(_6/4);i<=Math.floor(_7/4);i++){if(!_9[i]||_9[i]==""){_a+="0";}else{_a+=_9[i];}}return _a;},returnBase:function(_b,_c){return (_b).toString(_c).toUpperCase();},rand:function(_d){return Math.floor(Math.random()*(_d+1));}});});