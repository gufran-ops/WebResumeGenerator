# AI Powered HTML Resume Generator

## Overview ([Demo](http://ec2-16-171-22-107.eu-north-1.compute.amazonaws.com:3000/))
This project is an AI-powered HTML resume generator that allows users to upload their LinkedIn PDF resume and their OpenAI API key to generate a HTML based resume. The backend processes the resume and generates a structured JSON based resume output, which is then used to render a professional HTML CV using DOM manipulation on the frontend.

## Screenshots
<table>
  <tr>
    <td style="text-align:center;">
      <img src="screenshots/home.png" alt="Home" width="600" />
    </td>
    <td style="text-align:center;">
      <img src="screenshots/resume.png" alt="Resume" width="600" />
    </td>
  </tr>
</table>

## Features
- **Frontend**: Built with React, containerized using Docker, and exposed on ``localhost:3000``.
- **Backend**: Developed with Python and FastAPI, exposed on ``localhost:8000``. It extracts PDF content and generates a JSON-based resume using OpenAI LLM and schema-based function calls.
- **Technologies Used**: React, Docker, Docker Compose, Bridge Network, AWS EC2, Axios, FastAPI, Langchain, OpenAI, PyPDFLoader.

## Project Architecture
### Frontend
- **Technologies:** Javascript, React, Axios, Docker
- **Port:** ``3000``
- **Key Features:**
  - Home page for uploading LinkedIn PDF and entering OpenAI API key.
  - Makes a POST request to the backend, sending the API key and PDF.
  - Renders a professional HTML resume by consuming the JSON response from the backend and applying it to a predefined HTML template using DOM manipulation.

### Backend
- **Technologies:** Python, FastAPI, PyPDFLoader, OpenAI, Langchain, Docker
- **Port:** ``8000``
- **Key Features:**
  - Receives a POST request with OpenAI API key and the uploaded PDF.
  - Utilizes PyPDFLoader to extract text from the PDF.
  - Passes the extracted content as context to OpenAI's LLM.
  - A function/tool-call schema is defined based on LinkedIn resume sections, and the LLM generates JSON output based on this schema.
  - Sends the generated JSON resume back to the frontend for rendering.

### Docker Setup
- **Frontend** and **Backend** are containerized using Docker.
- **Docker Compose** is used for setting up the services, enabling bridge networking between frontend and backend.
- Exposed Ports:
  - Frontend: ``localhost:3000``
  - Backend: ``localhost:8000``

### Workflow
```
+------------------------+                +------------------------+
|                        |                |                        |
|      User (Frontend)   |                |     System (Backend)   |
|                        |                |                        |
+------------------------+                +------------------------+
        |                                         |
        |  1. Uploads PDF and OpenAI API Key      |
        +---------------------------------------->|
        |                                         |
        |                                         v
        |                              +-----------------------+
        |                              |  FastAPI (Backend)    |
        |                              |   Receives POST req.  |
        |                              |   with PDF & API key  |
        |                              +-----------------------+
        |                                         |
        |                                         v
        |                              +-----------------------+
        |                              |  PyPDFLoader          |
        |                              |  Extracts text from   |
        |                              |  uploaded PDF         |
        |                              +-----------------------+
        |                                         |
        |                                         v
        |                              +-----------------------+
        |                              |   OpenAI LLM          |
        |                              |   Receives PDF content|
        |                              |   & Function Schema   |
        |                              +-----------------------+
        |                                         |
        |                                         v
        |                              +-----------------------+
        |                              |   Generates JSON      |
        |                              |   Based on Resume     |
        |                              +-----------------------+
        |                                         |
        |  2. JSON-based Resume                   |
        <-----------------------------------------+ 
        |                                         
        v                                         
+------------------------+                       
|                        |                       
|  React Frontend        |                       
|  Receives JSON         |                       
+------------------------+                      
        |                                        
        |                                         
        v                                         
+------------------------+                       
|                        |                      
|  DOM Manipulation      |                       
|  Renders HTML Resume   |                       
+------------------------+                       
```
## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/) on your machine.
- Install Docker Compose on your machine

## Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/WebResumeGenerator.git
   cd WebResumeGenerator
   ```
2. Build the Docker images for the frontend and backend:
    ```bash
    docker compose build
    ```
3. Run the Docker containers:
    ```bash
    docker compose up
    ```
4. The frontend will be accessible at port ``3000``

## Technologies Used
**Frontend:**
- React
- Axios for making HTTP requests
- Docker for containerization
- Docker Compose for service orchestration

**Backend:**
- FastAPI for building the API
- PyPDFLoader for extracting text from PDFs
- OpenAI LLM for generating a JSON-based resume
- Langchain for schema-based function/tool calling
- Docker for containerization

## Future Work (Time Limitations)
- **Session Management:** Implement JWT-based user sessions for secure data handling.
- **Database Persistence:** Integrate a SQLite database to store user sessions, PDF path s, and generated JSON resumes. This will allow session persistence and prevent reprocessing of the same PDF for authenticated users.
- **Editable JSON:** Allow users to preview, edit, and add additional content to the generated JSON before finalizing the resume.
- **Download:** Allow user to download thier generated reumse in HTML or PDF format
