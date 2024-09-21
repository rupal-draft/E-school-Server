import os
import uvicorn
import json
from dotenv import load_dotenv
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from model import recommend_course  # Assuming `recommend_course` is defined in `model`

# Create the Starlette app instance
app = Starlette()

# Load environment variables from .env file
load_dotenv()

# Enable CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    expose_headers=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define your endpoint
@app.route('/recommend')
async def get_recommendation(request):
    course = request.query_params.get('course', '')  # Retrieve the course parameter from the query string
    res = recommend_course(course)
    json_str = res.to_json(orient='records')
    json_obj_ans = json.loads(json_str)
    return JSONResponse({"data": json_obj_ans})

# Run the application
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
