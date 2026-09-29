# Demo Procedure - PathwayLock MVP

**2-Minute Complete Demo Flow**

---

## Prerequisites

1. Both backend and frontend servers running
2. Demo data loaded in database
3. Browser opened to http://localhost:5173

---

## DEMO CASE 1: GREEN DECISION (Rekha - Tailoring)

### Step 1: Landing Page (10 seconds)
- Show landing page
- Highlight tagline: "Validate the livelihood pathway before training"
- Click **"Start Assessment"**

### Step 2: Beneficiary Assessment (20 seconds)

**Option A - Text Form:**
- Fill in:
  - Name: **Rekha**
  - Age: **24**
  - Education: **10th Pass**
  - Location: **Mumbai**
  - Current Livelihood: **Home-based stitching**
  - Skills: Add "stitching", "measurements", "basic tailoring"
  - Aspiration: **Tailoring**
  - Mobility Radius: **5** km
  - Work Preference: **Flexible**
  - Constraints: Add "childcare", "flexible hours needed"

**Option B - Voice Intake (Optional):**
- Click **"Start Voice Intake"**
- Say or type: "My name is Rekha. I am 24 years old, 10th pass. I live in Mumbai. I do stitching work at home. I know stitching and basic tailoring. I want to work as a tailor. I can travel 5 kilometers. I need flexible hours because I have a child."

### Step 3: Profile Review (15 seconds)
- Review extracted/entered profile
- Show confidence scores (if voice used)
- Click **"Confirm Profile & Generate Recommendation"**

### Step 4: PathwayLock Recommendation (30 seconds)
- **Decision: GREEN** ✓
- Point out:
  - Overall Score: ~75-80%
  - Opportunity Confidence: ~92%
  - Matched Opportunity: **Tailoring Assistant, 2.8km**
  - Source: **FIELD_VERIFIED**
  - Verification: **COUNSELLOR_VERIFIED**
  - Last verified: **12 days ago**
  - Matched Skills: stitching, measurements, basic tailoring
  - Skill Gaps: pattern making, advanced stitching
  - NSQF Training: **Basic Tailoring and Garment Construction** (3 months)
  - Coverage: **SEARCHED_FOUND**

### Step 5: Counsellor Review (20 seconds)
- Click **"Send to Counsellor for Review"**
- Go to **Counsellor Dashboard**
- Show pending review
- Enter Counsellor Name: **Demo Counsellor**
- Click **"Review This Recommendation"**
- Add notes: "Verified. Good match. Training pathway clear."
- Click **"✓ Approve"**

**Result: GREEN recommendation successfully validated and approved**

---

## DEMO CASE 2: RED_UNCOVERED (Beauty Assistant)

### Quick Demo (30 seconds)
- Click **"Start Assessment"**
- Fill minimal form:
  - Name: **Priya**
  - Aspiration: **Beautician**
  - Location: **Mumbai**
- Click **"Continue to Profile Review"**
- Click **"Confirm Profile & Generate Recommendation"**

**Result:**
- **Decision: RED_UNCOVERED**
- Explanation: "Available evidence is insufficient to validate this pathway. Local opportunity coverage for this occupation has not yet been established."
- Coverage Status: **NEVER_SEARCHED**
- This means: Opportunity data for "Beautician" has not been collected yet

---

## DEMO CASE 3: YELLOW (Embroidery - Stale Data)

### Quick Demo (30 seconds)
- New Assessment
- Fill form:
  - Name: **Meera**
  - Age: **26**
  - Aspiration: **Embroidery**
  - Skills: "hand embroidery", "thread work"
  - Location: **Mumbai**
- Generate recommendation

**Result:**
- **Decision: YELLOW** ⚠
- Explanation: "Opportunity exists but confidence is insufficient for GREEN validation. Issues: opportunity confidence below threshold, counsellor verification pending. Additional verification recommended."
- Matched Opportunity: **Embroidery Worker, 4.2km**
- Last Verified: **95 days ago**
- Verification Status: **UNVERIFIED**
- Confidence: **68%**

---

## Key Points to Highlight

### 1. Real Working System
- ✅ Actual AI integration (Gemini for profile extraction)
- ✅ Deterministic PathwayLock engine (not random)
- ✅ Real database with structured data
- ✅ Working counsellor workflow
- ✅ Complete audit trail

### 2. Evidence-Based Decisions
- GREEN: Strong evidence, recent verification, counsellor approved
- YELLOW: Evidence exists but quality/freshness insufficient
- RED_UNCOVERED: No evidence collected yet (NOT "no opportunity exists")

### 3. Explainability
- Full score breakdown shown
- Evidence sources displayed
- Confidence metrics visible
- Decision reasoning transparent

### 4. NSQF Alignment
- Structured training pathways
- Skill gap identification
- Training duration and modules
- Provider information

### 5. Counsellor-in-Loop
- Human verification required for GREEN
- Review, approve, reject workflow
- Audit logging
- Notes and tracking

---

## Optional Features to Show

### Opportunity Intelligence Page
- Navigate to **"Opportunities"**
- Show list of prototype opportunities
- Filter by occupation
- Display source types, verification status, confidence
- Show "Prototype Dataset" warning

### Voice Input (if browser supports)
- Voice recognition working
- Transcript display
- Edit capability
- AI extraction

### Offline Mode
- Disconnect network
- Show "Offline" status
- Form still works
- Data queued for sync

---

## Common Questions & Answers

**Q: Is this real data?**
A: This is a structured prototype dataset. Real opportunity sources (government portals, field surveys) will be integrated in production.

**Q: Does voice work in Hindi?**
A: Current browser API is English only. BHASHINI integration for multilingual support is pending.

**Q: What if opportunity confidence is low?**
A: System gives YELLOW decision and recommends additional verification. Human counsellor can approve after investigation.

**Q: What does NEVER_SEARCHED mean?**
A: Coverage has not been established for that occupation yet. It does NOT mean "no opportunity exists" - it means "we haven't looked yet."

**Q: Can counsellor override RED?**
A: Counsellor can reject the recommendation or request more evidence. System is designed to prevent false positives, not block legitimate pathways.

---

## Fallback if Gemini API Not Configured

If AI extraction fails:
- Use text form directly (Option A)
- Skip voice intake demo
- Focus on PathwayLock decision engine
- Emphasize deterministic rules over AI extraction

---

## Time Management

- **30 seconds:** Landing + start assessment
- **30 seconds:** Fill GREEN case form
- **15 seconds:** Profile review
- **30 seconds:** Show GREEN recommendation + scores
- **15 seconds:** Counsellor approval
- **15 seconds:** Quick RED_UNCOVERED demo
- **15 seconds:** Quick YELLOW demo
- **Total:** ~2:30 minutes

---

## Closing Statement

"PathwayLock is a working MVP that demonstrates:
1. Evidence-based livelihood validation
2. Deterministic, explainable AI decisions
3. NSQF-aligned training pathways
4. Counsellor verification workflow
5. Complete audit trail

Ready for SIH 2026 evaluation."
