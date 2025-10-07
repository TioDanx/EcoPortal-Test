// src/features/reviews/state/epics.ts
import { Epic } from "redux-observable";
import { AnyAction } from "@reduxjs/toolkit";
import { filter, switchMap, catchError, of } from "rxjs";
import { reviewsActions } from "./slice";
import { RootState } from "../../../state/store";
import { EpicDependencies } from "../../../state/types";
import {
  AllMoviesDocument,
  AllMoviesQuery,
  AllUsersDocument,
  AllUsersQuery,
  CreateMovieReviewDocument,
  CreateMovieReviewMutation,
  CreateMovieReviewMutationVariables,
} from "../../../generated/graphql";
import { GqlMovie, GqlReview, GqlUser } from "../../types/movie";

const isNonNull = <T>(v: T | null | undefined): v is T => v != null;

// --- MOVIES ---
export const fetchMoviesEpic: Epic<
  AnyAction,
  AnyAction,
  RootState,
  EpicDependencies
> = (action$, _state$, { client }) =>
  action$.pipe(
    filter(reviewsActions.fetchMoviesRequested.match),
    switchMap(() =>
      client
        .query<AllMoviesQuery>({ query: AllMoviesDocument, fetchPolicy: "network-only" })
        .then((result) => {
          const rawNodes = result.data.allMovies?.nodes ?? [];
          const movies = rawNodes.filter(isNonNull) as GqlMovie[];
          return reviewsActions.fetchMoviesLoaded({ movies });
        })
        .catch((err) =>
          reviewsActions.fetchMoviesFailed({ message: err?.message ?? "Unknown error" })
        )
    )
  );

// --- USERS ---
export const fetchUsersEpic: Epic<
  AnyAction,
  AnyAction,
  RootState,
  EpicDependencies
> = (action$, _state$, { client }) =>
  action$.pipe(
    filter(reviewsActions.fetchUsersRequested.match),
    switchMap(() =>
      client
        .query<AllUsersQuery>({ query: AllUsersDocument, fetchPolicy: "network-only" })
        .then((res) => {
          const raw = res.data.allUsers?.nodes ?? [];
          const users = raw.filter(isNonNull) as GqlUser[];
          return reviewsActions.fetchUsersLoaded({ users });
        })
        .catch(() => reviewsActions.fetchUsersFailed())
    )
  );

// --- ADD REVIEW ---
export const addReviewEpic: Epic<
  AnyAction,
  AnyAction,
  RootState,
  EpicDependencies
> = (action$, state$, { client }) =>
  action$.pipe(
    filter(
      (action): action is ReturnType<typeof reviewsActions.addReviewRequested> =>
        reviewsActions.addReviewRequested.match(action)
    ),
    switchMap(async (action) => {
      const { movieId, title, body, rating } = action.payload;

      const availableUsers = state$.value.reviews.users as GqlUser[];
      const randomUser =
        availableUsers.length > 0
          ? availableUsers[Math.floor(Math.random() * availableUsers.length)]
          : undefined;

      const fallbackUserIdFromMovie =
        state$.value.reviews.movies
          .find((m) => m.id === movieId)
          ?.movieReviewsByMovieId?.nodes?.[0]?.userByUserReviewerId?.id;

      const finalUserId =
        randomUser?.id ?? fallbackUserIdFromMovie ?? "00000000-0000-0000-0000-000000000001";

      const variables: CreateMovieReviewMutationVariables = {
        input: { movieReview: { movieId, title, body, rating, userReviewerId: finalUserId } },
      };

      try {
        const result = await client.mutate<
          CreateMovieReviewMutation,
          CreateMovieReviewMutationVariables
        >({
          mutation: CreateMovieReviewDocument,
          variables,
        });

        const created = result.data?.createMovieReview?.movieReview;
        if (!created) throw new Error("No review returned");

        const committedReview: GqlReview = {
          ...(created as unknown as GqlReview),
          userByUserReviewerId:
            (created as any)?.userByUserReviewerId ??
            randomUser ?? 
            {
              id: finalUserId,
              name: "Guest",
            },
        };

        return reviewsActions.addReviewCommitted({
          movieId,
          review: committedReview,
        });
      } catch {
        return reviewsActions.addReviewFailed();
      }
    }),
    catchError(() => of(reviewsActions.addReviewFailed()))
  );