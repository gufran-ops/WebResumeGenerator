from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from typing import  List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv
import os

load_dotenv() 

resume_extraction_tool = {
    "type": "function",
    "function": {
        "name": "resume_extraction_tool",
        "description": "Parse resume content into structured JSON format",
        "parameters": {
            "type": "object",
            "properties": {
                "basics": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The full name of the candidate."
                        },
                        "email": {
                            "type": "string",
                            "description": "Email address of the candidate."
                        },
                        "phone": {
                            "type": "string",
                            "description": "Phone number of the candidate."
                        },
                        "summary": {
                            "type": "string",
                            "description": "A brief summary or objective of the candidate."
                        },
                        "address": {
                            "type": "string",
                            "description": "Physical address of the candidate."
                        },
                        "linkedinProfile": {
                            "type": "string",
                            "description": "LinkedIn profile URL of the candidate."
                        }
                    },
                    "required": ["name", "email"]
                },
                "work": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Company or organization name."
                            },
                            "position": {
                                "type": "string",
                                "description": "Job title or position held."
                            },
                            "startDate": {
                                "type": "string",
                                "description": "Start date of the position."
                            },
                            "endDate": {
                                "type": "string",
                                "description": "End date of the position."
                            },
                            "jobLocation": {
                                "type": "string",
                                "description": "Location of the job."
                            },
                            "highlights": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "description": "Key achievements and responsibilities."
                                }
                            }
                        },
                        "required": ["name", "position"]
                    }
                },
                "education": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "institution": {
                                "type": "string",
                                "description": "Name of the educational institution."
                            },
                            "degree": {
                                "type": "string",
                                "description": "Degree or course pursued."
                            },
                            "startDate": {
                                "type": "string",
                                "description": "Start date of the education."
                            },
                            "endDate": {
                                "type": "string",
                                "description": "End date of the education."
                            }
                        }
                    }
                },
                "honor_awards": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "List of honors or awards received by the candidate."
                    }
                },
                "publications": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "List of publications by the candidate."
                    }
                },
                "topSkills": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "List of top skills the candidate possesses."
                    }
                },
                "languages": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "language": {
                                "type": "string",
                                "description": "The name of the language."
                            },
                            "fluency": {
                                "type": "string",
                                "description": "The candidate's fluency level in the language."
                            }
                        }
                    }
                },
                "certifications": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "List of certifications held by the candidate."
                    }
                }
            },
            "required": ["basics", "work", "education"]
        }
    }
}

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Basics(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    summary: Optional[str] = None
    address: Optional[str] = None
    linkedinProfile: Optional[str] = None

class WorkExperience(BaseModel):
    name: str
    position: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    jobLocation: Optional[str] = None
    highlights: Optional[List[str]] = None

class Education(BaseModel):
    institution: str
    degree: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

class Languages(BaseModel):
    language: Optional[str] = None
    fluency: Optional[str] = None

class JsonResume(BaseModel):
    basics: Basics
    work: List[WorkExperience]
    education: List[Education]
    honor_awards: Optional[List[str]] = None
    publications: Optional[List[str]] = None
    topSkills: Optional[List[str]] = None
    languages: Optional[List[Languages]] = None
    certifications: Optional[List[str]] = None


@app.get("/")
async def check():
    return {"message": "Hello, this is your PDF processor!"}


@app.post("/process-pdf/", response_model = JsonResume)
async def process_pdf(
    file: UploadFile = File(...), 
    openai_api_key: str = Form(...)
):
    try:
        pdf_path = f"./{file.filename}"
        with open(pdf_path, "wb") as f:
            f.write(await file.read())
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        text = "".join([page.page_content for page in pages])

        llm = ChatOpenAI(model="gpt-4o-mini", api_key=openai_api_key)
        parser_llm = llm.bind_tools([resume_extraction_tool], tool_choice="resume_extraction_tool")
        content = parser_llm.invoke(text)
        extracted_json = content.tool_calls[0]['args']

        os.remove(pdf_path)

        return extracted_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))