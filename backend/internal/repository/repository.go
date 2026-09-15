package repository

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository[T any] struct {
	db *gorm.DB
}

func (r *Repository[T]) Create(ctx context.Context, model *T) error {
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *Repository[T]) UpdateById(ctx context.Context, id any, model *T) error {
	return r.db.Where("id = ?", id).Updates(model).Error
}

func (r *Repository[T]) Tx(ctx context.Context, fn func(tx *gorm.DB) error) error {
	return r.db.WithContext(ctx).Transaction(fn)
}

func (r *Repository[T]) TakeByID(ctx context.Context, id any) (*T, error) {
	var dst T

	err := r.db.WithContext(ctx).Take(&dst, "id = ?", id).Error

	return &dst, err
}

func (r *Repository[T]) Save(ctx context.Context, model any) error {
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(model).Error
}

func (r *Repository[T]) DeleteByID(ctx context.Context, id any) error {
	var model T
	return r.db.WithContext(ctx).Delete(&model, "id = ?", id).Error
}

func (r *Repository[T]) DeleteByIDs(ctx context.Context, id any) error {
	var model T
	return r.db.WithContext(ctx).Delete(&model, id).Error
}
