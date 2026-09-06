import os
from dotenv import load_dotenv
from supabase import create_client, Client

from matching import rank_universities


# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or key is missing from .env")


# Connect to Supabase
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# ----------------------------------------
# Fetch data from Supabase
# ----------------------------------------

def fetch_all():
    universities = (
        supabase.table("universities").select("*").execute().data
    )
    specializations = (
        supabase.table("university_specializations").select("*").execute().data
    )
    problems = (
        supabase.table("problems").select("*").execute().data
    )
    return universities, specializations, problems


# ----------------------------------------
# Run matching for one problem + save to DB
# ----------------------------------------

def run_and_store(problem, universities, specializations):

    ranked = rank_universities(problem, universities, specializations)

    rows = []
    for result in ranked:
        rows.append({
            "problem_id": problem["problem_id"],
            "university_id": result["university_id"],
            "match_score": result["match_score"],
            "matched_specialization": result["matched_specialization"],
            "matched_keywords": result["matched_keywords"],
        })

    # upsert: overwrite old scores if this problem was matched before
    supabase.table("problem_university_matches").upsert(
        rows,
        on_conflict="problem_id,university_id"
    ).execute()

    return ranked


# ----------------------------------------
# Run matching for every problem + save
# ----------------------------------------

def run_all_and_store():

    universities, specializations, problems = fetch_all()

    print(f"Universities loaded: {len(universities)}")
    print(f"Specializations loaded: {len(specializations)}")
    print(f"Problems loaded: {len(problems)}")

    for problem in problems:
        print("\n" + "=" * 70)
        print("PROBLEM:", problem["problem_title"])
        print("=" * 70)

        ranked = run_and_store(problem, universities, specializations)

        for index, result in enumerate(ranked[:5], start=1):
            print(f"{index}. {result['university_name']} → {result['match_score']}%")
            print(f"   Specialization: {result['matched_specialization']}")
            print(f"   Keywords: {result['matched_keywords']}")

        print(f"   -> saved {len(ranked)} rows to problem_university_matches")


if __name__ == "__main__":
    run_all_and_store()