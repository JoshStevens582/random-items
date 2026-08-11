from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from random_items.database import get_session


def get_db() -> Generator[Session, None, None]:
    yield from get_session()


DbSession = Annotated[Session, Depends(get_db)]
