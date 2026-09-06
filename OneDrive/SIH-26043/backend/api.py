import os
from explain import explain_all
from matching import rank_universities
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL or SUPABASE_KEY is missing from .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(
    title="SIH University Matching API",
    description="API for university-problem matching",
    version="1.0.0"
)

# Needed so your frontend (running on a different port/domain) can
# actually call this API from the browser. Without this, requests
# from fetch()/axios in the browser get blocked even though /docs
# works fine (docs isn't subject to CORS the same way).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your real frontend domain before final submission
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "SIH University Matching API is running"
    }


@app.get("/problems")
def get_problems():
    response = (
        supabase
        .table("problems")
        .select("*")
        .execute()
    )

    return response.data


@app.get("/problems/{problem_id}")
def get_problem(problem_id: int):
    response = (
        supabase
        .table("problems")
        .select("*")
        .eq("problem_id", problem_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return response.data[0]


@app.get("/problems/{problem_id}/matches")
def get_problem_matches(problem_id: int):
    response = (
        supabase
        .table("problem_university_matches")
        .select("*")
        .eq("problem_id", problem_id)
        .order("match_score", desc=True)
        .execute()
    )

    return response.data


@app.get("/universities")
def get_universities():
    response = (
        supabase
        .table("universities")
        .select("*")
        .execute()
    )

    return response.data


@app.get("/universities/{university_id}")
def get_university(university_id: int):
    response = (
        supabase
        .table("universities")
        .select("*")
        .eq("university_id", university_id)   # was "id" — universities' PK is "university_id"
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )

    return response.data[0]


@app.get("/problems/{problem_id}/matches/explained")
def get_matches_explained(problem_id: int):
    problem = get_problem(problem_id)

    universities = (
        supabase
        .table("universities")
        .select("*")
        .execute()
        .data
    )

    specializations = (
        supabase
        .table("university_specializations")
        .select("*")
        .execute()
        .data
    )

    ranked = rank_universities(
        problem,
        universities,
        specializations
    )

    return explain_all(
        ranked,
        problem["problem_title"]
    )