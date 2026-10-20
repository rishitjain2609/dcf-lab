"""Builds the downloadable Excel DCF for each published model.

Every number on the DCF, Sensitivity and Historicals sheets is a live formula
that traces back to the Inputs sheet, so a reader can change an assumption and
watch the implied value move. Run from the repo root:

    python3 scripts/build_model_workbooks.py

Outputs land in public/downloads/, which models.json links to as `excelUrl`.
"""

from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "downloads"

FONT = "Arial"
BLUE = "0000FF"  # hardcoded inputs
GREEN = "008000"  # links to another sheet
YELLOW = PatternFill("solid", fgColor="FFFF00")  # key assumptions
HEAD_FILL = PatternFill("solid", fgColor="133621")
SUB_FILL = PatternFill("solid", fgColor="EDEDE6")
THIN = Side(style="thin", color="999999")
TOP_RULE = Border(top=THIN)

PCT = '0.0%;(0.0%);"-"'

MODELS = [
    {
        "slug": "nike",
        "company": "Nike Inc",
        "ticker": "NYSE: NKE",
        "unit": "$ millions",
        "share_unit": "millions",
        "money": '#,##0;(#,##0);"-"',
        "per_share": '"$"0.00',
        "base_label": "FY25",
        "history": [("FY21", 44538), ("FY22", 46710), ("FY23", 51217), ("FY24", 51362), ("FY25", 46309)],
        "years": 5,
        "inputs": {
            "growth_start": 0.03,
            "growth_end": 0.03,
            "margin_start": 0.097,
            "margin_end": 0.097,
            "da": 0.0167,
            "capex": 0.0093,
            "nwc": 0.02,
            "tax": 0.171,
            "wacc": 0.08,
            "tg": 0.025,
            "net_debt": 502,
            "shares": 1487.6,
            "price": 37.21,
        },
        "capm": None,
        "published": 43.18,
        "sources": [
            "Revenue FY21-FY25, EBITDA margin, D&A, capex and tax rate: Nike FY2025 Form 10-K (fiscal year ended May 31, 2025), SEC EDGAR.",
            "Net debt, diluted shares, share price: stockanalysis.com, close of Oct 19, 2026.",
            "Growth path, WACC and terminal growth: this model's own estimates.",
        ],
        "notes": {
            "growth_start": "Model estimate. Held flat at 3% a year: no turnaround assumed.",
            "margin_start": "FY25 EBITDA margin from the 10-K: operating income $3.7B plus $775M D&A, over $46.3B revenue.",
            "da": "FY25 D&A of $775M over revenue, Nike 10-K.",
            "capex": "FY25 capital expenditure over revenue, Nike 10-K.",
            "nwc": "Model estimate: working capital absorbs 2% of each year's revenue increase.",
            "tax": "FY25 effective tax rate, Nike 10-K.",
            "wacc": "Model estimate.",
            "tg": "Model estimate, roughly long-run US nominal growth.",
            "net_debt": "Total debt less cash and short-term investments, stockanalysis.com.",
            "shares": "Diluted shares, stockanalysis.com.",
            "price": "Close of Oct 19, 2026, stockanalysis.com.",
        },
    },
    {
        "slug": "zomato",
        "company": "Zomato Ltd (Eternal Limited)",
        "ticker": "NSE: ETERNAL",
        "unit": "₹ crore",
        "share_unit": "crore",
        "money": '#,##0;(#,##0);"-"',
        "per_share": '"₹"0.00',
        "base_label": "FY25",
        "history": [("FY21", 1994), ("FY22", 4192), ("FY23", 7079), ("FY24", 12114), ("FY25", 20243)],
        "years": 10,
        "inputs": {
            "growth_start": 0.30,
            "growth_end": 0.08,
            "margin_start": 0.06,
            "margin_end": 0.20,
            "da": 0.0426,
            "capex": 0.046,
            "nwc": 0.02,
            "tax": 0.244,
            "wacc": 0.12,
            "tg": 0.05,
            "net_debt": -16779,
            "shares": 958,
            "price": 322.55,
        },
        "capm": {"rf": 0.065, "beta": 1.1, "erp": 0.05},
        "published": 105.15,
        "sources": [
            "Revenue FY21-FY25 and D&A: Eternal Limited FY25 annual report (year ended March 31, 2025), via screener.in.",
            "Cash balance ₹18,824 cr at March 31, 2025: Eternal Q4 FY25 shareholder letter. Total debt ₹2,045 cr: stockanalysis.com.",
            "Diluted shares: FY25 net profit divided by diluted EPS. Share price: close of Oct 19, 2026, screener.in.",
            "Growth and margin path, capex %, WACC and terminal growth: this model's own estimates.",
        ],
        "notes": {
            "growth_start": "Model estimate. Year 1 growth; slows in equal steps to the final-year rate.",
            "growth_end": "Model estimate. Growth in the last forecast year.",
            "margin_start": "Model estimate, a little above FY25's 3-5% as the business scales.",
            "margin_end": "Model estimate for a mature food delivery and quick commerce business.",
            "da": "FY25 D&A over revenue, FY25 annual report.",
            "capex": "Model estimate.",
            "nwc": "Model estimate: working capital absorbs 2% of each year's revenue increase.",
            "tax": "Indian corporate tax rate used in the model.",
            "wacc": "Equals the cost of equity from the CAPM check below; Eternal has almost no debt.",
            "tg": "Model estimate, roughly long-run Indian nominal GDP growth.",
            "net_debt": "Negative means net cash: ₹2,045 cr debt minus ₹18,824 cr cash balance.",
            "shares": "FY25 net profit divided by diluted EPS.",
            "price": "Close of Oct 19, 2026, screener.in.",
        },
    },
]

# Row of each input on the Inputs sheet, in display order.
INPUT_ROWS = [
    ("growth_start", "Revenue growth, year 1", PCT, True),
    ("growth_end", "Revenue growth, final year", PCT, True),
    ("margin_start", "EBITDA margin, year 1", PCT, True),
    ("margin_end", "EBITDA margin, final year", PCT, True),
    ("da", "D&A, % of revenue", PCT, False),
    ("capex", "Capex, % of revenue", PCT, False),
    ("nwc", "Increase in working capital, % of revenue increase", PCT, False),
    ("tax", "Tax rate", PCT, False),
    ("wacc", "WACC (discount rate)", PCT, True),
    ("tg", "Terminal growth rate", PCT, True),
    ("net_debt", "Net debt (negative = net cash)", None, False),
    ("shares", "Diluted shares", '#,##0.0', False),
    ("price", "Share price at publish", None, False),
]
FIRST_INPUT_ROW = 6


def font(bold=False, color="000000", size=10, italic=False):
    return Font(name=FONT, bold=bold, color=color, size=size, italic=italic)


def title(ws, text, sub):
    ws["A1"] = text
    ws["A1"].font = font(bold=True, size=14)
    ws["A2"] = sub
    ws["A2"].font = font(italic=True, color="555555")


def header_row(ws, row, values, start_col=1):
    for i, v in enumerate(values):
        c = ws.cell(row=row, column=start_col + i, value=v)
        c.font = font(bold=True, color="FFFFFF")
        c.fill = HEAD_FILL
        c.alignment = Alignment(horizontal="center" if i else "left")


def build(m):
    wb = Workbook()
    unit = m["unit"]
    n = m["years"]
    hist = m["history"]

    # ---------------- Inputs ----------------
    inp = wb.active
    inp.title = "Inputs"
    title(inp, f"{m['company']} DCF: inputs", f"All money in {unit}; shares in {m['share_unit']}. Blue cells are inputs you can change.")
    inp["A4"] = "Base year revenue"
    inp["A4"].font = font(bold=True)
    inp["B4"] = f"=Historicals!C{3 + len(hist)}"
    inp["B4"].font = font(color=GREEN)
    inp["B4"].number_format = m["money"]
    inp["C4"] = f"{m['base_label']} revenue, linked from the Historicals sheet."
    inp["C4"].font = font(italic=True, color="555555")

    header_row(inp, 5, ["Assumption", "Value", "Source / note"])
    ref = {}
    for i, (key, label, fmt, key_assumption) in enumerate(INPUT_ROWS):
        r = FIRST_INPUT_ROW + i
        inp.cell(row=r, column=1, value=label).font = font()
        c = inp.cell(row=r, column=2, value=m["inputs"][key])
        c.font = font(color=BLUE)
        c.number_format = fmt or (m["per_share"] if key == "price" else m["money"])
        if key_assumption:
            c.fill = YELLOW
        note = m["notes"].get(key, m["notes"].get(key.replace("_end", "_start"), ""))
        inp.cell(row=r, column=3, value=note).font = font(italic=True, color="555555")
        ref[key] = f"Inputs!$B${r}"

    r = FIRST_INPUT_ROW + len(INPUT_ROWS) + 1
    inp.cell(row=r, column=1, value="Forecast years").font = font()
    inp.cell(row=r, column=2, value=f"=COUNT(DCF!D5:{get_column_letter(3 + n)}5)").font = font(color=GREEN)
    inp.cell(row=r, column=3, value="Counted from the DCF sheet's year row.").font = font(italic=True, color="555555")
    ref["n"] = f"Inputs!$B${r}"

    if m["capm"]:
        r += 2
        header_row(inp, r, ["WACC cross-check (CAPM)", "Value", "Note"])
        rows = [
            ("Risk-free rate (10-yr G-sec)", m["capm"]["rf"], PCT, "Approximate 10-year Indian government bond yield."),
            ("Beta", m["capm"]["beta"], "0.00", "Model estimate."),
            ("Equity risk premium", m["capm"]["erp"], PCT, "Model estimate for India."),
        ]
        for j, (label, val, fmt, note) in enumerate(rows, start=1):
            inp.cell(row=r + j, column=1, value=label).font = font()
            c = inp.cell(row=r + j, column=2, value=val)
            c.font = font(color=BLUE)
            c.number_format = fmt
            inp.cell(row=r + j, column=3, value=note).font = font(italic=True, color="555555")
        ke = r + 4
        inp.cell(row=ke, column=1, value="Cost of equity = Rf + Beta x ERP").font = font(bold=True)
        c = inp.cell(row=ke, column=2, value=f"=B{r + 1}+B{r + 2}*B{r + 3}")
        c.font = font(bold=True)
        c.number_format = PCT
        inp.cell(row=ke, column=3, value="Compare with the WACC input above.").font = font(italic=True, color="555555")

    inp.column_dimensions["A"].width = 48
    inp.column_dimensions["B"].width = 14
    inp.column_dimensions["C"].width = 90

    # ---------------- Historicals ----------------
    hs = wb.create_sheet("Historicals")
    title(hs, f"{m['company']}: revenue history", f"{unit}")
    header_row(hs, 3, ["Fiscal year", "", "Revenue", "Growth vs prior year"])
    for i, (label, rev) in enumerate(hist):
        r = 4 + i
        hs.cell(row=r, column=1, value=label).font = font()
        c = hs.cell(row=r, column=3, value=rev)
        c.font = font(color=BLUE)
        c.number_format = m["money"]
        if i:
            g = hs.cell(row=r, column=4, value=f"=C{r}/C{r - 1}-1")
            g.font = font()
            g.number_format = PCT
    last = 3 + len(hist)
    hs.cell(row=last + 2, column=1, value=f"{len(hist) - 1}-year revenue CAGR").font = font(bold=True)
    c = hs.cell(row=last + 2, column=4, value=f"=(C{last}/C4)^(1/{len(hist) - 1})-1")
    c.font = font(bold=True)
    c.number_format = PCT
    hs.cell(row=last + 4, column=1, value="Source: " + m["sources"][0]).font = font(italic=True, color="555555")
    hs.column_dimensions["A"].width = 26
    hs.column_dimensions["C"].width = 14
    hs.column_dimensions["D"].width = 22

    # ---------------- DCF ----------------
    ws = wb.create_sheet("DCF")
    title(ws, f"{m['company']}: discounted cash flow", f"{unit}, except per-share figures. End-of-year discounting.")
    first = 4  # column D = forecast year 1
    lastc = get_column_letter(3 + n)
    cols = [get_column_letter(first + i) for i in range(n)]
    header_row(ws, 3, ["Line item", "Base"] + [""] * 0, start_col=1)
    ws.cell(row=3, column=3, value=m["base_label"]).font = font(bold=True, color="FFFFFF")
    ws.cell(row=3, column=3).fill = HEAD_FILL
    ws.cell(row=3, column=2).value = ""
    for i, col in enumerate(cols):
        c = ws[f"{col}3"]
        c.value = f"Year {i + 1}"
        c.font = font(bold=True, color="FFFFFF")
        c.fill = HEAD_FILL
        c.alignment = Alignment(horizontal="center")

    labels = {
        5: "Year (t)",
        7: "Revenue growth",
        8: "Revenue",
        9: "EBITDA margin",
        10: "EBITDA",
        11: "Less D&A",
        12: "EBIT",
        13: "Less tax on EBIT",
        14: "NOPAT",
        15: "Plus D&A",
        16: "Less capex",
        17: "Less increase in working capital",
        18: "Unlevered free cash flow",
        20: "Discount factor = 1 / (1 + WACC)^t",
        21: "Present value of UFCF",
    }
    for r, text in labels.items():
        ws.cell(row=r, column=1, value=text).font = font(bold=r in (8, 12, 18, 21))

    ws["C5"] = 0
    ws["C5"].font = font(color=BLUE)
    ws["C8"] = "=Inputs!$B$4"
    ws["C8"].font = font(color=GREEN)
    ws["C8"].number_format = m["money"]

    for i, col in enumerate(cols):
        prev = get_column_letter(first + i - 1)
        cells = {
            5: (i + 1, "0", BLUE),
            7: (f"={ref['growth_start']}+({ref['growth_end']}-{ref['growth_start']})*({col}5-1)/MAX({ref['n']}-1,1)", PCT, None),
            8: (f"={prev}8*(1+{col}7)", m["money"], None),
            9: (f"={ref['margin_start']}+({ref['margin_end']}-{ref['margin_start']})*({col}5-1)/MAX({ref['n']}-1,1)", PCT, None),
            10: (f"={col}8*{col}9", m["money"], None),
            11: (f"=-{col}8*{ref['da']}", m["money"], None),
            12: (f"={col}10+{col}11", m["money"], None),
            13: (f"=-{col}12*{ref['tax']}", m["money"], None),
            14: (f"={col}12+{col}13", m["money"], None),
            15: (f"=-{col}11", m["money"], None),
            16: (f"=-{col}8*{ref['capex']}", m["money"], None),
            17: (f"=-({col}8-{prev}8)*{ref['nwc']}", m["money"], None),
            18: (f"={col}14+{col}15+{col}16+{col}17", m["money"], None),
            20: (f"=1/(1+{ref['wacc']})^{col}5", "0.0000", None),
            21: (f"={col}18*{col}20", m["money"], None),
        }
        for r, (val, fmt, color) in cells.items():
            c = ws[f"{col}{r}"]
            c.value = val
            c.number_format = fmt
            c.font = font(color=color or "000000", bold=r in (8, 12, 18, 21))
    for r in (12, 18):
        for col in ["A", "B", "C"] + cols:
            ws[f"{col}{r}"].border = TOP_RULE

    # Valuation block
    v = 24
    header_row(ws, v - 1, ["Valuation", "", "Value"])
    rows = [
        ("Sum of PV of UFCF", f"=SUM(D21:{lastc}21)", m["money"]),
        ("Final-year UFCF", f"={lastc}18", m["money"]),
        ("Terminal value = UFCF x (1 + g) / (WACC - g)", f"=C{v + 1}*(1+{ref['tg']})/({ref['wacc']}-{ref['tg']})", m["money"]),
        ("PV of terminal value", f"=C{v + 2}*{lastc}20", m["money"]),
        ("Enterprise value", f"=C{v}+C{v + 3}", m["money"]),
        ("Less net debt (plus net cash)", f"=-{ref['net_debt']}", m["money"]),
        ("Equity value", f"=C{v + 4}+C{v + 5}", m["money"]),
        (f"Diluted shares ({m['share_unit']})", f"={ref['shares']}", "#,##0.0"),
        ("Implied value per share", f"=C{v + 6}/C{v + 7}", m["per_share"]),
        ("Share price at publish", f"={ref['price']}", m["per_share"]),
        ("Price vs implied value", f"=C{v + 9}/C{v + 8}-1", PCT),
        ("Terminal value share of EV", f"=C{v + 3}/C{v + 4}", PCT),
    ]
    for j, (label, f, fmt) in enumerate(rows):
        r = v + j
        ws.cell(row=r, column=1, value=label).font = font(bold=label.startswith(("Enterprise", "Equity", "Implied")))
        c = ws.cell(row=r, column=3, value=f)
        c.number_format = fmt
        c.font = font(color=GREEN if "Inputs!" in f else "000000", bold=label.startswith(("Enterprise", "Equity", "Implied")))
    implied = f"DCF!$C${v + 8}"
    ws.cell(row=v + 8, column=3).fill = YELLOW

    chk = v + len(rows) + 1
    ws.cell(row=chk, column=1, value="Check: implied value published on DCF Lab").font = font(italic=True)
    c = ws.cell(row=chk, column=3, value=m["published"])
    c.font = font(color=BLUE, italic=True)
    c.number_format = m["per_share"]
    ws.cell(row=chk + 1, column=1, value="Difference (rounding only)").font = font(italic=True)
    c = ws.cell(row=chk + 1, column=3, value=f"=C{v + 8}-C{chk}")
    c.font = font(italic=True)
    c.number_format = '0.00;(0.00);"-"'

    ws.column_dimensions["A"].width = 46
    ws.column_dimensions["B"].width = 4
    for col in ["C"] + cols:
        ws.column_dimensions[col].width = 12
    ws.freeze_panes = "C4"

    # ---------------- Sensitivity ----------------
    ss = wb.create_sheet("Sensitivity")
    title(ss, f"{m['company']}: implied value per share", "Rows: WACC. Columns: terminal growth. Centre cell is the base case.")
    ss["A4"] = "WACC \\ g"
    ss["A4"].font = font(bold=True, color="FFFFFF")
    ss["A4"].fill = HEAD_FILL
    g_steps = [-0.01, -0.005, 0, 0.005, 0.01]
    w_steps = [-0.02, -0.01, 0, 0.01, 0.02]
    for j, s in enumerate(g_steps):
        c = ss.cell(row=4, column=2 + j, value=f"={ref['tg']}+({s})")
        c.number_format = PCT
        c.font = font(bold=True, color="FFFFFF")
        c.fill = HEAD_FILL
    for i, s in enumerate(w_steps):
        r = 5 + i
        c = ss.cell(row=r, column=1, value=f"={ref['wacc']}+({s})")
        c.number_format = PCT
        c.font = font(bold=True)
        c.fill = SUB_FILL
        for j in range(len(g_steps)):
            col = get_column_letter(2 + j)
            f = (
                f"=(SUMPRODUCT(DCF!$D$18:${lastc}$18/(1+$A{r})^DCF!$D$5:${lastc}$5)"
                f"+DCF!${lastc}$18*(1+{col}$4)/($A{r}-{col}$4)/(1+$A{r})^{ref['n']}"
                f"-{ref['net_debt']})/{ref['shares']}"
            )
            c = ss.cell(row=r, column=2 + j, value=f)
            c.number_format = m["per_share"]
            c.font = font(bold=(i == 2 and j == 2))
            if i == 2 and j == 2:
                c.fill = YELLOW
    ss["A11"] = "Each cell recomputes the full DCF at that WACC and terminal growth: PV of the UFCF row plus PV of the terminal value, less net debt, over diluted shares."
    ss["A11"].font = font(italic=True, color="555555")
    ss.column_dimensions["A"].width = 14
    for j in range(len(g_steps)):
        ss.column_dimensions[get_column_letter(2 + j)].width = 13

    # ---------------- Cover (first tab) ----------------
    cv = wb.create_sheet("Cover", 0)
    title(cv, f"{m['company']} ({m['ticker']}): DCF model", "DCF Lab, by Rishit Jain. Educational use, not investment advice.")
    cv["A4"] = "Implied value per share"
    cv["A4"].font = font(bold=True, size=12)
    cv["B4"] = f"={implied}"
    cv["B4"].font = font(bold=True, size=12, color=GREEN)
    cv["B4"].number_format = m["per_share"]
    cv["A5"] = "Share price at publish"
    cv["B5"] = f"={ref['price']}"
    cv["B5"].font = font(color=GREEN)
    cv["B5"].number_format = m["per_share"]
    cv["A6"] = "Price vs implied value"
    cv["B6"] = "=B5/B4-1"
    cv["B6"].number_format = PCT
    for r in (5, 6):
        cv[f"A{r}"].font = font()

    cv["A8"] = "How the workbook is built"
    cv["A8"].font = font(bold=True)
    steps = [
        "Inputs: every assumption in one place, with its source. Change a blue cell and the whole model updates.",
        "Historicals: reported revenue and the growth rate behind the forecast.",
        f"DCF: {n}-year forecast from revenue down to unlevered free cash flow, discounted at WACC, plus a Gordon growth terminal value, then the bridge from enterprise value to value per share.",
        "Sensitivity: implied value per share across a range of WACC and terminal growth rates.",
    ]
    for i, s in enumerate(steps):
        cv.cell(row=9 + i, column=1, value=s).font = font()

    cv["A14"] = "Colour key"
    cv["A14"].font = font(bold=True)
    key = [
        ("Blue text: hardcoded input you can change", BLUE, None),
        ("Black text: formula", "000000", None),
        ("Green text: linked from another sheet", GREEN, None),
        ("Yellow fill: key assumption or headline result", "000000", YELLOW),
    ]
    for i, (text, color, fill) in enumerate(key):
        c = cv.cell(row=15 + i, column=1, value=text)
        c.font = font(color=color)
        if fill:
            c.fill = fill

    cv["A20"] = "Sources"
    cv["A20"].font = font(bold=True)
    for i, s in enumerate(m["sources"]):
        cv.cell(row=21 + i, column=1, value=s).font = font()
    cv["A4"].comment = Comment("Linked from the DCF sheet's valuation block.", "DCF Lab")
    cv.column_dimensions["A"].width = 120
    cv.column_dimensions["B"].width = 14

    wb.calculation.fullCalcOnLoad = True
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{m['slug']}-dcf.xlsx"
    wb.save(path)
    return path


if __name__ == "__main__":
    for model in MODELS:
        print(build(model))
