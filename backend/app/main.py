import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.utils.response import error_response

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("thunder-x")

app = FastAPI(
    title="THUNDER-X Backend API",
    description="AI-Powered Hyperlocal Thunderstorm & Lightning Nowcasting Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_and_log(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000.0
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    logger.info(f"{request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return error_response(
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected server error occurred.",
        details={"error": str(exc)},
        status_code=500
    )


app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "project": "THUNDER-X",
        "description": "AI-Powered Hyperlocal Thunderstorm & Lightning Nowcasting Platform",
        "status": "ONLINE",
        "docs": "/docs",
        "api_prefix": "/api"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=settings.DEBUG)
