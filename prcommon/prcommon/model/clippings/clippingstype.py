# -*- coding: utf-8 -*-
"""ClippingsType Record """
#-----------------------------------------------------------------------------
# Name:        clippingstype.py
# Purpose:
# Author:      
# Created:     June 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsType(object):
 "ClippingsType"

 ListData = """
		SELECT
		clippingstypeid,
        clippingstypeid AS id,
		clippingstypedescription
		FROM internal.clippingstype """

 ListDataCount = """
		SELECT COUNT(*) FROM  internal.clippingstype """

 def __json__(self):
  """to json"""

  return dict (
   clippingstypeid = self.clippingstypeid,
   clippingstypedescription = self.clippingstypedescription) 
 
 @classmethod
 def get_list(cls, params):
  """ get a lookup list """
  def _convert(data):
   """"local convert"""
   return dict(
    clippingstypeid = row.clippingstypeid,
    clippingstypedescription = row.clippingstypedescription)

  data = [ _convert( row ) for row in session.query( ClippingsType ).order_by( ClippingsType.clippingstypedescription).all()]

  return data 
 @classmethod
 def get_user_selection(cls, params):
  """ get a list of clippings types """
 
  word = params["word"]
  if word == "*":
   word = ""
  word = word + "%"	  
  
  
  return session.query(
   ClippingsType.mapping.c.clippingstypedescription,
   ClippingsType.mapping.c.clippingstypeid).\
         filter( ClippingsType.mapping.c.clippingstypedescription.ilike(word + "%")).order_by(ClippingsType.mapping.c.clippingstypedescription).all()


ClippingsType.mapping = Table('clippingstype', metadata, autoload=True, schema="internal")

mapper(ClippingsType, ClippingsType.mapping)