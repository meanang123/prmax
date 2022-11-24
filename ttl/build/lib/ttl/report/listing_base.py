# -*- coding: utf-8 -*-
# the path to the LOGO_FILE assumes that Listing_pdf.py
# is located in the Hnd directory under Products

from reportlab.platypus import tables

from reportlab.lib.styles import *
from reportlab.lib.enums import TA_RIGHT,TA_CENTER
from reportlab.platypus.tables import TableStyle
from reportlab.lib import colors

MAX_LINES=71
MAX_LINES_LANDSCAPE=47

NORMAL_ROW_HEIGHT=10
COL_HEADER_ROW_HEIGHT=10
TOP_COL_HEADER_ROW_HEIGHT=10

NORMAL_FONT='Helvetica'
NORMAL_FONT_SIZE=8


# page header
##PAGE_HEADER_FONT_TYPE='Helvetica-Bold'
##PAGE_HEADER_FONT_SIZE=18
##FONT_SIZE_HEADER2=14



# column headings

TOP_COL_HEADINGS_ARGS=[('LINEABOVE', (0,0), (-1,0), 2, colors.black),]

COL_HEADINGS_ARGS=[
                    ('VALIGN',(0,0),(-1,-1),'BOTTOM'),
                    ('LINEBELOW',(0,-1), (-1,-1), .3, colors.black),
                  ]
NORMAL_ARGS=[
    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ]

NORMAL_BACKGROUND_ARGS=[
    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ('BACKGROUND',(0,0),(-1,-1),colors.lightgrey),
    ]



NORMAL_HEADING_ARGS=[
    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ('BACKGROUND',(0,0),(-1,-1),colors.lightgrey),
]

##GROUP_PARA=ParagraphStyle(name='Group',
##                          fontName='Helvetica-Bold',
##                          fontSize=11,
##                          leading=0)


class CellStyleNormal(tables.PropertySet):
    fontname = NORMAL_FONT #"Times-Roman"
    fontsize = NORMAL_FONT_SIZE
    leading = 12
    leftPadding = 1
    rightPadding = 1
    topPadding = 3
    bottomPadding = 0 #3
    firstLineIndent = 0
    color = colors.black
    alignment = 'LEFT'
    background = (1,1,1)
    valign = "BOTTOM"
    href=None
    destination=None

    def __init__(self, name, parent=None):
        self.name = name
        if parent is not None:
            parent.copy(self)
    def copy(self, result=None):
        if result is None:
            result = CellStyleNormal()
        for name in dir(self):
            setattr(result, name, gettattr(self, name))
        return result

class CellStyleColHeader(CellStyleNormal):
    fontname = "Helvetica-Bold"
    #fontsize = 12

class CellStyleGroupHeader(CellStyleNormal):
    fontname = "Helvetica-Bold"

class CellStyleHeading(CellStyleNormal):
    pass

