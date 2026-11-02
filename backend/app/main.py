import os
import json
from urllib.parse import quote_plus

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def search_vehicle_image(query: str) -> dict:
    api_url = "https://commons.wikimedia.org/w/api.php"

    headers = {
        "User-Agent": (
            "AutoInzicht/1.0 (contact: test@gmail.com) "
            "python-httpx"
        )
    }

    words = query.split()
    search_queries = [
        query,
        " ".join(words[:2]),
    ]

    try:
        async with httpx.AsyncClient(
            timeout=20.0,
            headers=headers,
            follow_redirects=True,
        ) as client:

            for search_query in search_queries:
                params = {
                    "action": "query",
                    "format": "json",
                    "generator": "search",
                    "gsrsearch": search_query,
                    "gsrnamespace": 6,
                    "gsrlimit": 20,
                    "prop": "imageinfo",
                    "iiprop": "url|size|extmetadata",
                    "iiurlwidth": 1200,
                }

                response = await client.get(
                    api_url,
                    params=params,
                )

                print(
                    f"Wikimedia status: {response.status_code}"
                )

                if response.status_code != 200:
                    print(
                        "Wikimedia response:",
                        response.text[:1000],
                    )
                    response.raise_for_status()

                data = response.json()

                if "error" in data:
                    print("Wikimedia API error:", data["error"])
                    continue

                pages = data.get("query", {}).get("pages", {})

                print(
                    f"Query '{search_query}' returned "
                    f"{len(pages)} results"
                )

                images = []

                search_terms = query.lower().split()

                for page in pages.values():
                    image_info = page.get("imageinfo", [])

                    if not image_info:
                        print(f"No imageinfo: {page.get('title')}")
                        continue

                    image = image_info[0]
                    width = image.get("width", 0)
                    height = image.get("height", 0)

                    title = page.get("title", "").lower()

                    if not any(term in title for term in search_terms):
                        continue

                    image_url = image.get(
                        "thumburl",
                        image.get("url"),
                    )

                    if not image_url:
                        continue

                    metadata = image.get("extmetadata", {})

                    images.append({
                        "image_url": image_url,
                        "original_url": image.get("url"),
                        "image_width": width,
                        "image_height": height,
                        "title": page.get("title", ""),
                        "license": metadata.get(
                            "LicenseShortName", {}
                        ).get("value", ""),
                        "artist": metadata.get(
                            "Artist", {}
                        ).get("value", ""),
                        "source_url": image.get(
                            "descriptionurl", ""
                        ),
                    })

                if images:
                    return images[0]

        return {"image_url": None}

    except (httpx.HTTPError, ValueError) as exc:
        print(f"Wikimedia image search failed: {exc}")
        return {"image_url": None}


@app.get("/api/vehicle/{vehicle_license_plate}")
async def get_vehicle_info(vehicle_license_plate: str):
    plate = (
        vehicle_license_plate.upper()
        .replace("-", "")
        .replace(" ", "")
    )

    rdw_app_token = os.getenv("RDW_APP_TOKEN")

    if not rdw_app_token:
        raise HTTPException(
            status_code=500,
            detail="RDW_APP_TOKEN is not configured",
        )

    api_url = (
        "https://opendata.rdw.nl/api/v3/views/"
        "m9d7-ebf2/query.json"
    )

    params = {
        "query": f"SELECT * WHERE kenteken = '{plate}'",
        "pageNumber": 1,
        "pageSize": 1,
        "app_token": rdw_app_token,
    }

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(15.0, connect=5.0)
    ) as client:
        response = await client.get(api_url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=(
                "RDW request failed with status "
                f"{response.status_code}"
            ),
        )

    data = response.json()

    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No vehicle found for license plate {plate}",
        )

    vehicle = data[0]

    brand = vehicle.get("merk") or ""
    model = vehicle.get("handelsbenaming") or ""
    registration_date = vehicle.get("datum_eerste_toelating") or ""

    year = (
        registration_date[:4]
        if len(registration_date) >= 4
        else ""
    )

    image_queries = [
    f"{brand} {model} {year}".strip(),
    f"{model} {year}".strip(),
    ]

    image_url = None

    if image_queries:
        image_data = None

        for query in image_queries:
            image_data = await search_vehicle_image(query)

            if image_data.get("image_url"):
                break

        image_url = (
            image_data.get("image_url")
            if image_data
            else None
        )
        image_url = image_data.get("image_url")

    return {
        "vehicle_license_plate": plate,
        "info": vehicle,
        "image_url": image_url,
    }


@app.get("/api/vehiclefueltype/{vehicle_license_plate}")
async def get_vehicle_fuel_type(vehicle_license_plate: str):
    plate = (
        vehicle_license_plate.upper()
        .replace("-", "")
        .replace(" ", "")
    )

    api_url = "https://opendata.rdw.nl/resource/8ys7-d773.json"

    params = {
        "kenteken": plate,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(api_url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=(
                "RDW request failed with status "
                f"{response.status_code}"
            ),
        )

    data = response.json()

    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No fuel information found for {plate}",
        )

    return {
        "vehicle_license_plate": plate,
        "info": data[0],
    }


@app.get("/api/vehiclegearbox")
async def get_gearbox(
    typegoedkeuringsnummer: str,
    variant: str,
    uitvoering: str,
):
    api_url = "https://opendata.rdw.nl/resource/7rjk-eycs.json"

    params = {
        "typegoedkeuringsnummer": typegoedkeuringsnummer,
        "codevarianttgk": variant,
        "codeuitvoeringtgk": uitvoering,
        "$limit": 1,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(api_url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=(
                "RDW request failed with status "
                f"{response.status_code}"
            ),
        )

    data = response.json()

    if not data:
        raise HTTPException(
            status_code=404,
            detail="No vehicle gearbox information found",
        )

    return {"info": data[0]}