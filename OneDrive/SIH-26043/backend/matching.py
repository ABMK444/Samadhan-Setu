import re


# ============================================================
# DOMAIN KNOWLEDGE
# ============================================================

DOMAIN_TERMS = {

    "iot": {
        "iot",
        "internet of things",
        "sensor",
        "sensors",
        "smart systems",
        "smart system",
        "embedded",
        "automation",
        "connected devices",
        "smart device",
        "smart devices",
    },

    "ai": {
        "ai",
        "artificial intelligence",
        "machine learning",
        "deep learning",
        "computer vision",
        "neural network",
        "intelligent systems",
        "intelligent system",
    },

    "software": {
        "software",
        "software engineering",
        "application",
        "applications",
        "platform",
        "web",
        "mobile",
        "programming",
        "computer science",
        "digital platform",
    },

    "data": {
        "data science",
        "data analytics",
        "analytics",
        "database",
        "data analysis",
        "predictive analysis",
    },

    "agriculture": {
        "agriculture",
        "agricultural",
        "agricultural technology",
        "crop",
        "crops",
        "farming",
        "farmer",
        "farmers",
        "soil",
        "plant",
        "plants",
        "horticulture",
    },

    "water": {
        "water",
        "water management",
        "drought",
        "drought-prone",
        "irrigation",
        "rainwater",
        "groundwater",
        "water conservation",
        "conservation",
        "flood",
        "flood warning",
    },

    "environment": {
        "environment",
        "environmental",
        "environmental engineering",
        "environmental science",
        "pollution",
        "air pollution",
        "waste",
        "waste management",
        "climate",
        "ecology",
    },

    "healthcare": {
        "healthcare",
        "remote healthcare",
        "medical",
        "medicine",
        "hospital",
        "doctor",
        "patient",
        "clinical",
        "diagnosis",
        "health technology",
        "public health",
        "human health",
    },

    "community": {
        "community",
        "rural",
        "village",
        "villages",
        "skill",
        "skills",
        "employment",
        "education",
        "social sciences",
    },

    # NOTE: the old "management" domain bucket (with bare
    # "management", "resource management", "planning",
    # "collection", "disposal") was removed on purpose.
    # "management" is an administrative word, not a technical
    # domain — it appears in "Hospital Management", "Water
    # Management", and "Waste Management" alike, so treating it
    # as a domain match caused irrelevant universities to score
    # high on completely unrelated problems.
}


# ============================================================
# STOPWORDS
# ============================================================

STOPWORDS = {
    "a", "an", "the", "and", "or", "but",
    "of", "to", "in", "on", "for", "with",
    "from", "by", "at", "as", "is", "are",
    "was", "were", "be", "been", "being",
    "this", "that", "these", "those",
    "it", "its", "into", "through", "over",
    "under", "about", "between", "among",
    "can", "could", "should", "would",
    "will", "shall", "may", "might",
    "must", "than", "then", "also",
    "such", "their", "there", "they",
    "them", "we", "our", "you", "your",
    "he", "she", "his", "her",
    "has", "have", "had", "do",
    "does", "did",

    # Generic technical words
    "based",
    "using",
    "use",
    "used",
    "system",
    "systems",
    "solution",
    "solutions",
    "provide",
    "provides",
    "develop",
    "developed",
    "developing",

    # Generic administrative words (too vague to signal
    # real domain relevance on their own — e.g. "management"
    # appears in "Hospital Management" and "Water Management"
    # alike, so it must not count as a topical match).
    "management",
    "resource",
    "resources",
    "planning",
    "collection",
    "disposal",
    "administration",
}


# ============================================================
# NORMALIZE
# ============================================================

def normalize(text):

    if not text:
        return ""

    text = str(text).lower()

    text = text.replace("-", " ")

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# WORDS
# ============================================================

def get_words(text):

    text = normalize(text)

    if not text:
        return set()

    return {
        word
        for word in text.split()
        if (
            (len(word) >= 3 or word == "ai")
            and word not in STOPWORDS
        )
    }


# ============================================================
# DOMAIN DETECTION
# ============================================================

def detect_domains(text):

    text = normalize(text)

    domains = set()

    if not text:
        return domains

    for domain, terms in DOMAIN_TERMS.items():

        for term in terms:

            term = normalize(term)

            if re.search(
                r"\b" + re.escape(term) + r"\b",
                text
            ):
                domains.add(domain)
                break

    return domains


# ============================================================
# DOMAIN SCORE
# ============================================================

def domain_score(problem_text, university_text):

    problem_domains = detect_domains(
        problem_text
    )

    university_domains = detect_domains(
        university_text
    )

    if not problem_domains:
        return 0.0, set()

    matched = (
        problem_domains
        & university_domains
    )

    score = (
        len(matched)
        / len(problem_domains)
    )

    return score, matched


# ============================================================
# WORD SCORE
# ============================================================

def word_score(problem_text, university_text):

    problem_words = get_words(
        problem_text
    )

    university_words = get_words(
        university_text
    )

    if not problem_words or not university_words:
        return 0.0, set()

    matched = (
        problem_words
        & university_words
    )

    if not matched:
        return 0.0, set()

    # Balanced overlap.
    precision = (
        len(matched)
        / len(university_words)
    )

    recall = (
        len(matched)
        / len(problem_words)
    )

    if precision + recall == 0:
        return 0.0, set()

    score = (
        2 * precision * recall
        / (precision + recall)
    )

    return min(score, 1.0), matched


# ============================================================
# SPECIALIZATION MATCH
# ============================================================

def calculate_match(
    problem_text,
    specialization_text
):

    if not specialization_text:
        return 0.0, set()

    # Domain relevance
    d_score, domains = domain_score(
        problem_text,
        specialization_text
    )

    # Direct meaningful-word relevance
    w_score, words = word_score(
        problem_text,
        specialization_text
    )

    # Domain is much more important.
    score = (
        d_score * 0.80
        + w_score * 0.20
    )

    keywords = set(words)
    keywords.update(domains)

    return min(score, 1.0), keywords


# ============================================================
# EXPLICIT KEYWORD MATCH
# ============================================================

def keyword_match(
    problem_keywords,
    university_text
):

    if not problem_keywords:
        return 0.0, set()

    university_words = get_words(
        university_text
    )

    problem_words = set()

    for keyword in problem_keywords:

        problem_words.update(
            get_words(keyword)
        )

    if not problem_words:
        return 0.0, set()

    matched = (
        problem_words
        & university_words
    )

    score = (
        len(matched)
        / len(problem_words)
    )

    return min(score, 1.0), matched


# ============================================================
# RANK UNIVERSITIES
# ============================================================

def rank_universities(
    problem,
    universities,
    specializations
):

    title = problem.get(
        "problem_title",
        ""
    )

    description = problem.get(
        "description",
        ""
    )

    problem_keywords = problem.get(
        "keywords",
        []
    )

    # --------------------------------------------------------
    # TITLE HAS STRONG IMPORTANCE
    # --------------------------------------------------------

    problem_text = (
        f"{title} {title} {description}"
    )

    results = []

    for university in universities:

        university_id = university.get(
            "university_id"
        )

        university_name = university.get(
            "university_name",
            ""
        )

        university_description = university.get(
            "description",
            ""
        )

        # ----------------------------------------------------
        # UNIVERSITY SPECIALIZATIONS
        # ----------------------------------------------------

        university_specs = [
            spec
            for spec in specializations
            if spec.get("university_id")
            == university_id
        ]

        # ----------------------------------------------------
        # BEST SPECIALIZATION
        # ----------------------------------------------------

        best_score = 0.0

        best_specialization = None

        best_keywords = set()

        for spec in university_specs:

            specialization = spec.get(
                "specialization",
                ""
            )

            expertise = spec.get(
                "expertise",
                ""
            )

            spec_text = (
                f"{specialization} "
                f"{expertise}"
            )

            score, keywords = (
                calculate_match(
                    problem_text,
                    spec_text
                )
            )

            if score > best_score:

                best_score = score

                best_specialization = (
                    specialization
                )

                best_keywords = keywords

        # ----------------------------------------------------
        # TITLE + UNIVERSITY PROFILE
        # ----------------------------------------------------

        university_profile = (
            f"{university_name} "
            f"{university_description}"
        )

        for spec in university_specs:

            university_profile += (
                " "
                + spec.get(
                    "specialization",
                    ""
                )
                + " "
                + spec.get(
                    "expertise",
                    ""
                )
            )

        # ----------------------------------------------------
        # UNIVERSITY DOMAIN MATCH
        # ----------------------------------------------------

        profile_domain_score, profile_domains = (
            domain_score(
                problem_text,
                university_profile
            )
        )

        # ----------------------------------------------------
        # UNIVERSITY DESCRIPTION
        # ----------------------------------------------------

        description_word_score, description_words = (
            word_score(
                problem_text,
                university_description
            )
        )

        # ----------------------------------------------------
        # EXPLICIT KEYWORDS
        # ----------------------------------------------------

        explicit_score, explicit_keywords = (
            keyword_match(
                problem_keywords,
                university_profile
            )
        )

        # ----------------------------------------------------
        # TITLE DIRECT MATCH
        # ----------------------------------------------------

        title_domain_score, title_domains = (
            domain_score(
                title,
                university_profile
            )
        )

        title_word_score, title_words = (
            word_score(
                title,
                university_profile
            )
        )

        title_score = (
            title_domain_score * 0.80
            + title_word_score * 0.20
        )

        # ----------------------------------------------------
        # FINAL SCORE
        # ----------------------------------------------------
        #
        # BEST SPECIALIZATION = 60%
        # TITLE                = 20%
        # PROFILE              = 10%
        # EXPLICIT KEYWORDS    = 10%
        #
        # ----------------------------------------------------

        final_score = (
            best_score * 0.60
            + title_score * 0.20
            + profile_domain_score * 0.10
            + explicit_score * 0.10
        )

        # ----------------------------------------------------
        # KEYWORDS FOR DISPLAY
        # ----------------------------------------------------

        all_keywords = (
            best_keywords
            | explicit_keywords
            | title_domains
        )

        # Only meaningful display terms.
        all_keywords = {
            keyword
            for keyword in all_keywords
            if keyword not in STOPWORDS
        }

        results.append({

            "university_id":
                university_id,

            "university_name":
                university_name,

            "match_score":
                round(
                    final_score * 100,
                    2
                ),

            "matched_specialization":
                best_specialization,

            "matched_keywords":
                sorted(all_keywords)
        })

    # --------------------------------------------------------
    # HIGHEST SCORE FIRST
    # --------------------------------------------------------

    results.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return results