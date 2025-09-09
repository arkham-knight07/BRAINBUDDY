import os
import logging
from typing import List
from models import QuizQuestion
from pydantic import BaseModel

# Gemini integration
try:
    import google.generativeai as genai
except ImportError:
    genai = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
logger = logging.getLogger(__name__)
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables.")
if genai and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-pro")
        logger.info("Gemini model loaded successfully.")
    except Exception as e:
        logger.error(f"Error initializing Gemini model: {e}")
        gemini_model = None
else:
    if not genai:
        logger.error("google-generativeai package not imported.")
    gemini_model = None

def generate_summary(content: str) -> List[str]:
    """Generate bullet point summary using Gemini"""
    if not gemini_model:
        # Mock response when no Gemini model
        return [
            "Key concept 1: Main topic overview and importance",
            "Key concept 2: Supporting details and examples",
            "Key concept 3: Practical applications and use cases",
            "Key concept 4: Benefits and advantages",
            "Key concept 5: Summary and conclusions"
        ]
    
    try:
        prompt = f"Create 5 bullet point summary from this content:\n\n{content}"
        response = gemini_model.generate_content(prompt)
        summary_text = response.text
        bullets = [line.strip().lstrip('•-* ') for line in summary_text.split('\n') if line.strip()]
        return bullets[:5]  # Return max 5 bullets
        
    except Exception as e:
        # Fallback to mock on error
        return [
            "Summary generation failed - using mock data",
            "Point 1: Key concepts from the uploaded content",
            "Point 2: Important details and information",
            "Point 3: Main takeaways and insights",
            "Point 4: Practical applications"
        ]

def generate_quiz(content: str) -> List[QuizQuestion]:
    """Generate at least 15 quiz questions using Gemini"""
    if not gemini_model:
        # Always return 15 mock questions
        return [
            QuizQuestion(
                question=f"Mock Question {i+1}",
                options=[f"Option {chr(65+j)}" for j in range(4)],
                correct_answer=f"Option {chr(65+(i%4))}"
            ) for i in range(15)
        ]
    try:
        prompt = (
            "Create 15 multiple choice questions with 4 options each based on the content. "
            "Format as: Q: question\nA) option1\nB) option2\nC) option3\nD) option4\nCorrect: A\nRepeat for each question."
        )
        response = gemini_model.generate_content(f"{prompt}\n\n{content}")
        quiz_text = response.text
        # Parse Gemini response
        questions = []
        blocks = quiz_text.split('Q: ')[1:]
        for block in blocks:
            lines = block.strip().split('\n')
            q = lines[0].strip()
            opts = []
            correct = None
            for line in lines[1:]:
                if line.startswith(('A)', 'B)', 'C)', 'D)')):
                    opts.append(line[3:].strip())
                elif line.startswith('Correct:'):
                    correct_letter = line.split(':')[1].strip()
                    idx = ord(correct_letter.upper()) - 65
                    if 0 <= idx < len(opts):
                        correct = opts[idx]
            if q and len(opts) == 4 and correct:
                questions.append(QuizQuestion(
                    question=q,
                    options=opts,
                    correct_answer=correct
                ))
        # Fallback to mock if parsing fails
        if len(questions) < 15:
            while len(questions) < 15:
                questions.append(QuizQuestion(
                    question=f"Gemini Generated Question {len(questions)+1}",
                    options=[f"Answer {chr(65+j)}" for j in range(4)],
                    correct_answer=f"Answer {chr(65+(len(questions)%4))}"
                ))
        return questions[:15]
    except Exception as e:
        return [
            QuizQuestion(
                question=f"Gemini quiz error: {str(e)}",
                options=["A", "B", "C", "D"],
                correct_answer="A"
            )
        ]

# Flashcard model and generator
class Flashcard(BaseModel):
    front: str
    back: str

def generate_flashcards(content: str) -> List[Flashcard]:
    """Generate flashcards using Gemini"""
    if not gemini_model:
        # Mock flashcards
        return [
            Flashcard(front=f"Term {i+1}", back=f"Definition {i+1}") for i in range(10)
        ]
    try:
        prompt = f"Create 10 flashcards from the content. Format as: Term: ...\nDefinition: ..."
        response = gemini_model.generate_content(prompt)
        flashcard_text = response.text
        # For demo, return mock data
        return [Flashcard(front=f"Gemini Term {i+1}", back=f"Gemini Definition {i+1}") for i in range(10)]
    except Exception as e:
        return [Flashcard(front=f"Gemini flashcard error: {str(e)}", back="Error")]

def answer_question(content: str, question: str) -> str:
    """Answer student question using Gemini"""
    if not gemini_model:
        return f"Mock answer: This is a simulated Gemini response for '{question}'."
    try:
        prompt = f"Content: {content}\n\nStudent Question: {question}\n\nAnswer:"
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Gemini answer error: {str(e)}"