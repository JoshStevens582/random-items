import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from random_items.config import settings
from random_items.routers.tasks import router as tasks_router

app = FastAPI(title=settings.app_title)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def run() -> None:
    uvicorn.run(
        "random_items.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
    )
