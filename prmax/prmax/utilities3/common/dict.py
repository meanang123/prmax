# -*- coding: utf-8 -*-


validItems = (tuple, list, int, str)

class DictExt(dict):
	"""A dictionary with attribute-style access. It maps attribute access to
	the real dictionary.  """
	def __init__(self, init={}):
		dict.__init__(self, init)

	def __getstate__(self):
		return self.__dict__.items()

	def __setstate__(self, items):
		for key, val in items:
			self.__dict__[key] = val

	def __repr__(self):
		return "%s(%s)" % (self.__class__.__name__, dict.__repr__(self))

	def __setitem__(self, key, value):
		return super(DictExt, self).__setitem__(key, value)

	def __getitem__(self, name):
		return super(DictExt, self).__getitem__(name)

	def __delitem__(self, name):
		return super(DictExt, self).__delitem__(name)

	__getattr__ = __getitem__
	__setattr__ = __setitem__

	def copy(self):
		ch = DictExt(self)
		return ch


# create a dict from a module
def createModuleDict(modname):
	ndict = DictExt()
	for item in modname:
		if type(modname[item]) in validItems:
			ndict[item] = modname[item]

	return ndict

