from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UploadResponse(BaseModel):
    message: str
    content: str

class SummaryResponse(BaseModel):
    summary: List[str]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizResponse(BaseModel):
    quiz: List[QuizQuestion]

class AskResponse(BaseModel):
    question: str
    answer: str

class ExportResponse(BaseModel):
    filename: str
    download_url: str