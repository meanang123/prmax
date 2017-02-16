# A JSON-based API(view) for your app.
# Most rules would look like:
# @jsonify.when("isinstance(obj, YourClass)")
# def jsonify_yourclass(obj):
#     return [obj.val1, obj.val2]
# @jsonify can convert your objects to following types:
# lists, dicts, numbers and strings
# -*- coding: utf-8 -*-

from turbojson.jsonify import jsonify
from datetime import time

from prcommon.model import AdvanceFeature, Task

@jsonify.when("isinstance(obj, time)")
def jsonify_time(obj):
	"""sonify_time"""
	return str(obj)


@jsonify.when("isinstance(obj, AdvanceFeature)")
def jsonify_AdvanceFeature(obj):
	"""sonify_time"""
	return jsonify(obj)

@jsonify.when("isinstance(obj, Task)")
def jsonify_Task(obj):
	"""sonify_time"""
	return jsonify(obj)

