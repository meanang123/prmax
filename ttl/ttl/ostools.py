# -*- coding: utf-8 -*-
import os 

def del_tree(root):
   for path, dirs, files in os.walk(root, False):
      for fn in files:
         os.unlink(os.path.join(path, fn))
      for dn in dirs:
         os.rmdir(os.path.join(path, dn))
   os.rmdir(root)