"""Extract content from Word files and create Elementor page JSONs."""
import json
from docx import Document

def extract_docx_to_html(filepath):
    """Convert a .docx file to simple HTML paragraphs and headings."""
    doc = Document(filepath)
    html_parts = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        
        style = para.style.name.lower() if para.style else ""
        
        # Detect headings
        if "heading 1" in style or "title" in style:
            html_parts.append(f"<h1>{text}</h1>")
        elif "heading 2" in style:
            html_parts.append(f"<h2>{text}</h2>")
        elif "heading 3" in style:
            html_parts.append(f"<h3>{text}</h3>")
        elif "heading 4" in style:
            html_parts.append(f"<h4>{text}</h4>")
        elif "list" in style:
            html_parts.append(f"<li>{text}</li>")
        else:
            # Check for bold runs
            has_bold = any(run.bold for run in para.runs if run.text.strip())
            all_bold = all(run.bold for run in para.runs if run.text.strip()) if para.runs else False
            
            if all_bold and len(text) < 100:
                # Short all-bold text = likely a sub-heading
                html_parts.append(f"<h3>{text}</h3>")
            else:
                # Build paragraph with inline formatting
                parts = []
                for run in para.runs:
                    t = run.text
                    if not t:
                        continue
                    if run.bold:
                        t = f"<strong>{t}</strong>"
                    if run.italic:
                        t = f"<em>{t}</em>"
                    parts.append(t)
                if parts:
                    html_parts.append(f"<p>{''.join(parts)}</p>")
                else:
                    html_parts.append(f"<p>{text}</p>")
    
    # Group <li> items into <ul> blocks
    result = []
    in_list = False
    for part in html_parts:
        if part.startswith("<li>"):
            if not in_list:
                result.append("<ul>")
                in_list = True
            result.append(part)
        else:
            if in_list:
                result.append("</ul>")
                in_list = False
            result.append(part)
    if in_list:
        result.append("</ul>")
    
    return "\n".join(result)


# Extract both files
files = {
    "shipping": "sicon art shipping policy.docx",
    "return": "sicon art return policy.docx",
}

for key, filename in files.items():
    print(f"\n{'='*60}")
    print(f"FILE: {filename}")
    print(f"{'='*60}")
    html = extract_docx_to_html(filename)
    print(html)
    print(f"\n--- Length: {len(html)} chars ---")
