from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfgen import canvas
from pathlib import Path

OUT = Path('docs/GreenGPT_Free_Version_Product_Workflow.pdf')
PAGE_W, PAGE_H = letter
MARGIN = 0.52 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

forest = colors.HexColor('#12352B')
emerald = colors.HexColor('#1F7A5C')
sage = colors.HexColor('#6C8C7A')
gold = colors.HexColor('#B68A2C')
bone = colors.HexColor('#F7F4EC')
ink = colors.HexColor('#1F2A24')
muted = colors.HexColor('#5F6F68')
line = colors.HexColor('#D8DDD6')
soft = colors.HexColor('#EEF4EF')
white = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle('Kicker', fontName='Helvetica-Bold', fontSize=8, leading=9.5, textColor=gold, alignment=TA_CENTER, spaceAfter=5))
styles.add(ParagraphStyle('TitleCustom', fontName='Helvetica-Bold', fontSize=22, leading=25, textColor=forest, alignment=TA_CENTER, spaceAfter=5))
styles.add(ParagraphStyle('SubTitleCustom', fontName='Helvetica', fontSize=9.2, leading=12.3, textColor=muted, alignment=TA_CENTER, spaceAfter=10))
styles.add(ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=11.5, leading=13.5, textColor=forest, spaceBefore=4, spaceAfter=5))
styles.add(ParagraphStyle('BodyCustom', fontName='Helvetica', fontSize=8.6, leading=11.5, textColor=ink, spaceAfter=4))
styles.add(ParagraphStyle('BodyMuted', fontName='Helvetica', fontSize=7.8, leading=10.1, textColor=muted, spaceAfter=3))
styles.add(ParagraphStyle('StepNum', fontName='Helvetica-Bold', fontSize=8.7, leading=10, textColor=white, alignment=TA_CENTER))
styles.add(ParagraphStyle('StepTitle', fontName='Helvetica-Bold', fontSize=9.0, leading=10.7, textColor=forest, spaceAfter=1))
styles.add(ParagraphStyle('StepBody', fontName='Helvetica', fontSize=7.8, leading=10.0, textColor=ink, spaceAfter=0))
styles.add(ParagraphStyle('CellHead', fontName='Helvetica-Bold', fontSize=8.0, leading=9.8, textColor=forest))
styles.add(ParagraphStyle('Cell', fontName='Helvetica', fontSize=7.75, leading=9.8, textColor=ink))
styles.add(ParagraphStyle('Callout', fontName='Helvetica-Bold', fontSize=8.3, leading=10.6, textColor=forest, alignment=TA_CENTER))

def P(text, style='BodyCustom'):
    return Paragraph(text, styles[style])

def draw_footer(canv: canvas.Canvas, doc):
    canv.saveState()
    canv.setStrokeColor(line)
    canv.setLineWidth(0.5)
    canv.line(MARGIN, 0.41 * inch, PAGE_W - MARGIN, 0.41 * inch)
    canv.setFont('Helvetica', 7.0)
    canv.setFillColor(muted)
    canv.drawCentredString(PAGE_W / 2, 0.25 * inch, 'GreenGPT free-version tester workflow | greengptadvisory.com')
    canv.restoreState()

def step(n, title, body):
    num = Table([[P(str(n), 'StepNum')]], colWidths=[0.28*inch], rowHeights=[0.28*inch])
    num.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), emerald),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOX', (0,0), (-1,-1), 0, emerald),
        ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    t = Table([[num, [P(title, 'StepTitle'), P(body, 'StepBody')]]], colWidths=[0.40*inch, CONTENT_W - 0.40*inch])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t

def checklist(items):
    data = [[P('[ ]', 'CellHead'), P(item, 'Cell')] for item in items]
    t = Table(data, colWidths=[0.30*inch, CONTENT_W - 0.30*inch])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 3), ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LINEBELOW', (0,0), (-1,-2), 0.35, line),
    ]))
    return t

story = []
story.append(P('FREE VERSION TESTER GUIDE', 'Kicker'))
story.append(P('GreenGPT Product Workflow', 'TitleCustom'))
story.append(P('A one-page path for checking whether the EHS compliance calendar is useful enough to keep building around.', 'SubTitleCustom'))

intro = Table([[P('<b>Test goal:</b> Does the free experience help a facility team move from spreadsheet-style deadline tracking to a clearer, profile-based compliance calendar?', 'BodyCustom')]], colWidths=[CONTENT_W])
intro.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), bone), ('BOX', (0,0), (-1,-1), 0.7, line),
    ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7),
]))
story.append(intro)
story.append(Spacer(1, 8))

story.append(P('Test Workflow', 'Section'))
story.append(step(1, 'Open the product and start free.', 'Go to <b>greengptadvisory.com</b> and choose the free calendar workflow.'))
story.append(step(2, 'Enter a realistic facility profile.', 'Select the closest industry, jurisdiction, and free facility flags: hazardous materials, air permits, wastewater/NPDES, or hazardous waste generation.'))
story.append(step(3, 'Generate the compliance calendar.', 'Review the obligations, timing, frequency, authority, and citation context.'))
story.append(step(4, 'Judge trust and usefulness.', 'Would an EHS manager understand why each item appears? Are the results specific enough to prompt action?'))
story.append(step(5, 'Send focused feedback.', 'Share what worked, what felt wrong or missing, and whether this would save time compared with your current process.'))

story.append(P('Free Version Scope', 'Section'))
scope = Table([[P('<b>Included:</b> federal EHS calendar generation, core facility flags, obligation names, due timing, frequency, authority, and citation context.<br/><br/><b>Not required for this test:</b> Pro features such as state-specific rules, additional hazard flags, .ics export, email reminders, CFR citation links, and document attachments.', 'BodyCustom')]], colWidths=[CONTENT_W])
scope.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), soft), ('BOX', (0,0), (-1,-1), 0.7, line),
    ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7),
]))
story.append(scope)
story.append(Spacer(1, 7))

story.append(P('Feedback Prompts', 'Section'))
story.append(checklist([
    'Did the workflow make sense without explanation?',
    'Did the generated calendar surface obligations you would actually review or act on?',
    'Were any deadlines, labels, or assumptions unclear, wrong, or too generic?',
    'Would this save time compared with your spreadsheet, reminders, or manual research?',
    'What one feature would make you more likely to keep using it?'
]))

story.append(Spacer(1, 8))
close = Table([[P('Most useful feedback includes: industry, state, facility type, what you selected, what appeared, and what you expected instead.', 'Callout')]], colWidths=[CONTENT_W])
close.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), soft), ('BOX', (0,0), (-1,-1), 0.7, sage),
    ('LEFTPADDING', (0,0), (-1,-1), 9), ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7),
]))
story.append(close)

pdf = BaseDocTemplate(str(OUT), pagesize=letter, rightMargin=MARGIN, leftMargin=MARGIN, topMargin=0.50*inch, bottomMargin=0.54*inch, title='GreenGPT Free Version Product Workflow')
frame = Frame(MARGIN, 0.48*inch, CONTENT_W, PAGE_H - 0.98*inch, id='normal')
pdf.addPageTemplates([PageTemplate(id='main', frames=[frame], onPage=draw_footer)])
pdf.build(story)
print(OUT.resolve())
