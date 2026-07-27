import os
import re

filepath = r"C:\Users\jcihe\.gemini\antigravity\scratch\zenith_pensions_audit\src\pages\WorkingPapers.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clear sampleRows
content = re.sub(
    r"const \[sampleRows, setSampleRows\] = useState\(\[\s*\{ id: 'SMP-001'.*?\s*\]\);",
    "const [sampleRows, setSampleRows] = useState([]);",
    content,
    flags=re.DOTALL
)

# 2. Add empty state for Sample Test Execution Matrix
sample_table_html = """                  <thead>
                    <tr>
                      <th>Sample #</th>
                      <th>Sample Test Item Description</th>
                      <th>Expected Result</th>
                      <th>Actual Test Result</th>
                      <th>Exception?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.map(row => ("""
empty_sample_table_html = """                  <thead>
                    <tr>
                      <th>Sample #</th>
                      <th>Sample Test Item Description</th>
                      <th>Expected Result</th>
                      <th>Actual Test Result</th>
                      <th>Exception?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No test evidence attached yet.
                        </td>
                      </tr>
                    ) : sampleRows.map(row => ("""
content = content.replace(sample_table_html, empty_sample_table_html)

# 3. Add empty state for filteredPapers
filtered_table_html = """            <thead>
              <tr>
                <th>Paper Ref #</th>
                <th>Working Paper Document Title</th>
                <th>File Format & SHA-256</th>
                <th>Linked Audit Engagement</th>
                <th>Sampling Method</th>
                <th>Uploaded By</th>
                <th>Review Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.map(wp => ("""
empty_filtered_table_html = """            <thead>
              <tr>
                <th>Paper Ref #</th>
                <th>Working Paper Document Title</th>
                <th>File Format & SHA-256</th>
                <th>Linked Audit Engagement</th>
                <th>Sampling Method</th>
                <th>Uploaded By</th>
                <th>Review Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No working papers available.
                  </td>
                </tr>
              ) : filteredPapers.map(wp => ("""
content = content.replace(filtered_table_html, empty_filtered_table_html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("WorkingPapers fixed.")
