"""
explain.py

Turns the raw output of matching.rank_universities() into a
human-readable "Why this university?" explanation, for display
in the frontend / demo.
"""

# Friendly labels for each domain keyword.
DOMAIN_LABELS = {
    "iot": "IoT expertise matches the connected-devices requirement",
    "ai": "AI expertise supports the intelligent-system requirement",
    "software": "Software/platform expertise matches the digital-solution requirement",
    "data": "Data analytics expertise matches the data-driven requirement",
    "agriculture": "Agricultural expertise matches the agriculture domain",
    "water": "Water-resource expertise matches the water-related problem",
    "environment": "Environmental expertise matches the environmental domain",
    "healthcare": "Healthcare expertise matches the health-related requirement",
    "community": "Community/rural-development expertise matches the social requirement",
}


def explain_match(result, problem_title=""):
    """
    result: one dict from rank_universities(), e.g.
        {
            "university_id": 3,
            "university_name": "Birsa Agricultural University",
            "match_score": 85.4,
            "matched_specialization": "Agricultural Technology",
            "matched_keywords": ["agriculture", "crop", "ai"]
        }

    Returns a dict ready to render:
        {
            "university_name": ...,
            "match_score": ...,
            "reasons": ["...", "...", "..."],
        }
    """

    reasons = []

    specialization = result.get("matched_specialization")
    keywords = result.get("matched_keywords") or []

    if specialization:
        reasons.append(
            f"{specialization} matches the core focus of \"{problem_title}\""
            if problem_title else
            f"{specialization} matches the core focus of this problem"
        )

    for keyword in keywords:
        if keyword in DOMAIN_LABELS:
            reasons.append(DOMAIN_LABELS[keyword])
        else:
            # A plain overlapping word (not a domain) — still worth showing.
            reasons.append(f"Shares relevant terminology: \"{keyword}\"")

    if not reasons:
        reasons.append("General relevance based on available profile data")

    return {
        "university_id": result.get("university_id"),
        "university_name": result.get("university_name"),
        "match_score": result.get("match_score"),
        "reasons": reasons,
    }


def explain_all(ranked_results, problem_title=""):
    """Apply explain_match() to a full ranked list."""
    return [explain_match(r, problem_title) for r in ranked_results]


# ------------------------------------------------------------
# Quick demo / manual test
# ------------------------------------------------------------
if __name__ == "__main__":
    from matching import rank_universities

    problem = {
        "problem_title": "AI-Based Crop Disease Detection",
        "description": "Detect crop diseases early using AI and computer vision on farm images.",
        "keywords": ["ai", "crop", "agriculture"],
    }

    universities = [
        {"university_id": 1, "university_name": "Birsa Agricultural University", "description": "Focused on agriculture research."},
    ]

    specializations = [
        {"university_id": 1, "specialization": "Agricultural Technology", "expertise": "crop science, precision farming, AI-based disease detection"},
    ]

    ranked = rank_universities(problem, universities, specializations)
    explained = explain_all(ranked, problem["problem_title"])

    for e in explained:
        print(f"\n{e['university_name']} — {e['match_score']}%")
        for r in e["reasons"]:
            print(f"  ✓ {r}")