import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx


load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"Hello": "World"}

@app.get("/api/vehicle/{vehicle_license_plate}")
async def get_vehicle_info(vehicle_license_plate: str):
    plate = vehicle_license_plate.upper().replace("-", "").replace(" ", "")
    rdw_app_token = os.getenv("RDW_APP_TOKEN")

    if not rdw_app_token:
        raise HTTPException(
            status_code=500,
            detail="RDW_APP_TOKEN is not configured",
        )

    api_url = "https://opendata.rdw.nl/api/v3/views/m9d7-ebf2/query.json"
    params = {
        "query": f"SELECT * WHERE kenteken = '{plate}'",
        "pageNumber": 1,
        "pageSize": 1,
        "app_token": rdw_app_token,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(api_url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"RDW request failed with status {response.status_code}",
        )

    data = response.json()
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No vehicle found for license plate {plate}",
        )

    return {"vehicle_license_plate": plate, "info": data[0]}