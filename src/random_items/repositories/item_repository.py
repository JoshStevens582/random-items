from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from random_items.db_models.item import Item
from random_items.models.item_create import ItemCreate
from random_items.models.item_update import ItemUpdate


class ItemRepository:
    def create(self, db: Session, payload: ItemCreate) -> Item:
        item = Item(content=payload.content, created_at=datetime.now(UTC))
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def get_all(self, db: Session) -> list[Item]:
        statement = select(Item).order_by(Item.id)
        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, item_id: int) -> Item | None:
        return db.get(Item, item_id)

    def update(self, db: Session, item: Item, payload: ItemUpdate) -> Item:
        if payload.content is not None:
            item.content = payload.content
        db.commit()
        db.refresh(item)
        return item

    def delete(self, db: Session, item: Item) -> None:
        db.delete(item)
        db.commit()
