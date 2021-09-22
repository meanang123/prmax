# -*- coding: utf-8 -*-
_version=1.6

from reportlab.platypus.paragraph import Paragraph
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import *
from reportlab.platypus import PageBreak,FrameBreak
from reportlab.platypus.tables import TableStyle
from reportlab.platypus.flowables import Spacer
from reportlab.graphics.shapes import Line

from listing_base import *
from pdf_base import *

Table=tables.Table

class ListingPDFError(Exception): pass

class ListingPDF(BasePDF):
    """Generates the PrintListing pdf from a list of Listing data
    """
    class ListingTemplate(PageTemplate) :
        """Listing tempate"""
        def __init__(self, parent, page_header) :
            """Initialise our page template."""
            # we must save a pointer to our parent somewhere
            self.parent = parent

            doc=parent.document

            frametop_height=1.1*cm
            col_height=doc.height-frametop_height
            col_width=doc.width/2.0

            self.main_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height)
            PageTemplate.__init__(self, "ListingTemplate",[self.main_frame])


        def beforeDrawPage(self, canvas, doc):
            self.parent.logoAndHeader(canvas,doc)


    def __init__(self,page_header,col_info,rows):
        """
            page_header is a dictionary, with at least values for
                 'shop_name'
                 'report_date'

            and should have values for:
                 'report_id'
                 'report_name'

            rows is a list of tuples containing the row and group header details
            col_info is a dictionary, with at least values for
                headers : tuple/list of the column headers on each page
                widths: tuple/list of the widths in cm of the columns
                ctypes: tuple/list of the ctypes for each colum

            Note there must be the same no of entries in each col_info value
            as there are columns

        """

        BasePDF.__init__(self,page_header)

        self.listing_template=self.ListingTemplate(self,page_header)
        self.document.addPageTemplates(self.listing_template)

        self.col_widths=map(in_cm,col_info['widths'])
        # size the last column to make all cols spread the width of the page
        self.col_widths[-1]=self.listing_template.main_frame.width-reduce (lambda x,y:x+y,self.col_widths[:-1])


        self.rows=self.validate_rows(rows,contains_marks=True) # list of marked rows
        #  make each col header a markedRow
        self.col_headers=[]
        for c in self.validate_rows(col_info['headers']):
            self.col_headers.append(MarkedRow(rwCOL_HEADER,c))

        self.ctypes=self.validate_rows([col_info['ctypes']],filler=ctSTRING)[0]

        #self.total_page_count=0
        self.objects = []
        self.current_group_header=None

        self.processListing()

    def __del__(self):
        print ("Do Clean")
        self.clean()

    def clean(self):
        try:
            del self.listing_template.main_frame
        except: pass
        try:
            del self.listing_template.parent
        except: pass
        try:
            del self.listing_template
        except: pass
        try:
            del self.rows
        except: pass


    def validate_rows(self,rows,filler='',contains_marks=False):
        # check that the rows are all of the same size:
        if len(rows)==0:
            return

        rowlen=len(self.col_widths)
        if contains_marks:
            rowlen+=1

        new_rows=[]
        for row in rows :

            if len(row)<rowlen:
                # add filler to the list to make up the difference
                row=list(row)
                for i in range(rowlen-len(row)):
                    row.append(filler)
            elif len(row)>rowlen:
                # truncate the row:
                row=row[:rowlen]

            new_rows.append(row)

        return new_rows


    def write(self,filename):
        # process all stuff, then write the report

        self.buildListing()

        self.document.build(self.objects)
        open(filename,'wb').write(self.report.getvalue())

    def stream(self):
        # process all stuff, then write the report

        self.buildListing()

        self.document.build(self.objects)
        return self.report.getvalue()

#-------------------------------------------------------------------------------

    def processListing(self):
        """Processes the Listing data ready for building"""
        # create the correct forms for LIST_NORMAL_STYLE & LIST_COL_HEADING_STYLE

        col_count=0
        args=[]
        for ctype in self.ctypes:
            if ctype in (ctAMOUNT,ctNUMBER):
                # add the ALIGN line for this column
                args.append(('ALIGN',(col_count,0),(col_count,-1),'RIGHT'))

            col_count+=1

        self.tstyle_col_heading=TableStyle(args+COL_HEADINGS_ARGS)
        self.tstyle_normal=TableStyle(args+NORMAL_ARGS)
        self.tstyle_normal_background =(args+NORMAL_BACKGROUND_ARGS)
        self.tstyle_heading_row =TableStyle(NORMAL_HEADING_ARGS)

    def build_init(self):
        linecount=0
        page_rows=[]

        return linecount,page_rows

    def buildListing(self):
        "builds the individual Listing pages"
        # do the header:
        # block the report into page-size chunks:
        linecount,page_rows=self.build_init()
        if self.page_header.has_key("landscape"):
            max_lines = MAX_LINES_LANDSCAPE
        else:
            max_lines = MAX_LINES
        max_lines-= (len(self.col_headers)+1)

        for row in self.rows:
            mark=row[0]
            row=row[1:]
            marked_row=MarkedRow(mark,row)

            # do stuff to stop a widowed group header
            # ie throw a new page prior to the about-to-be-written group header
            if mark==rwGROUP_HEADER and linecount>max_lines-1:
                self.current_group_header=None
                self.write_page(page_rows)
                linecount,page_rows=self.build_init()
            # normal case for testing for EOP
            elif linecount>max_lines:
                self.write_page(page_rows)
                linecount,page_rows=self.build_init()

            page_rows.append(marked_row)
            linecount+=1

        self.write_page(page_rows)


    def write_page(self,marked_rows):

        if not marked_rows: return

        # write a blank table with the TOP_COL_HEADING_ARGS, to get a nice
        # thick black line

        rowheights=(TOP_COL_HEADER_ROW_HEIGHT,)
        null_headers=[('',)*len(self.col_widths) ]
        self.append(Table(null_headers,self.col_widths,rowheights,TableStyle(TOP_COL_HEADINGS_ARGS)))

        if self.col_headers:

            rowheights=(COL_HEADER_ROW_HEIGHT,)*len(self.col_headers)
            ts=self.rowTable(self.col_headers,rowheights,self.tstyle_col_heading)

            self.extend(ts)
            self.append(Spacer(0,3))

        # if there's been a group header in action, write a contd,
        #unless the first row is a (new) group header:
        mrow=marked_rows[0]

        if mrow.mark<>rwGROUP_HEADER and self.current_group_header:
            rowheights=(NORMAL_ROW_HEIGHT,)
            mrow=self.current_group_header
            mrow.row=list(mrow.row)
            if not mrow.row[0].endswith("(cont'd)"):
                mrow.row[0]=mrow.row[0]+" (cont'd)"
            ts=self.rowTable([mrow],rowheights,self.tstyle_normal)
            self.extend(ts)

        rowheights=(NORMAL_ROW_HEIGHT,)*len(marked_rows)
        ts = self.rowTable(marked_rows, rowheights, self.tstyle_normal)
        self.extend(ts)

        self.newPage()

    def null_line(self,height,ts_args=[]):
        rowheights=(height,)
        null_headers=[('',)*len(self.col_widths)]

    def append(self, object) :
        """Appends an object to our platypus "story" (using ReportLab's terminology)."""
        self.objects.append(object)

    def extend(self,objects):
        self.objects.extend(objects)

    def rowTable(self,marked_rows, rowheights, TABLE_STYLE):

        def addEntry(ts,mark,trows,rowheights,TABLE_STYLE):
            t = TABLE_STYLE
            if trows:
                if mark==rwNORMAL:
                    tables.CellStyle=CellStyleNormal
                elif mark==rwNORMALBACKGROUND:
                    tables.CellStyle=CellStyleNormal
                    t = self.tstyle_normal_background
                elif mark == rwCOL_HEADER:
                    tables.CellStyle=CellStyleColHeader
                elif mark in (rwGROUP_HEADER,rwSUBTOTAL,rwTOTAL):
                    tables.CellStyle=CellStyleGroupHeader
                elif mark in ( rwHEADING,):
                    t = self.tstyle_heading_row
                    tables.CellStyle=CellStyleHeading
                elif mark==rwNOTRIM:
                    tables.CellStyle=CellStyleNormal
                else:
                    e='Invalid Mark: %s' % mark
                    raise Exception,e

                ts.append(Table(trows,self.col_widths,rowheights[:len(trows)],t))
            return ts

        ts=[]

        trows=[]
        current_mark=None
        for mrow in marked_rows:
            mark=mrow.mark
            if mark<>current_mark:
                if trows:
                    ts=addEntry(ts,current_mark,trows,rowheights,TABLE_STYLE)
                    trows=[]
                current_mark=mark

            row=mrow.row
            tr=[]
            if mark in (rwNORMAL,rwSUBTOTAL,rwTOTAL,rwHEADING,rwNORMALBACKGROUND, rwNOTRIM):

                cell_pos=0 # position of cell

                for cell in row:
                    # format the cell
                    t=format_ctype(cell,mark,self.ctypes[cell_pos],self.col_widths[cell_pos],NORMAL_FONT,NORMAL_FONT_SIZE)
                    tr.append(t)
                    cell_pos+=1


            elif mark==rwGROUP_HEADER:
                self.current_group_header=mrow
                tr=row

            elif mark==rwCOL_HEADER:
                tr=row

            if mark==rwTOTAL:
                # add a blank line before
                trows.append(('',)*len(self.col_widths))

            trows.append(tr)

            if mark in (rwTOTAL,rwSUBTOTAL):
                # ad a blank line afterwards
                trows.append(('',)*len(self.col_widths))

        ts=addEntry(ts,current_mark,trows,rowheights,TABLE_STYLE)

        return ts

