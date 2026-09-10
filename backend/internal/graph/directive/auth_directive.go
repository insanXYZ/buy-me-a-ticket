package directive

import (
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/utils"
	"context"
	"errors"
	"slices"

	"github.com/99designs/gqlgen/graphql"
)

func AuthDirective(ctx context.Context, obj any, next graphql.Resolver, role []model.AuthRole) (res any, err error) {
	user, ok := utils.GetUserCtx(ctx)
	if !ok {
		return nil, errors.New("Unauthorized")
	}

	if slices.Contains(role, model.AuthRoleAll) {
		return next(ctx)
	}

	roleUser := user.Role

	if !slices.Contains(role, model.AuthRole(roleUser)) {
		return nil, errors.New("Unauthorized")
	}

	return next(ctx)
}
